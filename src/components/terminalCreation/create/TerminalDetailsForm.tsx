import { Button } from "@ui/Button"
import { SUPPORTED_CHAINS } from "lib/constants"
import { isValidUrl } from "lib/validations"
import { Dispatch, SetStateAction, useState } from "react"
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
  const { switchNetwork, isError, error } = useSwitchNetwork()
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const [unfinishedForm, setUnfinishedForm] = useState<boolean>(false)
  const { chain } = useNetwork()
  const { name, chainId, about, url } = formData

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      name,
      chainId,
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
    })
    setCreateTerminalView(CREATE_TERMINAL_VIEW.MEMBERS)
  }
  const onError = (errors: any) => {
    setUnfinishedForm(true)
  }
  return (
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
            validate: (v) => !v || isValidUrl(v) || "Invalid URL.",
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full px-5 text-center">
        <Button type="submit" fullWidth={true}>
          Next
        </Button>
        <p
          className={`mt-1 text-sm  ${
            unfinishedForm ? "text-slate-500" : "text-transparent"
          }`}
        >
          Complete the required fields to continue.
        </p>
      </div>
    </form>
  )
}
