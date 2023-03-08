import { ReactNode, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useSetActiveUser } from "../../hooks/account/useSetActiveUser"
import useStore from "../../hooks/stores/useStore"
import { Toast } from "../ui/Toast"

export const AppLayout = ({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) => {
  const setActiveUser = useStore((state) => state.setActiveUser)
  const activeUser = useStore((state) => state.activeUser)
  const { address: connectedAddress } = useAccount()
  const { disconnect } = useDisconnect()

  useSetActiveUser()

  useEffect(() => {
    // log user out / disconnect them if they
    // programatically disconnect from their wallet extension
    // or if they switch accounts within their own wallet.
    const handleDisconnect = async () => {
      if (
        !connectedAddress ||
        (activeUser?.address && activeUser?.address !== connectedAddress)
      ) {
        setActiveUser(null)
        disconnect()
      }
    }
    handleDisconnect()
  }, [connectedAddress])

  return (
    <>
      <div className="mx-auto max-w-[580px]">{children}</div>
      <Toast />
    </>
  )
}

export default AppLayout
