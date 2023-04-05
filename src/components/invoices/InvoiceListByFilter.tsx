import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { Hyperlink } from "@ui/Hyperlink"
import RightSlider from "@ui/RightSlider"
import { CollaboratorPfps } from "components/core/CollaboratorPfps"
import { InvoiceTypeTab } from "components/core/TabBars/InvoiceTabBar"
import { EmptyState } from "components/emptyStates/EmptyState"
import InvoiceDetailsContent from "components/pages/invoiceDetails/components/InvoiceDetailsContent"
import { getLocalDateFromDateString } from "lib/utils/getLocalDate"
import networks from "lib/utils/networks"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { useInvoices } from "models/invoice/hooks/useInvoices"
import { Invoice } from "models/invoice/types"
import { parseGlobalId } from "models/terminal/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { useHideInvoiceWithFilter } from "../../hooks/invoice/useHideInvoiceWithFilter"
import { usePermissionsStore } from "../../hooks/stores/usePermissionsStore"
import { InvoiceStatusIcon } from "./InvoiceStatusIcon"

const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter()
  const blockExplorer = (networks as Record<string, any>)?.[
    String(invoice?.chainId)
  ]?.explorer
  const { show, invoiceStatus } = useHideInvoiceWithFilter({ invoice })
  return (
    <li
      className={`${
        show ? "block" : "hidden"
      } border-b border-gray-90 py-3 px-4 hover:bg-gray-90`}
      key={invoice?.id}
    >
      <Link
        href={`/${router.query.chainNameAndSafeAddress}/invoices/${invoice?.id}`}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <InvoiceStatusIcon status={invoiceStatus} />
            <p>{invoice?.data?.clientName}</p>
          </div>
          <div className="text-gray-50">
            {getLocalDateFromDateString(
              invoice?.createdAt as unknown as string,
            )}
          </div>
        </div>

        <div className="my-3 flex flex-row space-x-2">
          <Hyperlink
            href={`${blockExplorer}/address/${invoice?.data?.paymentAddress}`}
            label={invoice?.data?.paymentAddress?.substring(0, 8)}
            size="base"
          />
          <p>
            {invoice?.data?.totalAmount} {invoice?.data?.token?.symbol}
          </p>
        </div>

        <CollaboratorPfps
          addresses={invoice?.data?.splits?.map(({ address }) => address)}
          size="sm"
        />
      </Link>
    </li>
  )
}

const InvoiceTableRow = ({
  invoice,
  setSelectedInvoice,
  setInvoiceDetailsSliderOpen,
}: {
  invoice: Invoice
  setSelectedInvoice: Dispatch<SetStateAction<Invoice | undefined>>
  setInvoiceDetailsSliderOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const blockExplorer = (networks as Record<string, any>)?.[
    String(invoice?.chainId)
  ]?.explorer
  const { show, invoiceStatus } = useHideInvoiceWithFilter({ invoice })
  return (
    <tr
      key={invoice?.id}
      className={`${show ? "" : "hidden"} h-10 items-center hover:bg-gray-90`}
      onClick={() => {
        addQueryParam(router, "invoiceId", invoice.id)
        setSelectedInvoice(invoice)
        setInvoiceDetailsSliderOpen(true)
      }}
    >
      <td className="pl-4">
        <div className="flex flex-row items-center space-x-4">
          <InvoiceStatusIcon status={invoiceStatus} />
          <p>{invoice?.data?.clientName}</p>
        </div>
      </td>
      <td className="">
        <Hyperlink
          href={`${blockExplorer}/address/${invoice?.data?.paymentAddress}`}
          label={invoice?.data?.paymentAddress?.substring(0, 8)}
        />
      </td>
      <td>
        {invoice?.data?.totalAmount} {invoice?.data?.token?.symbol}
      </td>
      <td className="text-gray-50">
        {getLocalDateFromDateString(invoice?.createdAt as unknown as string)}
      </td>
      <td>
        <CollaboratorPfps
          addresses={invoice?.data?.splits?.map(({ address }) => address)}
          size="base"
        />
      </td>
    </tr>
  )
}

export const InvoiceListByFilter = ({ filter }: { filter: InvoiceTypeTab }) => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { isLoading, invoices } = useInvoices(chainId, address)
  const noInvoices = !isLoading && invoices?.length === 0

  const { isMobile } = useBreakpoint()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>()
  const [invoiceDetailsSliderOpen, setInvoiceDetailsSliderOpen] =
    useState<boolean>(false)
  const closeInvoiceDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "invoiceId")
      setInvoiceDetailsSliderOpen(false)
    }
  }

  const emptyStateTitle = isSigner ? "Generate an invoice" : "No invoices"
  const emptyStateSubtitle = isSigner
    ? "Station Invoice is built to save you time and get you and your contributors paid faster. Generate an invoice and send to your client in minutes."
    : "This Project doesn't have any Invoices."

  return (
    <>
      {/* TODO: dynamically import */}
      {selectedInvoice && (
        <RightSlider
          open={invoiceDetailsSliderOpen}
          setOpen={closeInvoiceDetailsSlider}
          useInnerPadding={false}
        >
          <InvoiceDetailsContent invoice={selectedInvoice} />
        </RightSlider>
      )}
      {isLoading ? (
        <></>
      ) : noInvoices ? (
        <div className="flex h-[calc(100%-49px)] px-4 pb-4 pt-4 sm:h-full sm:px-0">
          <EmptyState title={emptyStateTitle} subtitle={emptyStateSubtitle}>
            {isSigner ? (
              <>
                <span className="mx-auto">
                  <Button
                    onClick={() => {
                      if (isMobile) {
                        router.push(
                          `/${router.query.chainNameAndSafeAddress}/invoices/new`,
                        )
                      } else {
                        addQueryParam(router, "createInvoiceSliderOpen", "true")
                      }
                    }}
                  >
                    Generate
                  </Button>
                </span>
              </>
            ) : null}
          </EmptyState>
        </div>
      ) : isMobile ? (
        <ul className="border-t border-gray-90 px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
          {invoices?.map((invoice) => (
            <InvoiceCard invoice={invoice} key={invoice?.id} />
          ))}
        </ul>
      ) : (
        <table className="w-full table-auto">
          <thead className="text-xs text-gray-50 [&>tr>th]:font-normal">
            <tr className="[&>th]:pb-5 [&>th]:text-left">
              <th className="pl-12">Client</th>
              <th>Invoice ID</th>
              <th>Amount</th>
              <th>Created</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((invoice, idx) => {
              return (
                <InvoiceTableRow
                  key={invoice?.id}
                  invoice={invoice}
                  setSelectedInvoice={setSelectedInvoice}
                  setInvoiceDetailsSliderOpen={setInvoiceDetailsSliderOpen}
                />
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
