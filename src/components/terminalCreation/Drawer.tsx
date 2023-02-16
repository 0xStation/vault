import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { SUPPORTED_CHAINS } from "lib/constants"
import { isValidUrl } from "lib/validations"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { useResolveEnsAddress } from "../../hooks/ens/useResolveEns"
import useStore from "../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../hooks/stores/useTerminalCreationStore"
import { addressesAreEqual } from "../../lib/utils"
import { InputWithLabel, SelectWithLabel } from "../core/form"
import { AddressInput } from "../core/form/AddressInput"
import { QuorumInput } from "../core/form/QuorumInput"
import Selector from "../core/Selector"

enum CREATE_TERMINAL_VIEW {
  DETAILS = "details",
  MEMBERS = "members",
}

export const TerminalDetailsForm = ({
  setCreateTerminalView,
}: {
  setCreateTerminalView: Dispatch<
    SetStateAction<CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS>
  >
}) => {
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const [unfinishedForm, setUnfinishedForm] = useState<boolean>(false)
  const { name, chainId, about, url } = formData
  const onSubmit = (data: any) => {
    setFormData({
      ...formData,
      ...data,
    })
    setCreateTerminalView(CREATE_TERMINAL_VIEW.MEMBERS)
  }
  const onError = (errors: any) => {
    setUnfinishedForm(true)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      chainId,
      about,
      url,
    } as FieldValues,
  })
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
            maxLength: 60,
          }}
        />
        <SelectWithLabel
          className="mb-3"
          label="Chain*"
          name="chainId"
          required
          register={register}
          errors={errors}
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
        <InputWithLabel
          className="mb-3"
          label="About"
          register={register}
          name="about"
          placeholder="What does this group do?"
          errors={errors}
          registerOptions={{
            maxLength: 400,
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

export const TerminalCreationLayout = ({
  children,
  backFunc,
  header,
}: {
  header: string
  children: ReactNode
  backFunc: () => void
}) => {
  return (
    <div className={"flex h-full flex-col"}>
      <button role="button" onClick={() => backFunc()}>
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="my-7">
        <h1 className="font-bold">{header}</h1>
      </div>
      {children}
    </div>
  )
}

// VIEWS
export const TerminalCreationForm = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
}) => {
  const [createTerminalView, setCreateTerminalView] = useState<
    CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS
  >(CREATE_TERMINAL_VIEW.DETAILS)

  return (
    <>
      {createTerminalView === CREATE_TERMINAL_VIEW.DETAILS && (
        <TerminalCreationLayout
          backFunc={() => {
            setView(VIEW.CREATION_OPTIONS)
          }}
          header="New Terminal"
        >
          <TerminalDetailsForm setCreateTerminalView={setCreateTerminalView} />
        </TerminalCreationLayout>
      )}
      {createTerminalView === CREATE_TERMINAL_VIEW.MEMBERS && (
        <TerminalCreationLayout
          backFunc={() => {
            setCreateTerminalView(CREATE_TERMINAL_VIEW.DETAILS)
          }}
          header="Add members"
        >
          <MembersView setCreateTerminalView={setCreateTerminalView} />
        </TerminalCreationLayout>
      )}
    </>
  )
}

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
  const onSubmit = (data: any) => {
    setFormData({
      ...formData,
      ...data,
    })
    setCreateTerminalView(CREATE_TERMINAL_VIEW.MEMBERS)
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
    prepend,
    remove,
    swap,
    move,
    insert,
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
            <Avatar size="sm" address={activeUser?.address!} />
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
                        Member {index + 1}
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
                            (members.every(
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
          // TODO: abstract validation logic
          registerOptions={{
            max: {
              value: memberFields?.length + 1,
              message: "Quorum cannot be greater than the number of members.",
            },
          }}
          quorumSize={memberFields?.length + 1 || 1}
        />
      </div>
      <div className="mb-3 flex w-full flex-col pt-4 text-center">
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

export const TerminalCreationOptionsView = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
}) => {
  return (
    <div>
      <h1 className="font-bold">New Terminal</h1>
      <p className="mt-3 text-slate-500">
        Use an existing Safe, or create Terminal with a new address.
      </p>
      <Selector
        title="Create a Terminal with a new address"
        subtitle="An address is unique to each terminal"
        className="mt-7"
        onClick={() => setView(VIEW.CREATE_FORM)}
      />
    </div>
  )
}

enum VIEW {
  CREATION_OPTIONS = "creation_options",
  CREATE_FORM = "form",
}

export const TerminalCreationDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [view, setView] = useState<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>(
    VIEW.CREATION_OPTIONS,
  )

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
      {view === VIEW.CREATION_OPTIONS && (
        <TerminalCreationOptionsView setView={setView} />
      )}
      {view === VIEW.CREATE_FORM && <TerminalCreationForm setView={setView} />}
    </BottomDrawer>
  )
}

export default TerminalCreationDrawer
