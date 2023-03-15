import { MailService as SendGrid } from "@sendgrid/mail"
import { getUrlHost } from "../utils/getUrlHost"
import { requireEnv } from "../utils/requireEnv"

export const SENDGRID_TEMPLATES = {
  NEW_PROPOSAL: "d-4aa7e8bf1a2145f99e3f90d65e37251a",
  NEW_COMMENT: "d-2eb70172e6e04d63a454088b4ed010c4",
  NEW_PROPOSAL_EXECUTION: "",
  NEW_PROPOSAL_READY_FOR_EXECUTION: "",
  NEW_PROPOSAL_READY_FOR_CLAIMING: "",
}

const sendgrid = new SendGrid()
sendgrid.setApiKey(requireEnv("SENDGRID_API_KEY"))
const hostname = getUrlHost()

type EmailArgs = {
  recipients: string[]
}

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
  claimAmount,
  terminalName,
  requestId,
  chainName,
  safeAddress,
}: {
  recipients: string[]
  claimAmount: string
  terminalName: string
  requestId: string
  chainName: string
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    claimAmount,
    terminalName,
    buttonLink: `${hostname}/${chainName}:${safeAddress}/proposals/${requestId}`,
  }

  await email(
    recipients,
    SENDGRID_TEMPLATES.NEW_PROPOSAL_READY_FOR_CLAIMING,
    dynamicTemplateData,
  )
}

export const sendNewProposalReadyForExecutionEmail = async ({
  recipients,
  proposalExecutedBy,
  proposalTitle,
  executionNote,
  terminalName,
  requestId,
  chainName,
  safeAddress,
}: {
  recipients: string[]
  proposalExecutedBy: string
  proposalTitle: string
  executionNote: string
  terminalName: string
  requestId: string
  chainName: string
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    proposalExecutedBy,
    proposalTitle,
    executionNote,
    terminalName,
    buttonLink: `${hostname}/${chainName}:${safeAddress}/proposals/${requestId}`,
  }

  await email(
    recipients,
    SENDGRID_TEMPLATES.NEW_PROPOSAL_READY_FOR_EXECUTION,
    dynamicTemplateData,
  )
}

export const sendNewProposalExecutionEmail = async ({
  recipients,
  proposalExecutedBy,
  proposalTitle,
  executionNote,
  terminalName,
  requestId,
  chainName,
  safeAddress,
}: {
  recipients: string[]
  proposalExecutedBy: string
  proposalTitle: string
  executionNote: string
  terminalName: string
  requestId: string
  chainName: string
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    proposalExecutedBy,
    proposalTitle,
    executionNote,
    terminalName,
    buttonLink: `${hostname}/${chainName}:${safeAddress}/proposals/${requestId}`,
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
  chainName,
  safeAddress,
}: {
  recipients: string[]
  commentCreatedBy: string
  commentBody: string
  requestId: string
  chainName: string
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    commentCreatedBy,
    commentBody,
    buttonLink: `${hostname}/${chainName}:${safeAddress}/proposals/${requestId}`,
  }

  await email(recipients, SENDGRID_TEMPLATES.NEW_COMMENT, dynamicTemplateData)
}

export const sendNewProposalEmail = async ({
  recipients,
  proposalCreatedBy,
  proposalTitle,
  terminalName,
  requestId,
  chainName,
  safeAddress,
}: {
  recipients: string[]
  proposalCreatedBy: string
  proposalTitle: string
  terminalName: string
  requestId: string
  chainName: string
  safeAddress: string
}) => {
  const dynamicTemplateData = {
    proposalCreatedBy,
    proposalTitle,
    terminalName,
    buttonLink: `${hostname}/${chainName}:${safeAddress}/proposals/${requestId}`,
  }

  await email(recipients, SENDGRID_TEMPLATES.NEW_PROPOSAL, dynamicTemplateData)
}
