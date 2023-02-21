import { Dispatch, SetStateAction, useState } from "react"
import Layout from "../Layout"
import { VIEW } from "../TerminalCreationOptionsView"
import { MembersView } from "./MembersForm"
import { TerminalDetailsForm } from "./TerminalDetailsForm"

export enum CREATE_TERMINAL_VIEW {
  DETAILS = "details",
  MEMBERS = "members",
}

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
        <Layout
          backFunc={() => {
            setView(VIEW.CREATION_OPTIONS)
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
