import { Button } from "@ui/Button"
import { addressesAreEqual } from "lib/utils"
import { useEffect, useState } from "react"
import useStore from "../../hooks/stores/useStore"
import { RequestFrob } from "../../models/request/types"
import VoteManager from "../request/VoteManager"
import { ExecuteRequest } from "./ExecuteRequest"

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
    "You’ll be directed to confirm.",
  [`${ButtonStatus.VOTE}-${ButtonStatus.VOTED}`]:
    "You rejected the request. You will be able to execute rejection once the quorum has been met.",
  [`${ButtonStatus.VOTE}-${ButtonStatus.EXECUTE}`]:
    "Execute the rejection or vote to approve. You’ll be directed to confirm.",
  [`${ButtonStatus.VOTED}-${ButtonStatus.VOTE}`]:
    "You approved the request. You will be able to execute approval once the quorum has been met.",
  [`${ButtonStatus.VOTED}-${ButtonStatus.EXECUTE}`]:
    "You approved the request. Rejection met the quorum. Execute to change your vote. You’ll be directed to confirm.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.VOTE}`]:
    "Execute the approval or vote to reject. You’ll be directed to confirm.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.VOTED}`]:
    "You rejected the request. Approval met the quorum. Execute to change your vote. You’ll be directed to confirm.",
  [`${ButtonStatus.EXECUTE}-${ButtonStatus.EXECUTE}`]:
    "Both approval and rejection met the quorum. Choose one to execute. You’ll be directed to confirm.",
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
      <div className="fixed bottom-0 w-full max-w-[580px] border-t border-slate-200 bg-white px-4 pt-3 pb-6">
        <div className="flex w-full flex-row items-center space-x-2">
          <Button
            size="lg"
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
            size="lg"
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
        <p className="mt-2 text-xs text-slate-500">
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
