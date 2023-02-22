import { Transition } from "@headlessui/react"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import { useCreateComment } from "../../models/activity/hooks"

export const NewCommentForm = () => {
  const activeUser = useStore((state) => state.activeUser)

  const router = useRouter()
  const { createComment } = useCreateComment(router.query.requestId as string)

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm()
  const onSubmit = (data: any) =>
    createComment({ ...data, address: activeUser?.address as string })

  return (
    <>
      {activeUser && (
        <>
          <div className="mt-4 flex flex-row items-center space-x-2">
            <Avatar address={activeUser?.address} size="xs" />
            <div className="text-xs">You</div>
          </div>
          <form className="mt-1 pl-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="group flex flex-col space-y-2 rounded-md bg-slate-50 py-2 px-3 hover:bg-slate-100">
              <textarea
                {...register("comment", { required: true })}
                className="resize-none bg-slate-50 text-sm placeholder:text-slate-500 group-hover:bg-slate-100"
                placeholder="Leave a comment..."
                rows={1}
                // make height auto-adjust while typing
                // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
                onInput={(e) => {
                  // @ts-ignore
                  e.target?.style?.height = ""
                  // @ts-ignore
                  e.target?.style?.height = e.target?.scrollHeight + "px"
                }}
                // use `shift+enter` to add new lines and `enter` to trigger form submission
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(onSubmit)()
                    e.preventDefault()
                  }
                }}
              />
              <Transition
                show={isDirty}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                <div className="text-right">
                  <Button size="sm" variant="secondary" type="submit">
                    Send
                  </Button>
                </div>
              </Transition>
            </div>
          </form>
        </>
      )}
    </>
  )
}
