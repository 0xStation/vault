import { Button } from "@ui/Button"

type Action = {
  label: string
  onClick: () => void
}
const ActionPrompt = ({
  hasIndicator,
  prompt,
  actions,
}: {
  hasIndicator: boolean
  prompt: string
  actions?: Action[]
}) => {
  return (
    <div className="rounded-lg bg-slate-100 p-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          {hasIndicator && (
            <span className="block h-2 w-2 rounded-full bg-orange" />
          )}
          <h4 className="text-sm">{prompt}</h4>
        </div>
        <div className="flex flex-row space-x-2">
          {actions?.map((action, idx) => {
            return (
              <Button
                size="sm"
                variant="secondary"
                onClick={action.onClick}
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
