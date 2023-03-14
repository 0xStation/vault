import { cn } from "lib/utils"

const LabelCard = ({
  className = "",
  label,
  description,
  boxWrap = true,
}: {
  className?: string
  label: string
  description: string
  boxWrap?: boolean
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        boxWrap ? "rounded-lg bg-gray-90 px-3 py-2" : "",
        className,
      )}
    >
      <span className="text-sm text-gray">{label}</span>
      <span className="mt-1 text-2xl">{description}</span>
    </div>
  )
}

export default LabelCard
