import { create } from "zustand"
import { ToastType } from "../../components/ui/Toast"
import { Account } from "../../models/account/types"

interface StoreState {
  activeUser: undefined | Account | null
  setActiveUser: (user: undefined | Account | null) => void
  toastState: ToastType
  setToastState: (toastState: any) => void
  showProjectRequestsFilterBorder: boolean
  setShowProjectRequestsFilterBorder: (show: boolean) => void
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
  showProjectRequestsFilterBorder: true,
  setShowProjectRequestsFilterBorder(show) {
    set(() => ({
      showProjectRequestsFilterBorder: show,
    }))
  },
}))

export default useStore
