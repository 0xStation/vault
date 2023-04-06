import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Button } from "@ui/Button"
import { Hyperlink } from "@ui/Hyperlink"
import { AvatarAddress } from "components/core/AvatarAddress"
import { InvoiceStatusWithIcon } from "components/invoices/InvoiceStatusWithIcon"
import { encodeTokenTransfer } from "lib/encodings/token"
import decimalToBigNumber from "lib/utils/decimalToBigNumber"
import { getLocalDateFromDateString } from "lib/utils/getLocalDate"
import networks from "lib/utils/networks"
import { useGenInvoiceClaimCall } from "models/invoice/hooks/useGenInvoiceClaimCall"
import { useSendCreateInvoiceEmail } from "models/invoice/hooks/useSendCreateInvoiceEmail"
import { Invoice, InvoiceStatus } from "models/invoice/types"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSendTransaction } from "wagmi"
import { useInvoiceStatus } from "../../../../hooks/invoice/useInvoiceStatus"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { useToast } from "../../../../hooks/useToast"

export const InvoiceDetailsContent = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { genInvoiceClaimCall } = useGenInvoiceClaimCall(invoice)

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
  const { invoiceStatus } = useInvoiceStatus({ invoice })
  const { primaryWallet, setShowAuthFlow } = useDynamicContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isInvoiceRecipient = invoice?.data?.splits?.some(
    (split) => split?.address === primaryWallet?.address,
  )

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })
  const { errorToast } = useToast()

  // hide ability to claim if there are no funds to collect for the connect wallet address
  const showClaimPayButton =
    (isInvoiceRecipient === false &&
      invoiceStatus === InvoiceStatus.PAYMENT_PENDING) ||
    (isInvoiceRecipient === true &&
      invoiceStatus !== InvoiceStatus.PAYMENT_PENDING)

  // prepareSplitsDistributeCall

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
      await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          chainId: chainId,
          to,
          value,
          data,
        },
      })
    } catch (err) {
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
    setIsLoading(false)
  }

  const handlePayInvoice = async () => {
    setIsLoading(true)
    if (!primaryWallet?.address) {
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
      setIsLoading(false)
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
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="my-6">
            {isSigner && (
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
      <section className="p-4">
        <div className="mb-6 flex flex-col">
          <h3 className="font-regular mt-6 mb-4">Recipients</h3>
          <div className="space-y-2">
            {invoice?.data?.splits.map((split) => {
              return (
                <div
                  className="flex flex-row items-center justify-between"
                  key={split?.address}
                >
                  <AvatarAddress address={split?.address} />
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
        {isInvoiceRecipient ? (
          <Button fullWidth onClick={handleClaimPayment} loading={isLoading}>
            Claim payment
          </Button>
        ) : (
          <Button fullWidth onClick={handlePayInvoice} loading={isLoading}>
            Pay this invoice
          </Button>
        )}
        <p className="mt-2 text-left text-xs text-gray-50">
          This action will be recorded on-chain. You&apos;ll be directed to
          exxecute.
        </p>
      </div>
    </div>
  )
}

export default InvoiceDetailsContent
