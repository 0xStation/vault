import useStore from "./stores/useStore"

export const useToast = () => {
  const setToastState = useStore((state) => state.setToastState)

  const successToast = (
    message: string,
    action?: { href: string; label: string },
  ) => {
    setToastState({
      isToastShowing: true,
      variant: "success",
      message,
      action,
    })
  }

  const errorToast = (
    message: string,
    action?: { href: string; label: string },
  ) => {
    setToastState({
      isToastShowing: true,
      variant: "error",
      message,
      action,
    })
  }

  const loadingToast = (
    message: string,
    action?: { href: string; label: string },
  ) => {
    setToastState({
      isToastShowing: true,
      variant: "loading",
      message,
      action,
    })
  }

  return { successToast, errorToast, loadingToast }
}
