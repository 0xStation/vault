import { Transition } from "@headlessui/react"
import { ActivityVariant } from "@prisma/client"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import useStore from "../../hooks/stores/useStore"
import { useCreateComment } from "../../models/activity/hooks"

export const NewCommentForm = ({ mutateRequest }: { mutateRequest: any }) => {
  const activeUser = useStore((state) => state.activeUser)
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const { createComment } = useCreateComment(router.query.requestId as string)

  const {
    register,
    handleSubmit,
    resetField,
    formState: { isDirty },
  } = useForm()
  const onSubmit = async (data: any) => {
    setLoading(true)
    const newCommentId = uuid()
    const commentActivity = {
      id: newCommentId,
      requestId: router.query.requestId as string,
      variant: ActivityVariant.COMMENT_ON_REQUEST,
      address: activeUser?.address,
      createdAt: new Date(),
      data,
    }
    mutateRequest(
      createComment({
        comment: data.comment,
        address: activeUser?.address as string,
        newActivityId: newCommentId,
      }),
      commentActivity,
    )
    setLoading(false)
  }

  return (
    <>
      {activeUser && (
        <>
          <div className="mt-4 flex flex-row items-center space-x-2">
            <Avatar address={activeUser?.address} size="xs" />
            <div className="text-xs">You</div>
          </div>
          <form className="mt-1 pl-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="group flex flex-col space-y-2 rounded-md bg-gray-200 py-2 px-3 hover:bg-gray-200">
              <textarea
                {...register("comment", { required: true })}
                className="resize-none bg-gray-200 text-sm placeholder:text-gray group-hover:bg-gray-200"
                placeholder="Leave a comment..."
                rows={1}
                // make height auto-adjust while typing
                // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
                onInput={(e) => {
                  // @ts-ignore
                  e.target.style.height = ""
                  // @ts-ignore
                  e.target.style.height = e.target.scrollHeight + "px"
                }}
                // use `shift+enter` to add new lines and `enter` to trigger form submission
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(onSubmit)()
                    resetField("comment")
                    // @ts-ignore
                    e.target.style.height = ""
                    // @ts-ignore
                    e.target.style.height = e.target.scrollHeight + "px"
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
                  <Button
                    size="sm"
                    variant="secondary"
                    type="submit"
                    loading={loading}
                  >
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
