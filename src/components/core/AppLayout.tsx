import { ReactNode } from "react"
import { useSetActiveUser } from "../../hooks/account/useSetActiveUser"
import { Toast } from "../ui/Toast"

export const AppLayout = ({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) => {
  useSetActiveUser()

  return (
    <>
      {children}
      <Toast />
    </>
  )
}

export default AppLayout
