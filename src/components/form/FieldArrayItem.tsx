import { XMarkIcon } from "@heroicons/react/24/solid"

export const FieldArrayItem = ({
  title,
  remove,
  children,
}: {
  title: string
  remove: () => void
  children: any
}) => {
  return (
    <li className="mb-1 space-y-5 rounded-lg bg-slate-50 p-3">
      <div className="flex flex-row items-center justify-between">
        <p className="text-xs text-slate-500">{title}</p>
        <button type="button" onClick={remove}>
          <XMarkIcon className="h-4 w-4 fill-slate-500" />
        </button>
      </div>
      {children}
    </li>
  )
}
