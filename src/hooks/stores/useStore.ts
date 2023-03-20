import { create } from "zustand"
import { ToastType } from "../../components/ui/Toast"
import { Account } from "../../models/account/types"

interface StoreState {
  activeUser: undefined | Account | null
  setActiveUser: (user: undefined | Account | null) => void
  toastState: ToastType
  setToastState: (toastState: any) => void
  showTabBottomBorder: boolean
  setShowTabBottomBorder: (show: boolean) => void
  isRequestActionsOpen: boolean
  setIsRequestActionsOpen: (isSigner: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  activeUser: undefined, // undefined on start, Account if found, null if not found
  setActiveUser: (user: undefined | Account | null) =>
    set(() => {
      return { activeUser: user }
    }),
  toastState: {
    isToastShowing: false,
    message: "",
    type: "success",
  },

  setToastState: (toastState) =>
    set((_state) => ({
      toastState: {
        isToastShowing: toastState.isToastShowing,
        message: toastState.message,
        variant: toastState.variant,
        ...(toastState.action && {
          action: {
            href: toastState.action.href,
            label: toastState.action.label,
          },
        }),
      },
    })),
  showTabBottomBorder: false,
  setShowTabBottomBorder(show) {
    set(() => ({
      showTabBottomBorder: show,
    }))
  },
  isRequestActionsOpen: false,
  setIsRequestActionsOpen: (isRequestActionsOpen: boolean) => {
    set(() => ({
      isRequestActionsOpen,
    }))
  },
}))

export default useStore
