import { Button } from "@ui/Button"
import axios from "axios"
import { prepareChangeThresholdCall } from "lib/encodings/safe/members"
import { newActionTree } from "lib/signatures/tree"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import useStore from "../../hooks/stores/useStore"
import { useGetNextNonce } from "../../hooks/useGetNextNonce"
import useSignature from "../../hooks/useSignature"
import { ZERO_ADDRESS } from "../../lib/constants"
import { SignerQuorumVariant } from "../../models/request/types"
import { SafeMetadata } from "../../models/safe/types"
import QuorumInput from "../form/QuorumInput"
import { BottomDrawer } from "../ui/BottomDrawer"

export const UpdateMembersDrawer = ({
  isOpen,
  setIsOpen,
  safeMetadata,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  safeMetadata: SafeMetadata
}) => {
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
  const onSubmit = async (data: any) => {
    const changeThresholdCall = prepareChangeThresholdCall(
      safeMetadata.address,
      data.quorum,
    )
    let calls = [changeThresholdCall] // order matters
    const { message } = newActionTree({
      chainId: safeMetadata.chainId,
      safe: safeMetadata.address,
      nonce: nextNonce?.nonce as number,
      executor: ZERO_ADDRESS,
      calls,
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
          variantType: {
            setQuorum: data.quorum,
            add: [],
            remove: [],
          } as SignerQuorumVariant,
          createdBy: activeUser?.address,
          note: "", // TODO
          nonce: nextNonce?.nonce as number,
          path: [],
          calls,
          signatureMetadata: {
            message,
            signature,
          },
        },
      )

      const { request, proof, activity } = requestResponse.data

      console.log(request, proof, activity)
      setIsOpen(false)
      // TODO: show toasty toast
      // create request
    } catch (err) {
      console.error("Something went wrong.", err)
      // TODO: show toasty toast
    }
  }

  const onError = () => {}

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quorum: safeMetadata?.quorum || 1,
    } as FieldValues,
  })
  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
      <h2 className="mb-[30px] font-bold">Edit members</h2>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex h-[calc(100%-120px)] flex-col"
      >
        {/* {safeMetadata?.signers?.map((signerAddress) => (
          <div key={signerAddress} className="flex flex-row">
            <AvatarAddress size="sm" address={signerAddress} className="mb-2" />
          </div>
        ))} */}
        <QuorumInput
          label="Quorum*"
          register={register}
          name="quorum"
          errors={errors}
          required
          registerOptions={{
            max: {
              value: safeMetadata?.signers?.length,
              message: "Quorum cannot be greater than the number of members.",
            },
            min: {
              value: 1,
              message: "Quorum must be at least 1 member.",
            },
            valueAsNumber: true,
          }}
          quorumSize={safeMetadata?.signers?.length || 1} // default to 1 since activeUser is a member
        />
        <div className="absolute bottom-0 right-0 left-0 mx-auto mb-3 w-full px-5 text-center">
          <Button type="submit" fullWidth={true}>
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
    </BottomDrawer>
  )
}
