import { PencilIcon } from "@heroicons/react/24/solid"

export const EditButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} h-fit p-2 hover:bg-gray-80`}
    >
      <PencilIcon className="w-4" />
    </button>
  )
}
