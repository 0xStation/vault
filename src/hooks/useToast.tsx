import useStore from "./stores/useStore"

export const useToast = () => {
  const setToastState = useStore((state) => state.setToastState)
  const defaultTimeout = 2000

  const successToast = ({
    message,
    action,
    timeout = defaultTimeout,
  }: {
    message: string
    action?: { href: string; label: string }
    timeout?: number
  }) => {
    setToastState({
      isToastShowing: true,
      variant: "success",
      message,
      action,
    })

    if (timeout) {
      setTimeout(() => {
        closeCurrentToast()
      }, timeout)
    }
  }

  const errorToast = ({
    message,
    action,
    timeout = defaultTimeout,
  }: {
    message: string
    action?: { href: string; label: string }
    timeout?: number
  }) => {
    setToastState({
      isToastShowing: true,
      variant: "error",
      message,
      action,
    })

    if (timeout) {
      setTimeout(() => {
        closeCurrentToast()
      }, timeout)
    }
  }

  const loadingToast = ({
    message,
    action,
    timeout = defaultTimeout,
  }: {
    message: string
    action?: { href: string; label: string }
    timeout?: number
  }) => {
    setToastState({
      isToastShowing: true,
      variant: "loading",
      message,
      action,
    })

    if (timeout) {
      setTimeout(() => {
        closeCurrentToast()
      }, timeout)
    }
  }

  const closeCurrentToast = () => {
    setToastState({
      isToastShowing: false,
      variant: "success", // doesn't matter since it's closed
      message: "",
    })
  }

  return { successToast, errorToast, loadingToast, closeCurrentToast }
}
