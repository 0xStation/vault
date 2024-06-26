import { Button } from "@ui/Button"
import { addressesAreEqual } from "lib/utils"
import React, { useEffect, useState } from "react"
import useStore from "../../hooks/stores/useStore"
import { RequestFrob } from "../../models/request/types"
import { ExecuteRequest } from "./ExecuteRequest"
import VoteManager from "./VoteManager"

enum ButtonStatus {
  VOTE,
  VOTED,
  EXECUTE,
}

const buttonStatusProps: Record<
  ButtonStatus,
  {
    disabled: boolean
    variant: "primary" | "secondary"
    approveCopy: string
    rejectCopy: string
  }
> = {
  [ButtonStatus.VOTE]: {
    disabled: false,
    variant: "secondary",
    approveCopy: "Approve",
    rejectCopy: "Reject",
  },
  [ButtonStatus.VOTED]: {
    disabled: true,
    variant: "secondary",
    approveCopy: "Approved",
    rejectCopy: "Rejected",
  },
  [ButtonStatus.EXECUTE]: {
    disabled: false,
    variant: "primary",
    approveCopy: "Execute approval",
    rejectCopy: "Execute rejection",
  },
}
const buttonStatusComboProps: Record<string, any> = {
  [`${ButtonStatus.VOTE}-${ButtonStatus.VOTE}`]:
    "You&apos;ll be directed to sign. This action does not cost gas.",
  [`${ButtonStatus.VOTE}-${ButtonStatus.VOTED}`]:
    "You rejected the request. You&apos;ll be able to execute rejection once the quorum has been met.",
  [`${ButtonStatus.VOTE}-${ButtonStatus.EXECUTE}`]:
    "Execute the rejection or vote to approve. This action will be recorded on-chain. You’ll be directed to execute.",
  [`${ButtonStatus.VOTED}-${ButtonStatus.VOTE}`]:
    "You approved the request. You'll' be able to execute approval once the quorum has been met.",
  [`${ButtonStatus.VOTED}-${ButtonStatus.EXECUTE}`]:
    "You approved the request. Rejection has met the quorum. You can execute to change your vote. This action will be recorded on-chain. You’ll be directed to execute.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.VOTE}`]:
    "Execute the approval or vote to reject. You’ll be directed to confirm and execute your choice.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.VOTED}`]:
    "You rejected the request. Approval has met the quorum. Execute to change your vote. This action will be recorded on-chain. You’ll be directed to execute.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.EXECUTE}`]:
    "Both approval and rejection have met the quorum. Choose one to execute. This action will be recorded on-chain. You’ll be directed to execute.",
}

export const RequestDetailsActions = ({
  request,
  mutateRequest,
}: {
  request?: RequestFrob
  mutateRequest: any
}) => {
  const [isVoteOpen, setIsVoteOpen] = useState<boolean>(false)
  const [isExecuteOpen, setIsExecuteOpen] = useState<boolean>(false)
  const [voteApprove, setVoteApprove] = useState<boolean>(false)
  const [executeApprove, setExecuteApprove] = useState<boolean>(false)
  const activeUser = useStore((state) => state.activeUser)
  const [approveButtonStatus, setApproveButtonStatus] = useState<ButtonStatus>(
    ButtonStatus.VOTE,
  )
  const [rejectButtonStatus, setRejectButtonStatus] = useState<ButtonStatus>(
    ButtonStatus.VOTE,
  )

  useEffect(() => {
    if (
      (request?.approveActivities.filter((activity) =>
        request.signers.includes(activity.address),
      ).length ?? 0) >= (request?.quorum ?? -1)
    ) {
      setApproveButtonStatus(ButtonStatus.EXECUTE)
    } else if (
      request?.approveActivities.some((activity) =>
        addressesAreEqual(activity.address, activeUser?.address),
      )
    ) {
      setApproveButtonStatus(ButtonStatus.VOTED)
    } else {
      setApproveButtonStatus(ButtonStatus.VOTE)
    }

    if (
      (request?.rejectActivities.filter((activity) =>
        request.signers.includes(activity.address),
      ).length ?? 0) >= (request?.quorum ?? -1)
    ) {
      setRejectButtonStatus(ButtonStatus.EXECUTE)
    } else if (
      request?.rejectActivities.some((activity) =>
        addressesAreEqual(activity.address, activeUser?.address),
      )
    ) {
      setRejectButtonStatus(ButtonStatus.VOTED)
    } else {
      setRejectButtonStatus(ButtonStatus.VOTE)
    }
  }, [request])

  return (
    <>
      <VoteManager
        request={request}
        isOpen={isVoteOpen}
        setIsOpen={setIsVoteOpen}
        approve={voteApprove}
        mutateRequest={mutateRequest}
      />
      <ExecuteRequest
        request={request!}
        isOpen={isExecuteOpen}
        setIsOpen={setIsExecuteOpen}
        approve={executeApprove}
        mutateRequest={mutateRequest}
      />
      {/* TODO: max-w-[580px] is shrinking to mobile size for easier demoing, fix when doing actual desktop implementation */}
      <div className="fixed bottom-0 w-full border-t border-gray-80 bg-black px-4 pt-3 pb-6">
        <div className="flex flex-row items-center space-x-2">
          <Button
            size="base"
            fullWidth={true}
            variant={buttonStatusProps[approveButtonStatus].variant}
            disabled={buttonStatusProps[approveButtonStatus].disabled}
            onClick={
              approveButtonStatus === ButtonStatus.EXECUTE
                ? () => {
                    setExecuteApprove(true)
                    setIsExecuteOpen(true)
                  }
                : () => {
                    setVoteApprove(true)
                    setIsVoteOpen(true)
                  }
            }
          >
            {buttonStatusProps[approveButtonStatus].approveCopy}
          </Button>
          <Button
            size="base"
            fullWidth={true}
            variant={buttonStatusProps[rejectButtonStatus].variant}
            disabled={buttonStatusProps[rejectButtonStatus].disabled}
            onClick={
              rejectButtonStatus === ButtonStatus.EXECUTE
                ? () => {
                    setExecuteApprove(false)
                    setIsExecuteOpen(true)
                  }
                : () => {
                    setVoteApprove(false)
                    setIsVoteOpen(true)
                  }
            }
          >
            {buttonStatusProps[rejectButtonStatus].rejectCopy}
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray">
          {
            buttonStatusComboProps[
              `${approveButtonStatus}-${rejectButtonStatus}`
            ]
          }
        </p>
      </div>
    </>
  )
}
