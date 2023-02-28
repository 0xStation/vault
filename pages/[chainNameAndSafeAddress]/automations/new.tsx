import { XMarkIcon } from "@heroicons/react/24/solid"
import { Button } from "@ui/Button"
import { ZERO_ADDRESS } from "lib/constants"
import { isEns } from "lib/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { InputWithLabel } from "../../../src/components/form"
import AddressInput from "../../../src/components/form/AddressInput"
import PercentInput from "../../../src/components/form/PercentInput"
import { useResolveEnsAddress } from "../../../src/hooks/ens/useResolveEns"
import useStore from "../../../src/hooks/stores/useStore"
import { useToast } from "../../../src/hooks/useToast"
import { useCreateAutomation } from "../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../src/models/terminal/utils"

const NewAutomationPage = () => {
  const router = useRouter()
  const { resolveEnsAddress } = useResolveEnsAddress()
  const activeUser = useStore((state) => state.activeUser)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { isMutating, createAutomation } = useCreateAutomation(chainId, address)
  const { successToast } = useToast()

  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    console.log(data)
    setIsLoading(true)

    const addressSplits = await Promise.all(
      data.splits.map(
        async ({ address, value }: { address: string; value: string }) => ({
          address: isEns(address) ? await resolveEnsAddress(address) : address,
          value,
        }),
      ),
    )

    const automation = await createAutomation({
      name: data.name,
      address: ZERO_ADDRESS, // splits proxy
      splits: addressSplits,
    })
    console.log(automation)
    successToast({ message: "Revenue Share Automation created" })
    router.push(`/${router.query.chainNameAndSafeAddress}/automations`)
    setIsLoading(false)
  }

  const onError = (errors: any) => {
    setFormMessage({
      isError: false,
      message: "Complete the required fields to continue.",
    })
  }

  const {
    fields: splitFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "splits",
  })
  const watchSplits = watch("splits", [])

  return (
    <div className="mt-12 px-4">
      <button onClick={() => router.back()}>
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="mt-8 mb-[30px]">New Revenue Share</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex-col">
          <InputWithLabel
            className="mb-3"
            label="What for?*"
            register={register}
            name="name"
            placeholder="e.g. NFT Sale Split"
            required
            errors={errors}
            registerOptions={{
              maxLength: {
                value: 60,
                message: "Exceeded max length of 60 characters.",
              },
            }}
          />
          <div className="flex flex-row items-center justify-between">
            <label className="text-sm font-bold">Recipients and splits*</label>
            <span className="text-xs text-slate-500">
              {watchSplits.reduce(
                (acc: number, split: { value: string }) =>
                  acc + parseFloat(split.value),
                0,
              )}
              /100%
            </span>
          </div>
          <ul className="mt-2">
            {splitFields.map((split, index) => (
              <li
                key={split.id}
                className="mb-1 space-y-5 rounded-lg bg-slate-50 p-3"
              >
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Recipient {index + 1}
                  </p>
                  <button type="button" onClick={() => remove(index)}>
                    <XMarkIcon className="h-4 w-4 fill-slate-500" />
                  </button>
                </div>
                <AddressInput
                  name={`splits.${index}.address`}
                  register={register}
                  errors={errors}
                  label="Wallet or ENS address*"
                  placeholder="Enter a wallet or ENS address"
                  className="[&>input]:bg-slate-50 [&>input]:placeholder:text-slate-500"
                  required
                  validations={{
                    noDuplicates: async (v: string) => {
                      const address = await resolveEnsAddress(v)
                      const recipients = (
                        watchSplits as {
                          address: string
                          value: number
                          id: string
                        }[]
                      ).map((split) => split?.address)

                      return (
                        !recipients.some(
                          (val, i) => recipients.indexOf(val) !== i,
                        ) || "Recipient already added."
                      )
                    },
                  }}
                />
                <PercentInput
                  name={`splits.${index}.value`}
                  register={register}
                  errors={errors}
                  label="Split"
                  placeholder="Enter a percent of revenue to share"
                  required
                />
              </li>
            ))}
          </ul>
          <Button
            variant="tertiary"
            fullWidth={true}
            size="lg"
            onClick={() => append({ address: "" })}
          >
            + Add recipient
          </Button>
          {/* more fields */}
        </div>
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full max-w-[580px] px-5 text-center">
          <Button type="submit" fullWidth={true} loading={isLoading}>
            Create
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
    </div>
  )
}

export default NewAutomationPage
