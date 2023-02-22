import { Button } from "@ui/Button"
import axios from "axios"
import { encodeChangeThreshold } from "lib/encodings/safe/members"
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
    const encodedData = encodeChangeThreshold(safeMetadata.address, data.quorum)

    // TODO: move to util
    const { root, proofs, message } = newActionTree({
      nonce: nextNonce?.nonce as number,
      safe: safeMetadata.address,
      chainId: safeMetadata.chainId,
      executor: ZERO_ADDRESS,
      ...encodedData,
    })

    try {
      const signature = await signMessage(message)

      if (!signature) {
        // TODO
        console.log("no signature :(")
        return
      }

      const request = await axios.put(
        `/api/v1/terminal/${safeMetadata.chainId}/${safeMetadata.address}/request/withAction`, // TODO: make withAction a query param
        {
          chainId: safeMetadata.chainId,
          address: safeMetadata.address,
          variantType: { setQuorum: data.quorum } as SignerQuorumVariant,
          createdBy: activeUser?.address,
          note: "",
          nonce: nextNonce?.nonce as number,
        },
      )

      console.log("request!", request)

      // create request
    } catch (err) {
      console.error("Something went wrong.", err)
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
              "You’ll be directed to sign the changes as a request, which will subject to quorum. This action does not cost gas."}
          </p>
        </div>
      </form>
    </BottomDrawer>
  )
}
