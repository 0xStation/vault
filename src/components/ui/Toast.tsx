import { CheckIcon } from "@icons"
import { cva, VariantProps } from "class-variance-authority"
import useStore from "../../hooks/stores/useStore"
import { Hyperlink } from "./Hyperlink"
import LoadingSpinner from "./LoadingSpinner"

const toast = cva(
  "flex justify-between items-center min-w-screen max-w-[580px] sm:max-w-[400px] mx-auto rounded-full py-2 px-3 z-50",
  {
    variants: {
      variant: {
        success: "bg-violet text-white",
        error: "bg-red text-white",
        loading: "bg-gray-90 text-white",
      },
    },
  },
)

export interface ToastType extends VariantProps<typeof toast> {
  isToastShowing: boolean
  message: string
  action?: {
    href: string
    label: string
  }
}

export const Toast = () => {
  const state = useStore((state) => state.toastState)
  const { isToastShowing, variant, message, action } = state

  if (!isToastShowing) return <></>

  return (
    <div className="fixed bottom-0 w-full p-4 sm:w-[400px]">
      <div className={toast({ variant })}>
        <div className="flex flex-row items-center space-x-2">
          {variant === "success" && <CheckIcon />}
          {variant === "loading" && <LoadingSpinner />}
          <span className="text-sm">{message}</span>
        </div>
        {action && <Hyperlink {...action} />}
      </div>
    </div>
  )
}
