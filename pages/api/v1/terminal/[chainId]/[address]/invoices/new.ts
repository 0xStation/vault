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

  const {
    clientName,
    clientEmail,
    note,
    totalAmount,
    paymentAddress,
    splits,
    token,
  } = body

  // TODO: validate body values

  const invoiceMetadata: InvoiceMetadata = {
    paymentAddress,
    splits,
    clientName,
    clientEmail,
    note,
    totalAmount,
    token,
  }

  let latestInvoice
  try {
    latestInvoice = await db.invoice.findFirst({
      where: {
        terminalAddress: query.address as string,
        chainId: parseInt(query.chainId as string),
      },
      orderBy: {
        number: "desc",
      },
    })
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    return res.end(JSON.stringify(`Internal error: ${err}`))
  }

  try {
    const invoice = await db.invoice.create({
      data: {
        chainId: parseInt(query.chainId as string),
        terminalAddress: query.address as string,
        number: (latestInvoice?.number || 0) + 1,
        data: invoiceMetadata,
      },
      include: {
        terminal: true,
      },
    })

    if (!invoice) {
      throw Error("Failure creating invoice")
    }

    sendNewInvoiceEmail({
      recipients: [clientEmail as string],
      clientName: clientName as string,
      invoiceAmount: totalAmount as string,
      tokenSymbol: token?.symbol as string,
      localDate: getLocalDateFromDateString(
        invoice?.createdAt as unknown as string,
      ),
      paymentAddress: paymentAddress as string,
      terminalName: (invoice?.terminal?.data as TerminalMetadata)
        ?.name as string,
      chainId: invoice?.terminal?.chainId,
      terminalAddress: invoice?.terminal?.safeAddress,
      invoiceId: invoice?.id,
    })
    return res.status(200).json(invoice)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    return res.end(JSON.stringify(`Internal error: ${err}`))
  }
}
