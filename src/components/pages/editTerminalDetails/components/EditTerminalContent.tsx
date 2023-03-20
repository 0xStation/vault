import { Button } from "@ui/Button"
import { isValidUrl } from "lib/validations"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useSignature from "../../../../hooks/useSignature"
import { formatUpdateTerminalValues } from "../../../../lib/signatures/terminal"
import {
  useTerminalByChainIdAndSafeAddress,
  useUpdateTerminal,
} from "../../../../models/terminal/hooks"
import { parseGlobalId } from "../../../../models/terminal/utils"
import { InputWithLabel } from "../../../form"

const EditTerminalContent = () => {
  const router = useRouter()
  const { signMessage } = useSignature()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({
    isError: false,
    message: "You’ll be directed to sign. This action does not cost gas.",
  })

  const { terminal, mutate } = useTerminalByChainIdAndSafeAddress(
    address,
    chainId,
  )

  const { register, handleSubmit, formState, setError, clearErrors } = useForm({
    defaultValues: async () =>
      fetch(`/api/v1/terminal?chainId=${chainId}&safeAddress=${address}`)
        .then((res) => res.json())
        .then((res) => res.data),
  })

  const { errors } = formState

  const { updateTerminal } = useUpdateTerminal(address, chainId)

  const onSubmit = async (data: any) => {
    await signMessage(formatUpdateTerminalValues(data))
    await updateTerminal({
      ...data,
      safeAddress: terminal?.safeAddress,
      chainId: terminal?.chainId,
      nonce: terminal?.data.nonce,
      safeTxnHash: terminal?.data.safeTxnHash,
    })
    mutate()
    router.back()
  }

  const onError = () => {
    console.log("error")
  }

  if (!terminal) {
    // return 404
    return <></>
  }

  return (
    <>
      <h2 className="font-bold">Add Project Details</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mt-6 space-y-6"
      >
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
        <InputWithLabel
          className="mb-3"
          label="About*"
          register={register}
          name="description"
          placeholder="What does this group do?"
          required
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
          registerOptions={{
            validate: (v) =>
              !v ||
              isValidUrl(v) ||
              "Invalid URL. Please enter a url in the format https://example.xyz.",
          }}
        />
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-4 text-center">
          <Button type="submit" fullWidth={true}>
            Save
          </Button>
          <p
            className={`mt-1 text-sm ${
              formMessage?.isError ? "text-red" : "text-gray"
            } ${formMessage.message || "text-transparent"}`}
          >
            {formMessage.message || "Complete the required fields to continue."}
          </p>
        </div>
      </form>
    </>
  )
}

export default EditTerminalContent
