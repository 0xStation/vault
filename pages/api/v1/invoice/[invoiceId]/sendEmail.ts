import db from "db"
import { sendNewInvoiceEmail } from "lib/sendgrid"
import { getLocalDateFromDateString } from "lib/utils/getLocalDate"
import { InvoiceMetadata } from "models/invoice/types"
import { TerminalMetadata } from "models/terminal/types"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  // TODO: validate body values

  let invoice
  try {
    invoice = await db.invoice.findUnique({
      where: {
        id: query.invoiceId as string,
      },
      include: {
        terminal: true,
      },
    })

    if (!invoice) {
      throw Error("Failure fetching invoice")
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    return res.end(JSON.stringify(`Internal error: ${err}`))
  }

  sendNewInvoiceEmail({
    recipients: [(invoice?.data as InvoiceMetadata)?.clientEmail as string],
    clientName: (invoice?.data as InvoiceMetadata)?.clientName as string,
    invoiceAmount: (invoice?.data as InvoiceMetadata)?.totalAmount as string,
    tokenSymbol: (invoice?.data as InvoiceMetadata)?.token?.symbol as string,
    localDate: getLocalDateFromDateString(
      invoice?.createdAt as unknown as string,
    ),
    paymentAddress: (invoice?.data as InvoiceMetadata)
      ?.paymentAddress as string,
    terminalName: (invoice?.terminal?.data as TerminalMetadata)?.name as string,
    chainId: invoice?.terminal?.chainId,
    terminalAddress: invoice?.terminal?.safeAddress,
    invoiceId: invoice?.id,
    reminder: body?.reminder || undefined,
  })
    .then((data) => res.status(200))
    // silently fail
    .catch((err) => {
      console.error("Failed to send email", err)
    })
}
