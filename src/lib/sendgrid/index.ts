import { MailService as SendGrid } from "@sendgrid/mail"
import truncateString from "lib/utils"
import { globalId } from "models/terminal/utils"
import { getUrlHost } from "../utils/getUrlHost"
import { requireEnv } from "../utils/requireEnv"

export const SENDGRID_TEMPLATES = {
  NEW_PROPOSAL: "d-4aa7e8bf1a2145f99e3f90d65e37251a",
  NEW_COMMENT: "d-2eb70172e6e04d63a454088b4ed010c4",
  NEW_PROPOSAL_EXECUTION: "d-03866801d8cd4d54b898ccf742ebd562",
  NEW_PROPOSAL_READY_FOR_EXECUTION: "d-9154fbd7f1224318b00b7e0908082bf4",
  NEW_PROPOSAL_READY_FOR_CLAIMING: "d-320b49ba370b4d16a01c14a7f9a7e12f",
}

const sendgrid = new SendGrid()
sendgrid.setApiKey(requireEnv("SENDGRID_API_KEY"))
const hostname = getUrlHost()

const email = async (
  recipients: string[],
  templateId: string,
  dynamicTemplateData: any,
) => {
  if (recipients.length === 0) {
    console.log("no recipient emails provided")
    return
  }

  const mail = {
    to: recipients,
    isMultiple: true,
    from: {
      name: "Station",
      email: "notifications@station.express",
    },
    templateId,
    dynamicTemplateData,
  }

  try {
    await sendgrid.send(mail)
  } catch (e) {
    console.error(e)
  }
}

export const sendNewProposalReadyForClaimingEmail = async ({
  recipients,
  terminalName,
  requestId,
  chainId,
  safeAddress,
}: {
  recipients: string[]
  terminalName: string
  requestId: string
  chainId: number
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    terminalName,
    buttonLink: `${hostname}/${globalId(
      chainId,
      safeAddress,
    )}/proposals/${requestId}`,
  }

  await email(
    recipients,
    SENDGRID_TEMPLATES.NEW_PROPOSAL_READY_FOR_CLAIMING,
    dynamicTemplateData,
  )
}

export const sendNewProposalReadyForExecutionEmail = async ({
  recipients,
  proposalTitle,
  terminalName,
  requestId,
  chainId,
  safeAddress,
}: {
  recipients: string[]
  proposalTitle: string
  terminalName: string
  requestId: string
  chainId: number
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    proposalTitle,
    terminalName,
    buttonLink: `${hostname}/${globalId(
      chainId,
      safeAddress,
    )}/proposals/${requestId}`,
  }

  await email(
    recipients,
    SENDGRID_TEMPLATES.NEW_PROPOSAL_READY_FOR_EXECUTION,
    dynamicTemplateData,
  )
}

export const sendNewProposalExecutionEmail = async ({
  recipients,
  proposalTitle,
  terminalName,
  requestId,
  chainId,
  safeAddress,
}: {
  recipients: string[]
  proposalTitle: string
  terminalName: string
  requestId: string
  chainId: number
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    proposalTitle,
    terminalName,
    buttonLink: `${hostname}/${globalId(
      chainId,
      safeAddress,
    )}/proposals/${requestId}`,
  }

  await email(
    recipients,
    SENDGRID_TEMPLATES.NEW_PROPOSAL_EXECUTION,
    dynamicTemplateData,
  )
}

export const sendNewCommentEmail = async ({
  recipients,
  commentCreatedBy,
  commentBody,
  requestId,
  terminalName,
  chainId,
  safeAddress,
}: {
  recipients: string[]
  commentCreatedBy: string
  commentBody: string
  requestId: string
  terminalName: string
  chainId: number
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    terminalName,
    commentCreatedBy: truncateString(commentCreatedBy, 6),
    commentBody,
    buttonLink: `${hostname}/${globalId(
      chainId,
      safeAddress,
    )}/proposals/${requestId}`,
  }

  await email(recipients, SENDGRID_TEMPLATES.NEW_COMMENT, dynamicTemplateData)
}

export const sendNewProposalEmail = async ({
  recipients,
  proposalCreatedBy,
  proposalTitle,
  requestId,
  chainId,
  safeAddress,
  terminalName,
}: {
  recipients: string[]
  proposalCreatedBy: string
  proposalTitle: string
  requestId: string
  chainId: number
  safeAddress: string
  terminalName: string
}) => {
  const dynamicTemplateData = {
    proposalCreatedBy: truncateString(proposalCreatedBy, 6),
    proposalTitle,
    terminalName,
    buttonLink: `${hostname}/${globalId(
      chainId,
      safeAddress,
    )}/proposals/${requestId}`,
  }

  await email(recipients, SENDGRID_TEMPLATES.NEW_PROPOSAL, dynamicTemplateData)
}
