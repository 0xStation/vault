import axios from "axios"
import { getUrlHost } from "lib/utils/getUrlHost"

export const notifyNewProposal = async (proposalId: string) => {
  const url = getUrlHost() + "/api/v1/notify/newProposal"

  try {
    await axios.post<any[]>(
      url,
      { proposalId },
      {
        headers: {
          Authorization: process.env.INTERNAL_NOTIFY_SECRET as string,
        },
      },
    )
  } catch (e) {
    console.error("Error notifying on new proposal: ", e)
  }
}
