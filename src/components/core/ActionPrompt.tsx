import { Button } from "@ui/Button"

type Action = {
  label: string
  onClick: (e: any) => void
}
const ActionPrompt = ({
  prompt,
  actions,
}: {
  prompt: string
  actions?: Action[]
}) => {
  return (
    <div className="rounded-lg bg-slate-100 px-2 py-1">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <h4 className="text-sm text-slate-500">{prompt}</h4>
        </div>
        <div className="flex flex-row space-x-2">
          {actions?.map((action, idx) => {
            return (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => action.onClick(e)}
                key={`action-${idx}`}
              >
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActionPrompt