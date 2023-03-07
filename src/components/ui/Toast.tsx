import { ArrowUpRight, CheckIcon } from "@icons"
import { cva, VariantProps } from "class-variance-authority"
import useStore from "../../hooks/stores/useStore"
import LoadingSpinner from "./LoadingSpinner"

const toast = cva(
  "flex w-full justify-between items-center min-w-screen max-w-[580px] mx-auto rounded-full py-2 px-3 z-50",
  {
    variants: {
      variant: {
        success: "bg-violet text-white",
        error: "bg-red text-white",
        loading: "bg-slate-100 text-black",
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
    <div className="fixed bottom-0 w-full p-4">
      <div className={toast({ variant })}>
        <div className="flex flex-row items-center space-x-2">
          {variant === "success" && <CheckIcon />}
          {variant === "loading" && <LoadingSpinner />}
          <span className="text-sm">{message}</span>
        </div>
        {action && (
          <div className="flex cursor-pointer items-center space-x-2 border-b border-dotted">
            <a
              href={action.href}
              className="text-sm"
              target="_blank"
              rel="noreferrer"
            >
              {action.label}
            </a>
            <ArrowUpRight size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
