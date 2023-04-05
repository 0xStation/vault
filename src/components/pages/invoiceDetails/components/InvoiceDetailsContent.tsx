import { QuorumNotMet } from "@icons/status/QuorumNotMet"
import { Button } from "@ui/Button"
import { Hyperlink } from "@ui/Hyperlink"
import { AvatarAddress } from "components/core/AvatarAddress"
import { getLocalDateFromDateString } from "lib/utils/getLocalDate"
import networks from "lib/utils/networks"
import { useSendCreateInvoiceEmail } from "models/invoice/hooks/useSendCreateInvoiceEmail"
import { Invoice } from "models/invoice/types"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { useToast } from "../../../../hooks/useToast"

export const InvoiceDetailsContent = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
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

  return (
    <div className="divide-y divide-gray-90 pb-32">
      <section className="p-4">
        <div className="mt-6 flex flex-row items-center space-x-3">
          {/* TODO: Change the status to not be hardcoded */}
          <QuorumNotMet />
          <span>Payment pending</span>
        </div>
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
              // TODO: rate-limit the amount of emails sent
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
    </div>
  )
}

export default InvoiceDetailsContent
