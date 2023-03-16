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

export const demo = () => {
  const options = {
    url: "https://app.dynamic.xyz/api/v0/environments/3ae79ace-36b0-445c-b397-5191d7cf83d3/users",
    params: {
      filterColumn: "walletPublicKey",
      filterValue: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
      offset: "0",
      limit: "20",
    },
    headers: {
      accept: "application/json",
      authorization:
        "Bearer dyn_UbFcbve9t2qUnde0noDxsDmLHmIMDapWP8677pKXOy5I750KBi3hbV2x",
    },
  }

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      console.error(error)
    })
}

const getUserDetailsByAddress = async (address: string) => {
  const options = {
    url: `https://app.dynamic.xyz/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID}/users`,
    params: {
      filterColumn: "walletPublicKey",
      filterValue: address,
      offset: "0",
      limit: "1",
    },
    headers: {
      accept: "application/json",
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DYNAMIC_API_KEY}`,
    },
  }

  try {
    const request = await axios.request(options)
    return request.data
  } catch (err) {
    console.error(err)
  }
}

export const getEmails = async (addresses: string[]) => {
  const users = await Promise.all(
    addresses.map((address) => getUserDetailsByAddress(address)),
  )

  return users.map((userDetails) => userDetails.users[0].email)
}
