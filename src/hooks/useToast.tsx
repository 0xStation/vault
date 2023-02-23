import useStore from "./stores/useStore"

export const useToast = () => {
  const setToastState = useStore((state) => state.setToastState)

  const successToast = (
    message: string,
    action?: { href: string; label: string },
  ) => {
    setToastState({
      isToastShowing: true,
      type: "success",
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
      type: "error",
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
      type: "loading",
      message,
      action,
    })
  }

  return { successToast, errorToast, loadingToast }
}
