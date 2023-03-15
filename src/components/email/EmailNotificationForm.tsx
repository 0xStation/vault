import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Button } from "@ui/Button"
import { updateUserEmail } from "lib/dynamic"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useToast } from "../../hooks/useToast"
import TextareaWithLabel from "../form/TextareaWithLabel"

const EmailNotificationForm = ({
  successCallback,
}: {
  successCallback: () => void
}) => {
  const { user, authToken } = useDynamicContext()
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })

  const { successToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      email: user?.email || "",
    } as FieldValues,
  })

  const onSubmit = async (data: any) => {
    if (user) {
      await updateUserEmail(
        user.environmentId || "",
        data.email,
        authToken as string,
      )
      successCallback()
    }
  }
  const onError = async (data: any) => {}

  return (
    <div>
      <h2 className="mb-[30px] font-bold">Notifications</h2>
      <p>
        Enter your email to get notifications about your Terminals. We’ll never
        spam you with useless emails.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mt-8 flex h-[calc(100%-120px)] flex-col"
      >
        <TextareaWithLabel
          label={"Email address*"}
          register={register}
          required
          name="email"
          errors={errors}
          placeholder="0xyou@gmail.com"
        />
        <div className="fixed bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-5 text-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            fullWidth={true}
            onBlur={() => setFormMessage({ isError: false, message: "" })}
          >
            Save
          </Button>
          <p
            className={`mt-1 text-xs  ${
              formMessage?.isError ? "text-red" : "text-gray"
            }`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </div>
  )
}

export default EmailNotificationForm
