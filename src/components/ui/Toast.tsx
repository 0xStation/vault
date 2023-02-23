import { ArrowUpRight, CheckIcon } from "@icons"
import { cva, VariantProps } from "class-variance-authority"
import { useEffect, useState } from "react"
import useStore from "../../hooks/stores/useStore"

const LoadingSpinner = () => {
  return (
    <svg
      className="text-indigo-400 h-6 w-6 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.75V6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 6.87347L16.0659 7.93413"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M19.25 12L17.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 17.1265L16.0659 16.0659"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M12 17.75V19.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 16.0659L6.87354 17.1265"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M6.25 12L4.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 7.93413L6.87354 6.87347"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  )
}

const toast = cva(
  "flex w-full justify-between items-center rounded-full py-2 px-3 z-50",
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
  const setToastState = useStore((state) => state.setToastState)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
  const { isToastShowing, variant, message, action } = state

  useEffect(() => {
    if (isToastShowing) {
      setTimeoutId(
        setTimeout(() => {
          setToastState({ isToastShowing: false, variant, message: "" })
        }, 3000),
      )
    }
  }, [isToastShowing])

  if (!isToastShowing) return <></>

  return (
    <div className="fixed bottom-0 w-full p-4">
      <div className={toast({ variant })}>
        <div className="flex flex-row items-center space-x-2">
          {variant === "success" && <CheckIcon />}
          {variant === "loading" && <LoadingSpinner />}
          <span>{message}</span>
        </div>
        {action && (
          <div className="flex cursor-pointer items-center space-x-2 border-b border-dotted">
            <a href={action.href} className="text-sm">
              {action.label}
            </a>
            <ArrowUpRight size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
