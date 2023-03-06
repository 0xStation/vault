import { BigNumber } from "@ethersproject/bignumber"
import { Button } from "@ui/Button"
import { prepareExecuteSafeTransaction } from "lib/encodings/safe/exec-transaction"
import { EIP712Message, getHash } from "lib/signatures/utils"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import { useSendTransaction, useWaitForTransaction } from "wagmi"
import useGetSafeConfirmations from "../../../hooks/safe/useGetSafeConfirmations"
import { useGetSafeNonce } from "../../../hooks/safe/useGetSafeNonce"
import useGetSafeTransaction from "../../../hooks/safe/useGetSafeTransaction"
import { useSafeMetadata } from "../../../hooks/safe/useSafeMetadata"
import { useSignToEnableModule } from "../../../hooks/safe/useSignToEnableModule"
import useStore from "../../../hooks/stores/useStore"
import addConfirmationToTransaction from "../../../models/safe/mutations/addConfirmationToTransaction"
import createTransaction from "../../../models/safe/mutations/createTransaction"
import { updateTerminal } from "../../../models/terminal/mutations/updateTerminal"
import { Terminal } from "../../../models/terminal/types"
import { AvatarAddress } from "../../core/AvatarAddress"
import Overlay from "../../core/Overlay"

export const TerminalActivationView = ({
  isOpen,
  setIsOpen,
  terminal,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  terminal: Terminal
}) => {
  const { safeMetadata } = useSafeMetadata({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })

  const activeUser = useStore((state) => state.activeUser)
  const { confirmations } = useGetSafeConfirmations({
    safeTxnHash: terminal?.data?.safeTxnHash as string,
    chainId: terminal?.chainId,
  })
  const { nonce } = useGetSafeNonce({
    address: terminal?.data?.nonce
      ? undefined
      : (terminal?.safeAddress as string),
    chainId: terminal?.chainId as number,
  })

  const { signToEnableModule } = useSignToEnableModule({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
    nonce:
      typeof terminal?.data?.nonce === "number" ? terminal?.data?.nonce : nonce,
  })
  const { transaction } = useGetSafeTransaction({
    safeTxnHash: terminal?.data?.safeTxnHash as string,
    chainId: terminal?.chainId,
  })

  const router = useRouter()
  const hasApproved = confirmations?.some(
    (confirmation: any) => confirmation.owner === activeUser?.address,
  )
  const awaitingConfirmations =
    !confirmations ||
    (confirmations.length &&
      confirmations.length < (safeMetadata?.quorum as number))

  const signersLeftToApprove =
    safeMetadata?.signers.filter(
      (signer) =>
        !confirmations?.some(
          (confirmation: any) => confirmation.owner === signer,
        ),
    ) || []

  const { sendTransactionAsync } = useSendTransaction({
    mode: "recklesslyUnprepared",
  })

  const handleExecute = async () => {
    const signatures = transaction.confirmations
      .sort((a, b) =>
        BigNumber.from(a.owner).gt(BigNumber.from(b.owner)) ? 1 : -1,
      ) // sort confirmations by increasing address order, needed for smart contract validation
      .reduce(
        (acc, confirmation) =>
          acc +
          confirmation.signature.substring(2, confirmation.signature.length),
        "0x",
      )
    const txData = prepareExecuteSafeTransaction(
      terminal?.safeAddress,
      {
        to: transaction.to,
        value: transaction.value,
        data: transaction.data,
      },
      signatures,
    )

    const executedTransaction = await sendTransactionAsync({
      recklesslySetUnpreparedRequest: txData,
    })
    console.log("transaction", executedTransaction)
  }

  const handleApprove = async () => {
    let signature, message, signedNonce
    try {
      const signatureData = await signToEnableModule()
      signature = signatureData.signature
      message = signatureData.message
      signedNonce = signatureData.nonce
    } catch (err) {
      // TODO: add toast
      console.error(err)
      return
    }

    if (terminal?.data?.safeTxnHash) {
      try {
        const response = await addConfirmationToTransaction({
          chainId: terminal?.chainId,
          signature,
          safeTxnHash: terminal?.data?.safeTxnHash,
        })
        // success case returns no code, failure returns code
        // only code returned in our experience so far is 1337 for an invalid safeTxHash value
        if (response?.code === 1337) {
          throw Error("Invalid safe Tx hash")
        }
        return
      } catch (err) {
        // TODO: add toast
        console.error(err)
        return
      }
    } else {
      let transaction
      try {
        transaction = await createTransaction({
          chainId: terminal?.chainId,
          address: terminal?.safeAddress,
          signature,
          message,
          senderAddress: activeUser?.address as string,
        })
      } catch (err) {
        console.error("Failed to create safe txn", err)
        return
      }

      const { safeAddress, chainId } = terminal
      const { name, description, url } = terminal?.data
      const safeTxHash = getHash(message as EIP712Message)
      try {
        const newTerminal = await updateTerminal({
          safeAddress,
          name,
          chainId,
          description,
          url,
          safeTxnHash: safeTxHash,
          nonce: signedNonce,
          terminalId: terminal?.id,
        })
        console.log("newTerminal", newTerminal)
      } catch (err) {
        console.error("Failed to update Terminal: ", err)
        return
      }
    }
  }

  return (
    <Overlay setIsOpen={setIsOpen} isOpen={isOpen}>
      <div className="mx-10 flex h-full flex-col items-center justify-center text-slate-50">
        <h2 className="font-bold">Terminal not activated</h2>
        <p className="mt-1 text-center">
          Requires {signersLeftToApprove.length} more approvals to activate your
          Terminal.
        </p>
        <div className="mt-6 flex flex-row space-x-3">
          {awaitingConfirmations && !hasApproved ? (
            <Button variant="primary" size="lg" onClick={handleApprove}>
              Approve
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleExecute}>
              Activate
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push(`/u/${activeUser?.address}/profile`)}
          >
            Go to profile
          </Button>
        </div>
        {awaitingConfirmations && (
          <div className="mt-9 w-full text-left">
            <p className="text-slate-500">Hasn't approved</p>
            {signersLeftToApprove.map((signer) => (
              <AvatarAddress address={signer} className="mt-2" />
            ))}
          </div>
        )}
      </div>
    </Overlay>
  )
}

export default TerminalActivationView
