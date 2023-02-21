import axios from "axios"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import { Account as AccountType } from "../../models/account/types"
import useStore from "../stores/useStore"

export const useSetActiveUser = () => {
  const activeUser = useStore((state) => state.activeUser)
  const setActiveUser = useStore((state) => state.setActiveUser)
  const { address } = useAccount()

  useEffect(() => {
    if (address && address !== activeUser?.address) {
      const setActiveAccount = async () => {
        let account
        try {
          const response = await axios.get<AccountType>(
            `/api/v1/account/${address}/`,
          )
          if (response.status === 200) {
            account = response.data
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log("no account!", err?.response?.data)
          } else {
            console.log("err:", err)
          }
        }

        if (!account) {
          try {
            const response = await axios.put<AccountType>("/api/v1/account/", {
              chainId: 0,
              pfpUrl:
                "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7",
              address,
            })
            account = response.data
          } catch (err) {
            console.log("could not create account!")
          }

          setActiveUser(account)
        } else {
          setActiveUser(account)
        }
      }
      setActiveAccount()
    }
  }, [address])

  return [activeUser]
}
