import { Button } from "@ui/Button"
import networks from "lib/utils/networks"
import { isValidUrl } from "lib/validations"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useNetwork } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { InputWithLabel } from "../../form"
import TextareaWithLabel from "../../form/TextareaWithLabel"

export const TerminalDetailsForm = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { chain } = useNetwork()
  const { name, chainId, about, url } = formData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      about,
      url,
    } as FieldValues,
  })

  const onSubmit = (fieldValues: any) => {
    console.log(chain?.id, chainId)
    console.log(fieldValues)
    if (chain?.id !== chainId) {
      const networkErrMessage = chainId
        ? `Wrong network. Please switch to ${(networks as any)[chainId]?.name}.`
        : "Wrong network. Please switch to the selected network."
      setFormMessage({
        isError: true,
        message: networkErrMessage,
      })
      return
    }

    setFormData({
      ...formData,
      ...fieldValues,
    })
    setCreateTerminalView(CREATE_TERMINAL_VIEW.MEMBERS)
  }
  const onError = (errors: any) => {
    setFormMessage({
      isError: false,
      message: "Complete the required fields to continue.",
    })
  }
  return (
    <>
      <h2 className="mb-[30px] font-bold">New Terminal</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex-col">
          <InputWithLabel
            className="mb-3"
            label="Name*"
            register={register}
            name="name"
            placeholder="e.g. ChatGPT Discord Bot Project"
            required
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
          <TextareaWithLabel
            className="mb-3"
            label="About"
            register={register}
            name="about"
            placeholder="What does this group do?"
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 400,
                message: "Exceed max length of 400 characters.",
              },
            }}
          />
          <InputWithLabel
            className="mb-3"
            label="URL"
            register={register}
            name="url"
            placeholder="Enter a link to your project"
            errors={errors}
            // TODO: abstract validation logic
            registerOptions={{
              validate: (v) =>
                !v ||
                isValidUrl(v) ||
                "Invalid URL. Please enter a url in the format https://example.xyz.",
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-5 text-center">
          <Button type="submit" fullWidth={true}>
            Next
          </Button>
          <p
            className={`mt-1 text-sm  ${
              formMessage?.isError ? "text-red" : "text-slate-500"
            } ${formMessage.message || "text-transparent"}`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </>
  )
}
