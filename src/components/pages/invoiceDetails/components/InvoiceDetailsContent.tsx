import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Button } from "@ui/Button"
import { Hyperlink } from "@ui/Hyperlink"
import { AvatarAddress } from "components/core/AvatarAddress"
import { ClaimInvoiceStatusIcon } from "components/invoices/ClaimInvoiceStatusIcon"
import { InvoiceStatusWithIcon } from "components/invoices/InvoiceStatusWithIcon"
import { encodeTokenTransfer } from "lib/encodings/token"
import decimalToBigNumber from "lib/utils/decimalToBigNumber"
import { getLocalDateFromDateString } from "lib/utils/getLocalDate"
import networks, { getNetworkExplorer } from "lib/utils/networks"
import { useGenInvoiceClaimCall } from "models/invoice/hooks/useGenInvoiceClaimCall"
import { useInvoice } from "models/invoice/hooks/useInvoice"
import { useSendCreateInvoiceEmail } from "models/invoice/hooks/useSendCreateInvoiceEmail"
import {
  ClaimedInvoiceStatus,
  Invoice,
  InvoiceStatus,
} from "models/invoice/types"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import { useInvoiceStatus } from "../../../../hooks/invoice/useInvoiceStatus"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { useToast } from "../../../../hooks/useToast"

export const InvoiceDetailsContent = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  // fetch invoice to retrieve subgraph data
  const { data: fetchedInvoice } = useInvoice(invoice?.id)
  const { genInvoiceClaimCall } = useGenInvoiceClaimCall(
    fetchedInvoice as Invoice,
  )

  const { terminal } = useTerminalByChainIdAndSafeAddress(
    address as string,
    chainId as number,
  )
  const blockExplorer = (networks as Record<string, any>)?.[String(chainId)]
    ?.explorer
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const { sendCreateInvoiceEmail } = useSendCreateInvoiceEmail(
    invoice?.id as string,
  )
  const { successToast } = useToast()
  const { invoiceStatus } = useInvoiceStatus({
    invoice: fetchedInvoice as Invoice,
  })
  const { primaryWallet, setShowAuthFlow } = useDynamicContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isInvoiceRecipient = invoice?.data?.splits?.some(
    (split) => split?.address === primaryWallet?.address,
  )

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })
  const { errorToast } = useToast()

  const activeUserClaimedMetadata =
    fetchedInvoice?.recipientsClaimedMetadata?.[
      // @ts-ignore
      primaryWallet?.address?.toLowerCase()
    ]

  const activeUserSplit = isInvoiceRecipient
    ? fetchedInvoice?.data?.splits?.find(
        (split) => split?.address === primaryWallet?.address,
      )
    : { value: 0 }

  const activeUserClaimStatus =
    activeUserClaimedMetadata?.totalClaimed >=
    decimalToBigNumber(
      parseFloat(invoice?.data?.totalAmount || "0") *
        ((activeUserSplit?.value || 1) * 1e-2),
      activeUserClaimedMetadata?.token?.decimals,
    ).toString()
      ? ClaimedInvoiceStatus?.CLAIMED
      : ClaimedInvoiceStatus?.UNCLAIMED

  // hide ability to claim if there are no funds to collect for the connect wallet address
  const showClaimPayButton =
    (isInvoiceRecipient === false &&
      invoiceStatus === InvoiceStatus.PAYMENT_PENDING) ||
    (isInvoiceRecipient === true &&
      activeUserClaimStatus === ClaimedInvoiceStatus?.UNCLAIMED &&
      invoiceStatus !== InvoiceStatus.PAYMENT_PENDING &&
      invoiceStatus !== InvoiceStatus.COMPLETED)

  const [claimTxHash, setClaimTxHash] = useState<string>()

  const { isSuccess: isClaimSuccess } = useWaitForTransaction({
    chainId,
    hash: claimTxHash as `0x${string}`,
    enabled: !!chainId && !!claimTxHash,
    onSuccess: () => {
      setIsLoading(false)
      successToast({
        message: "Successful claim!",
        action: {
          href: `${getNetworkExplorer(chainId || 0)}/tx/${claimTxHash}`,
          label: "View on Etherscan",
        },
        timeout: 5000,
      })
    },
  })

  const handleClaimPayment = async () => {
    setIsLoading(true)

    if (!isInvoiceRecipient) {
      errorToast({ message: "Not eligible to claim" })
      return
    }

    const transactionData = genInvoiceClaimCall({
      recipientAddress: primaryWallet?.address as string,
    })

    const { to, value, data } = transactionData

    try {
      const transaction = await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          chainId: chainId,
          to,
          value,
          data,
        },
      })
      setClaimTxHash(transaction?.hash)
      successToast({ message: "Claiming initiated" })
    } catch (err) {
      setIsLoading(false)
      console.error(err)
      if (
        // @ts-ignore
        err.code === 4001 ||
        // @ts-ignore
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        errorToast({ message: "Signature was rejected" })
      } else {
        errorToast({ message: "Something went wrong!" })
      }
    }
  }

  const [paymentTxHash, setPaymentTxHash] = useState<string>()

  const { isSuccess: isPaymentSuccess } = useWaitForTransaction({
    chainId,
    hash: paymentTxHash as `0x${string}`,
    enabled: !!chainId && !!paymentTxHash,
    onSuccess: () => {
      setIsLoading(false)
      successToast({
        message: "Successful payment!",
        action: {
          href: `${getNetworkExplorer(chainId || 0)}/tx/${paymentTxHash}`,
          label: "View on Etherscan",
        },
        timeout: 5000,
      })
    },
  })

  const handlePayInvoice = async () => {
    setIsLoading(true)
    if (!primaryWallet?.address) {
      setIsLoading(false)
      setShowAuthFlow(true)
      return
    }

    try {
      const prepareTokenTransferCall = encodeTokenTransfer({
        sender: primaryWallet?.address as string,
        recipient: invoice?.data?.paymentAddress,
        token: invoice?.data?.token,
        value: decimalToBigNumber(
          parseFloat(invoice?.data?.totalAmount),
          invoice?.data?.token?.decimals as number,
        ).toString(),
      })
      const { to, value, data } = prepareTokenTransferCall

      const transaction = await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          chainId: chainId,
          to,
          value,
          data,
        },
      })
      setPaymentTxHash(transaction?.hash)
      successToast({ message: "Transaction initiated" })
    } catch (err) {
      setIsLoading(false)
      console.error(err)

      if (
        // @ts-ignore
        err.code === 4001 ||
        // @ts-ignore
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        errorToast({ message: "Signature was rejected" })
      } else {
        errorToast({ message: "Something went wrong!" })
      }
    }
  }

  return (
    <div className="divide-y divide-gray-90 pb-32">
      <section className="p-4">
        <InvoiceStatusWithIcon status={invoiceStatus} className="mt-6" />
        <div className="mt-6">
          <h1 className="mb-2">
            {invoice?.data?.totalAmount} {invoice?.data?.token?.symbol}
          </h1>
          <table className="w-full">
            <tbody className="[&>tr>td]:pb-2">
              <tr>
                <td className="text-gray-50">To</td>
                <td>{invoice?.data?.clientName}</td>
              </tr>
              <tr>
                <td className="text-gray-50">From</td>
                <td>{terminal?.data?.name}</td>
              </tr>
              <tr>
                <td className="text-gray-50">Amount</td>
                <td>
                  {invoice?.data?.totalAmount} {invoice?.data?.token?.symbol}
                </td>
              </tr>
              <tr>
                <td className="text-gray-50">Date created</td>
                {/* prisma's date isn't a Javascript date object but an ISO 8601-formatted string */}
                <td>
                  {getLocalDateFromDateString(
                    invoice?.createdAt as unknown as string,
                  )}
                </td>
              </tr>
              <tr>
                <td className="text-gray-50">Invoice ID</td>
                <td>
                  <Hyperlink
                    href={`${blockExplorer}/address/${invoice?.data?.paymentAddress}`}
                    label={invoice?.data?.paymentAddress?.substring(0, 8)}
                    size="base"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="my-6">
            {(isSigner || isInvoiceRecipient) &&
              invoiceStatus === InvoiceStatus.PAYMENT_PENDING && (
                // TODO: rate-limit the amount of emails sent with a set timeout
                <Button
                  variant="secondary"
                  fullWidth={true}
                  onClick={() => {
                    sendCreateInvoiceEmail()
                    successToast({ message: "Sent!" })
                  }}
                >
                  Remind
                </Button>
              )}
          </div>
        </div>
      </section>
      {invoice?.data?.note && (
        <section className="py-6 px-4">
          <h3 className="font-regular mb-4">Note</h3>
          <p className="">{invoice?.data?.note}</p>
        </section>
      )}
      <section className="p-4">
        <div className="mb-6 flex flex-col">
          <h3 className="font-regular mt-6 mb-4">Recipients</h3>
          <div className="space-y-2">
            {fetchedInvoice?.data?.splits.map((split) => {
              const claimedMetadata =
                fetchedInvoice?.recipientsClaimedMetadata?.[
                  // @ts-ignore
                  split?.address?.toLowerCase()
                ]

              const claimStatus =
                claimedMetadata?.totalClaimed >=
                decimalToBigNumber(
                  parseFloat(invoice?.data?.totalAmount) *
                    (split?.value * 1e-2),
                  claimedMetadata?.token?.decimals,
                ).toString()
                  ? ClaimedInvoiceStatus?.CLAIMED
                  : ClaimedInvoiceStatus?.UNCLAIMED

              return (
                <div
                  className="flex flex-row items-center justify-between"
                  key={split?.address}
                >
                  <div className="flex flex-row items-center space-x-2">
                    {claimStatus && (
                      <ClaimInvoiceStatusIcon status={claimStatus} />
                    )}
                    <AvatarAddress address={split?.address} />
                  </div>
                  <p className="text-gray-50">{split?.value}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <div
        className={`${
          showClaimPayButton ? "block" : "hidden"
        } fixed bottom-0 w-full max-w-[580px] border-t border-gray-80 bg-black px-4 pt-3 pb-6`}
      >
        {isInvoiceRecipient &&
        invoiceStatus !== InvoiceStatus.PAYMENT_PENDING &&
        invoiceStatus !== InvoiceStatus.COMPLETED ? (
          <Button
            fullWidth
            onClick={handleClaimPayment}
            loading={isLoading}
            disabled={isClaimSuccess}
          >
            Claim payment
          </Button>
        ) : !isInvoiceRecipient ? (
          <Button
            fullWidth
            onClick={handlePayInvoice}
            loading={isLoading}
            disabled={isPaymentSuccess}
          >
            Pay this invoice
          </Button>
        ) : null}
        <p className="mt-2 text-left text-xs text-gray-50">
          This action will be recorded on-chain. You&apos;ll be directed to
          execute.
        </p>
      </div>
    </div>
  )
}

export default InvoiceDetailsContent
