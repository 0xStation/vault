import axios from "axios"

export const notifyNewProposal = async (proposalId: string) => {
  const url = "http://localhost:3000/api/v1/notify/newProposal"

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
