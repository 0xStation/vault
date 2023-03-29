import { TRACKING } from "lib/constants"
import { trackClick } from "lib/utils/amplitude"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useNetwork } from "wagmi"
import { VIEW } from "../../../../pages/project/new"
import { useTerminalCreationStore } from "../../../hooks/stores/useTerminalCreationStore"
import Layout from "../Layout"
import { MembersView } from "./MembersForm"
import { TerminalDetailsForm } from "./TerminalDetailsForm"

const { EVENT_NAME, LOCATION } = TRACKING

export enum CREATE_TERMINAL_VIEW {
  DETAILS = "details",
  MEMBERS = "members",
}

export const TerminalCreationForm = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW>>
}) => {
  const [createTerminalView, setCreateTerminalView] = useState<
    CREATE_TERMINAL_VIEW.DETAILS | CREATE_TERMINAL_VIEW.MEMBERS
  >(CREATE_TERMINAL_VIEW.DETAILS)
  const { chain } = useNetwork()

  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)

  useEffect(() => {
    setFormData({ ...formData, chainId: formData?.chainId || chain?.id })
  }, [])

  return (
    <>
      {createTerminalView === CREATE_TERMINAL_VIEW.DETAILS && (
        <Layout
          backFunc={() => {
            setView(VIEW.CREATION_OPTIONS)
            trackClick(EVENT_NAME.BACK_CLICKED, {
              location: LOCATION.PROJECT_CREATION_DETAILS_FORM,
            })
          }}
        >
          <TerminalDetailsForm setCreateTerminalView={setCreateTerminalView} />
        </Layout>
      )}
      {createTerminalView === CREATE_TERMINAL_VIEW.MEMBERS && (
        <MembersView setCreateTerminalView={setCreateTerminalView} />
      )}
    </>
  )
}

export default TerminalCreationForm
