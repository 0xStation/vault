import { ArrowUpRight, CheckIcon, ChevronRight } from "@icons"
import { cva, VariantProps } from "class-variance-authority"

const toast = cva(
  "flex w-full justify-between items-center rounded-full py-2 px-3",
  {
    variants: {
      variant: {
        success: "bg-violet text-white",
        error: "bg-red text-white",
        loading: "text-black bg-slate",
      },
    },
  },
)

interface ToastProps extends VariantProps<typeof toast> {
  copy: string
}

export const Toast = ({ variant = "success", copy }: ToastProps) => {
  return (
    <div className={toast({ variant })}>
      <div className="flex flex-row items-center space-x-2">
        {variant === "success" && <CheckIcon />}
        {/* loading spinner coming soon... */}
        {variant === "loading" && <span>spinner...</span>}
        <span>{copy}</span>
      </div>

      {variant === "success" && (
        <span className="cursor-pointer border-b border-dotted">
          See request
        </span>
      )}
      {variant === "error" && <ChevronRight />}
      {variant === "loading" && (
        <div className="flex cursor-pointer items-center space-x-2 border-b border-dotted">
          <span>View on Etherscan</span>
          <ArrowUpRight size="sm" />
        </div>
      )}
    </div>
  )
}
