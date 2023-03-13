import { Button } from "@ui/Button"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import { useEditComment } from "../../models/activity/hooks"

export const EditCommentForm = ({
  mutateRequest,
  activityId,
  initialValue,
  close,
}: {
  mutateRequest: any
  activityId: string
  initialValue: string
  close: () => void
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const [loading, setLoading] = useState<boolean>(false)

  const { editComment } = useEditComment(activityId)

  const { register, handleSubmit } = useForm({
    defaultValues: { comment: initialValue },
  })
  const onSubmit = async (data: any) => {
    setLoading(true)
    const update = {
      activityId,
      comment: data.comment,
    }
    mutateRequest(
      editComment({ ...data, address: activeUser?.address as string }),
      update,
    )
    setLoading(false)
    close()
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-2">
        <textarea
          {...register("comment", { required: true })}
          className="resize-none bg-slate-50 text-sm"
          // autoFocus and onSelect together set height and cursor automatically on open
          autoFocus={true}
          onSelect={(e) => {
            // @ts-ignore
            e.target.style.height = "0px"
            // @ts-ignore
            e.target.style.height = e.target.scrollHeight + "px"
          }}
          // make height auto-adjust while typing
          // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
          onInput={(e) => {
            // @ts-ignore
            e.target.style.height = "0px"
            // @ts-ignore
            e.target.style.height = e.target.scrollHeight + "px"
          }}
          // use `shift+enter` to add new lines and `enter` to trigger form submission
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(onSubmit)()
              e.preventDefault()
            }
          }}
        />
        <div className="space-x-2 text-right">
          <Button size="sm" variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button size="sm" variant="secondary" type="submit" loading={loading}>
            Send
          </Button>
        </div>
      </div>
    </form>
  )
}
