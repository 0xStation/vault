import { BytesLike } from "@ethersproject/bytes"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import { addressesAreEqual, isEns } from "lib/utils"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { useSendTransaction } from "wagmi"
import { CREATE_TERMINAL_VIEW } from "."
import { useResolveEnsAddress } from "../../../hooks/ens/useResolveEns"
import { useStore } from "../../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import { encodeSafeSetup } from "../../../lib/encodings/setup"
import AddressInput from "../../form/AddressInput"
import QuorumInput from "../../form/QuorumInput"

export const MembersView = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const activeUser = useStore((state) => state.activeUser)
  const formData = useTerminalCreationStore((state) => state.formData)
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const [unfinishedForm, setUnfinishedForm] = useState<boolean>(false)
  const { resolveEnsAddress } = useResolveEnsAddress()
  const { quorum, members } = formData
  const [data, setData] = useState<any>(undefined)

  //   const { config } = usePrepareSendTransaction({
  //     request: {
  //       chainId: 5,
  //       to: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
  //       value: 0,
  //       data,
  //     },
  //   })

  //   const {
  //     data: response,
  //     isLoading,
  //     isSuccess,
  //     sendTransaction,
  //   } = useSendTransaction(config)

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })
  const onSubmit = async (data: any) => {
    const members = await Promise.all(
      data.members.map(async ({ address }: { address: string }) =>
        isEns(address) ? await resolveEnsAddress(address) : address,
      ),
    )

    setFormData({
      ...formData,
      quorum: data.quorum,
      members: [activeUser?.address, ...members],
    })

    const transactionData = encodeSafeSetup({
      owners: members,
      threshold: data.quorum,
    })

    const transaction = await sendTransactionAsync({
      recklesslySetUnpreparedRequest: {
        chainId: 5,
        to: transactionData.to,
        value: transactionData.value,
        data: transactionData.data as BytesLike,
      },
    })
  }
  const onError = (errors: any) => {
    setUnfinishedForm(true)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      quorum: quorum + 1,
      members: members?.length + 1,
    } as FieldValues,
  })

  const {
    fields: memberFields,
    append,
    remove,
  } = useFieldArray({
    control, // contains methods for registering components into React Hook Form
    name: "members",
  })
  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex h-[calc(100%-100px)] flex-col"
    >
      <div className="flex grow flex-col overflow-scroll">
        <div className="mb-6">
          <label className="text-sm font-bold">Members*</label>
          <div className="mt-3 mb-6 flex flex-row">
            <Avatar size="sm" pfpUrl={activeUser?.data?.pfpUrl || ""} />
            <p className="ml-2">You</p>
          </div>
          <div className="w-full">
            {memberFields
              // @ts-ignore
              .filter((item) => item.address !== activeUser?.address)
              .map((item, index) => {
                return (
                  <div key={item.id} className="mb-1 rounded bg-slate-200 p-3">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm font-bold text-slate-500">
                        {/* we need to add 2 to the index since the index is 0-indexed and 
                          the owner is the first member, but is not included as a member until
                          form submission.*/}
                        Member {index + 2}
                      </p>
                      <button type="button" onClick={() => remove(index)}>
                        <XMarkIcon className="h-5 w-5 fill-slate-500" />
                      </button>
                    </div>
                    <AddressInput
                      name={`members.${index}.address`}
                      label="Wallet or ENS address*"
                      register={register}
                      placeholder="Enter a wallet or ENS address"
                      errors={errors}
                      className="[&>input]:bg-slate-200 [&>input]:placeholder:text-slate-500"
                      required
                      validations={{
                        noDuplicates: async (v: string) => {
                          const addy = await resolveEnsAddress(v)

                          return (
                            ((members || [])?.every(
                              (member) =>
                                !addressesAreEqual(member.address, addy),
                            ) &&
                              !addressesAreEqual(activeUser?.address, addy)) ||
                            "Member already added."
                          )
                        },
                      }}
                    />
                  </div>
                )
              })}
            <Button
              variant="tertiary"
              fullWidth={true}
              size="sm"
              onClick={() => append({ address: "" })}
            >
              + Add member
            </Button>
          </div>
        </div>

        <QuorumInput
          label="Quorum*"
          register={register}
          name="quorum"
          errors={errors}
          required
          registerOptions={{
            max: {
              value: memberFields?.length + 1,
              message: "Quorum cannot be greater than the number of members.",
            },
            min: {
              value: 1,
              message: "Quorum must be at least 1 member.",
            },
            valueAsNumber: true,
          }}
          quorumSize={(memberFields?.length || 0) + 1}
        />
      </div>
      <div className="mt-4 flex w-full flex-col pb-3 text-center">
        <Button type="submit" fullWidth={true}>
          Create Terminal
        </Button>
        <p
          className={`mt-1 text-center text-sm ${
            unfinishedForm ? "text-slate-500" : "text-transparent"
          }`}
        >
          Complete the required fields to continue.
        </p>
      </div>
    </form>
  )
}
