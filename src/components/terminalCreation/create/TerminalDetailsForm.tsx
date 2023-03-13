import { Button } from "@ui/Button"
import networks from "lib/utils/networks"
import { isValidUrl } from "lib/validations"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { useCreateTerminal } from "../../../models/terminal/hooks"
import { globalId } from "../../../models/terminal/utils"
import { InputWithLabel } from "../../form"
import TextareaWithLabel from "../../form/TextareaWithLabel"

export const TerminalDetailsForm = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const router = useRouter()
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { name, chainId, about, url } = formData
  const { createTerminal } = useCreateTerminal()

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

  const onSubmit = async (fieldValues: any) => {
    if (chain?.id !== chainId) {
      const networkErrMessage = chainId
        ? `Wrong network. Please switch to ${(networks as any)[chainId]?.name}.`
        : "Wrong network. Please switch to the selected network."
      setFormMessage({
        isError: true,
        message: networkErrMessage,
      })

      try {
        await switchNetworkAsync?.(chainId)
        setFormMessage({
          isError: false,
          message: "",
        })
      } catch (e: any) {
        setFormMessage({
          isError: true,
          message: `Please check your wallet to switch to ${
            (networks as any)[chainId?.toString() || ""]?.name ||
            "specified chain"
          }.`,
        })
        if (e.name === "ConnectorNotFoundError") {
          setFormMessage({
            isError: true,
            message: "Please ensure your wallet is connected.",
          })
        }
      }
      return
    }

    setFormData({
      ...formData,
      ...fieldValues,
    })

    // if importing
    if (formData.address && fieldValues.name) {
      try {
        await createTerminal({
          safeAddress: formData.address,
          name: fieldValues.name,
          chainId: formData.chainId as number,
          description: formData.about,
          url: formData.url,
        })

        // reset form data if user comes back to create or import a new terminal
        setFormData({
          name: "",
          chainId: undefined,
          about: "",
          url: "",
          members: [],
          quorum: undefined,
          address: "",
        })
        router.push(
          `/${globalId(formData.chainId as number, formData.address)}`,
        )
      } catch (err) {
        console.error("Failed to create terminal", err)
        setFormMessage({
          isError: true,
          message: "Something went wrong.",
        })
      }

      return
    }

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
