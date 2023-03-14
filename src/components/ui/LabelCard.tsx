const LabelCard = ({
  className = "",
  label,
  description,
}: {
  className?: string
  label: string
  description: string
}) => {
  return (
    <div
      className={`flex flex-col rounded-lg bg-gray-200 px-3 py-2 ${className}`}
    >
      <span className="text-xs text-gray">{label}</span>
      <span className="mt-1 text-2xl">{description}</span>
    </div>
  )
}

export default LabelCard
