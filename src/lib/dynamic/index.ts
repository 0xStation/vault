import axios from "axios"

export const updateUserEmail = async (userId: string, email: string) => {
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.DYNAMIC_API_KEY}`,
    },
  }

  try {
    const response = await axios.put(
      `https://app.dynamic.xyz/api/v0/users/${userId}`,
      JSON.stringify({ email }),
      options,
    )
    return response
  } catch (err) {
    console.error(err)
  }
}
