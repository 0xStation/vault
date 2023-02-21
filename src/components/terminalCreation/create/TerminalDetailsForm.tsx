import { Button } from "@ui/Button"
import { SUPPORTED_CHAINS } from "lib/constants"
import { isValidUrl } from "lib/validations"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { InputWithLabel, SelectWithLabel } from "../../form"
import TextareaWithLabel from "../../form/TextareaWithLabel"

export const TerminalDetailsForm = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const { switchNetwork, error: networkError } = useSwitchNetwork()
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { chain } = useNetwork()
  const { name, chainId, about, url } = formData

  useEffect(() => {
    if (networkError) {
      setError("chainId", {
        type: "wrongNetwork",
        message: "Please check your wallet to switch to specified chain.",
      })
    } else {
      clearErrors("chainId")
    }
  }, [networkError])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name,
      chainId: chainId || chain?.id,
      about,
      url,
    } as FieldValues,
  })

  const onSubmit = (data: any) => {
    if (chain?.id !== parseInt(data.chainId)) {
      setError("chainId", {
        type: "wrongNetwork",
        message: "Please switch network to specified chain.",
      })
      return
    }
    setFormData({
      ...formData,
      ...data,
      chainId: parseInt(data.chainId),
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
          <SelectWithLabel
            className="mb-3"
            label="Chain*"
            name="chainId"
            required
            register={register}
            errors={errors}
            registerOptions={{
              onChange: (e) => {
                switchNetwork?.(parseInt(e.target.value))
              },
            }}
          >
            <option value="">Choose option</option>
            {SUPPORTED_CHAINS?.map((chain, idx) => {
              return (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              )
            })}
          </SelectWithLabel>
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
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full px-5 text-center">
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
