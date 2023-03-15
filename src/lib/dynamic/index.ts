import axios from "axios"

export const updateUserEmail = async (
  environmentId: string,
  email: string,
  token: string,
) => {
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `https://app.dynamic.xyz/api/v0/sdk/${environmentId}/users`,
      JSON.stringify({ email }),
      options,
    )
    return response
  } catch (err) {
    console.error(err)
  }
}

// todo: fix this to get the proper emails
export const getEmails = (addresses: string[]) => {
  return addresses.map((address) => {
    return "frog@station.express"
  })
}
