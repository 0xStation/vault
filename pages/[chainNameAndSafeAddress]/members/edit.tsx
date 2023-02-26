import { XMarkIcon } from "@heroicons/react/24/solid"
import { Avatar } from "@ui/Avatar"
import { Button } from "@ui/Button"
import axios from "axios"
import { ZERO_ADDRESS } from "lib/constants"
import {
  prepareAddOwnerWithThresholdCall,
  prepareChangeThresholdCall,
  prepareRemoveOwnerCall,
} from "lib/encodings/safe/members"
import { getOwnerIndexAndPrevSignerAddress } from "lib/helpers/getPrevSignerAddress"
import { prepareSwapCallAndUpdateVariant } from "lib/helpers/prepareSwapCallAndUpdateVariant"
import { newActionTree } from "lib/signatures/tree"
import { addressesAreEqual } from "lib/utils"
import isEqual from "lodash.isequal"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FieldValues, useFieldArray, useForm } from "react-hook-form"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import AddressInput from "../../../src/components/form/AddressInput"
import QuorumInput from "../../../src/components/form/QuorumInput"
import TextareaWithLabel from "../../../src/components/form/TextareaWithLabel"
import RemoveSignerConfirmationDrawer from "../../../src/components/memberEditing/RemoveSignerConfirmationDrawer"
import Layout from "../../../src/components/terminalCreation/Layout"
import { useResolveEnsAddress } from "../../../src/hooks/ens/useResolveEns"
import { useSafeMetadata } from "../../../src/hooks/safe/useSafeMetadata"
import useStore from "../../../src/hooks/stores/useStore"
import { useGetNextNonce } from "../../../src/hooks/useGetNextNonce"
import useSignature from "../../../src/hooks/useSignature"
import useWindowSize from "../../../src/hooks/useWindowSize"
import { SignerQuorumVariant } from "../../../src/models/request/types"
import { convertGlobalId } from "../../../src/models/terminal/utils"

export const EditMembersPage = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const { chainId, address } = convertGlobalId(
    chainNameAndSafeAddress as string,
  )
  const { safeMetadata } = useSafeMetadata({
    address: address as string,
    chainId: chainId as number,
  })
  const activeUser = useStore((state) => state.activeUser)
  const { signMessage } = useSignature()
  const nextNonce = useGetNextNonce({
    chainId: safeMetadata.chainId,
    address: safeMetadata.address,
  })
  const [formMessage, setFormMessage] = useState<{
    isError: boolean
    message: string
  }>({ isError: false, message: "" })
  const { resolveEnsAddress } = useResolveEnsAddress()
  const [signersToRemove, setSignersToRemove] = useState<Set<string>>(
    new Set<string>(),
  )

  const onSubmit = async (data: any) => {
    const existingSignersState = [...safeMetadata?.signers]

    // We need to keep track of the addresses of the signers
    // w.r.t to their indices since the signers exist
    // in a linked-list structure in the safe contract. To perform
    // certain operations like "remove" and "add" we need to know
    // what the prev signer address that is pointing to the current
    // value to update the linked list structure.
    let updatedSignersState = [...safeMetadata?.signers]
    const signersToRemoveArray = Array.from(signersToRemove)

    // Format the values from the field data, so we can
    // use it as an array of addresses.
    const addressesFromMembersFields = data.members?.map(
      (item: { address: string; id: string }) => item.address,
    )

    // all addresses, filtering out any duplicates just in case
    const allAddresses = [
      ...safeMetadata?.signers,
      ...addressesFromMembersFields,
    ].filter((v, i, addresses) => addresses.indexOf(v) === i)

    // `newSignersState` reflects the new state of the changes:
    // the added signers are present and the removed signers are gone.
    const newSignersState = allAddresses.filter(
      (address) => signersToRemoveArray.indexOf(address) === -1,
    )

    // Check if any changes have been made to the signers or quorum
    // if not, return.
    if (
      isEqual(newSignersState, existingSignersState) &&
      data.quorum === safeMetadata?.quorum
    ) {
      setFormMessage({ isError: false, message: "No changes have been made." })
      return
    }

    // Intersection includes the signers that are unaffected from the new
    // changes and thus are reflected in both the old and the new state.
    const intersection = existingSignersState.filter(
      (address) => newSignersState.indexOf(address) !== -1, // shared addresses
    )

    // The existing signer state minus the intersection (unaffected signers).
    const filteredExistingSignersState = existingSignersState.filter(
      (address) => intersection.indexOf(address) === -1,
    )
    // The new signer state minus the intersection (unaffected signers).
    const filteredNewSignersState = newSignersState.filter(
      (address) => intersection.indexOf(address) === -1,
    )

    // they will all be swap calls otherwise
    const shouldChangeQuorumWithSeparateCall =
      filteredExistingSignersState.length === filteredNewSignersState.length &&
      data.quorum !== safeMetadata?.quorum

    let variantType = {
      add: [] as string[],
      remove: [] as string[],
      setQuorum: data.quorum || safeMetadata?.quorum,
    } as SignerQuorumVariant
    let preparedCalls = []
    const swapLength = Math.min(
      filteredNewSignersState.length,
      filteredExistingSignersState.length,
    )

    let i = 0
    while (i < swapLength) {
      const { ownerIndex, prevSignerAddress } =
        getOwnerIndexAndPrevSignerAddress({
          addressArray: updatedSignersState,
          ownerAddress: filteredExistingSignersState[i],
        })

      const newSignerAddress = await resolveEnsAddress(
        filteredNewSignersState[i],
      )

      const { swapOwnerCall } = prepareSwapCallAndUpdateVariant({
        safeAddress: safeMetadata.address,
        prevSignerAddress,
        oldSignerAddress: filteredExistingSignersState[i],
        newSignerAddress: newSignerAddress as string,
        variantType,
      })

      updatedSignersState[ownerIndex] = newSignerAddress as string
      preparedCalls.push(swapOwnerCall)
      i++
    }

    if (filteredExistingSignersState.length > filteredNewSignersState.length) {
      while (i < filteredExistingSignersState.length) {
        const { ownerIndex, prevSignerAddress } =
          getOwnerIndexAndPrevSignerAddress({
            addressArray: updatedSignersState,
            ownerAddress: filteredExistingSignersState[i],
          })
        const removeOwnerCall = prepareRemoveOwnerCall(
          safeMetadata.address,
          prevSignerAddress,
          filteredExistingSignersState[i],
          i === filteredExistingSignersState.length - 1
            ? safeMetadata?.quorum
            : data.quorum,
        )

        variantType.remove.push(filteredExistingSignersState[i])
        updatedSignersState.splice(ownerIndex, 1)
        preparedCalls.push(removeOwnerCall)
        i++
      }
    } else {
      while (i < filteredNewSignersState.length) {
        const newSignerAddress = await resolveEnsAddress(
          filteredNewSignersState[i],
        )
        const addOwnerCall = prepareAddOwnerWithThresholdCall(
          safeMetadata.address,
          newSignerAddress as string,
          i === filteredExistingSignersState.length - 1
            ? safeMetadata?.quorum
            : data.quorum,
        )
        updatedSignersState.push(newSignerAddress as string)
        variantType.add.push(newSignerAddress as string)
        preparedCalls.push(addOwnerCall)
        i++
      }
    }

    if (shouldChangeQuorumWithSeparateCall) {
      const changeThresholdCall = prepareChangeThresholdCall(
        safeMetadata.address,
        data.quorum,
      )
      preparedCalls.push(changeThresholdCall)
    }

    const { root, message } = newActionTree({
      chainId: safeMetadata.chainId,
      safe: safeMetadata.address,
      nonce: nextNonce?.nonce as number,
      executor: ZERO_ADDRESS,
      calls: [...preparedCalls],
    })

    try {
      const signature = await signMessage(message)

      if (!signature) {
        // TODO: show toasty toast
        console.log("no signature :(")
        return
      }

      const requestResponse = await axios.post(
        `/api/v1/terminal/${safeMetadata.chainId}/${safeMetadata.address}/request/createApprovedRequest`,
        {
          chainId: safeMetadata.chainId,
          address: safeMetadata.address,
          variantType,
          createdBy: activeUser?.address,
          note: data.note,
          nonce: nextNonce?.nonce as number,
          path: [],
          calls: [...preparedCalls],
          root,
          signatureMetadata: {
            message,
            signature,
          },
        },
      )

      const { request, proof, activity } = requestResponse.data

      router.push(`${chainNameAndSafeAddress}/members`)
    } catch (err: any) {
      console.error(err)
      if (
        err.code === 4001 ||
        (err?.name && err?.name === "UserRejectedRequestError")
      ) {
        setFormMessage({
          isError: true,
          message: "Signature was rejected.",
        })
      } else {
        setFormMessage({
          isError: true,
          message: "Something went wrong.",
        })
      }
      // TODO: show toasty toast
    }
  }

  const windowSize = useWindowSize()

  const onError = () => {}
  const [isRemoveSignerDrawerOpen, setRemoveSignerDrawerOpen] =
    useState<boolean>(false)
  const [addressToBeRemoved, setAddressToBeRemoved] = useState<string>("")
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    control,
    watch,
    trigger,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      quorum: safeMetadata?.quorum || 1,
      members: [],
      note: "",
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

  const watchMembers = watch("members", [])
  useEffect(() => {
    trigger("members")
  }, [signersToRemove])

  const updatedQuorum =
    safeMetadata?.signers?.length - signersToRemove.size + watchMembers.length
  const hi = `max-h-[${windowSize?.height - 400}px]`

  return (
    <>
      <RemoveSignerConfirmationDrawer
        isOpen={isRemoveSignerDrawerOpen}
        setIsOpen={setRemoveSignerDrawerOpen}
        onClick={() => {
          setSignersToRemove(new Set(signersToRemove.add(addressToBeRemoved)))
        }}
        addressToBeRemoved={addressToBeRemoved}
        activeUserAddress={activeUser?.address as string}
      />
      <Layout
        backFunc={() => router.push(`/${chainNameAndSafeAddress}/members`)}
        isCloseIcon={true}
      >
        <h2 className="mb-[30px] font-bold">Edit members</h2>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex h-[calc(100%-120px)] flex-col"
        >
          <div
            className={`flex ${
              windowSize.height < 730
                ? "max-h-[430px]"
                : windowSize.height < 800
                ? "max-h-[500px]"
                : "max-h-[600px]"
            } grow flex-col overflow-scroll pb-3`}
          >
            <div className="mb-3">
              {safeMetadata?.signers?.map((address) => {
                return !signersToRemove.has(address) ? (
                  <div
                    className="mb-3 flex flex-row justify-between"
                    key={address}
                  >
                    {address === activeUser?.address ? (
                      <div
                        className={`flex flex-row ${
                          signersToRemove.has(address) && "opacity-70"
                        }`}
                      >
                        <Avatar size="sm" address={activeUser?.address || ""} />
                        <p className="ml-2">You</p>
                      </div>
                    ) : (
                      <AvatarAddress
                        size="sm"
                        address={address || ""}
                        className={`${
                          signersToRemove.has(address) && "opacity-70"
                        }`}
                      />
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setAddressToBeRemoved(address)
                        setRemoveSignerDrawerOpen(true)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null
              })}
              {(
                memberFields as unknown as [{ id: string; address: string }]
              ).map((item, index) => {
                return (
                  <div
                    key={item.id + item.address}
                    className="mb-1 rounded bg-slate-200 p-3"
                  >
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="text-sm font-bold text-slate-500">
                        Member{" "}
                        {safeMetadata?.signers?.length -
                          signersToRemove.size +
                          index +
                          1}
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
                          const memberAddresses = (
                            watchMembers as { address: string; id: string }[]
                          ).map((item) => item?.address)

                          const signersToRemoveArray =
                            Array.from(signersToRemove)
                          const activeSigners = safeMetadata?.signers.filter(
                            (address) =>
                              !signersToRemoveArray.includes(address),
                          )

                          return (
                            (!memberAddresses.some(
                              (val, i) => memberAddresses.indexOf(val) !== i,
                            ) &&
                              !addressesAreEqual(activeUser?.address, addy) &&
                              !activeSigners.includes(addy as string)) ||
                            "Member already added."
                          )
                        },
                      }}
                    />
                  </div>
                )
              })}
              <Button
                type="button"
                variant="tertiary"
                fullWidth={true}
                size="sm"
                onClick={() => append({ address: "" })}
              >
                + Add member
              </Button>
            </div>
            <QuorumInput
              label="Quorum*"
              register={register}
              name="quorum"
              errors={errors}
              required
              registerOptions={{
                max: {
                  value: updatedQuorum,
                  message:
                    "Quorum cannot be greater than the number of members.",
                },
                min: {
                  value: 1,
                  message: "Quorum must be at least 1 member.",
                },
                valueAsNumber: true,
              }}
              quorumSize={updatedQuorum || 1} // default to 1 since activeUser is a member
            />
            {isDirty && (
              <TextareaWithLabel
                label={"Note*"}
                register={register}
                required
                name="note"
                errors={errors}
                placeholder="Onboard Alice to the team"
              />
            )}
          </div>
          <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full px-5 text-center">
            <Button
              type="submit"
              fullWidth={true}
              onBlur={() => setFormMessage({ isError: false, message: "" })}
            >
              Edit
            </Button>
            <p
              className={`mt-1 text-xs  ${
                formMessage?.isError ? "text-red" : "text-slate-500"
              }`}
            >
              {formMessage.message ||
                "You’ll be directed to sign the changes as a request, which will be subject to quorum. This action does not cost gas."}
            </p>
          </div>
        </form>
      </Layout>
    </>
  )
}

export default EditMembersPage
