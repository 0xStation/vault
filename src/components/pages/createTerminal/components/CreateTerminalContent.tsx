import { useEffect, useState } from "react"
import useStore from "../../../../hooks/stores/useStore"
import TerminalCreationForm from "../../../terminalCreation/create"
import { TerminalCreationOptionsView } from "../../../terminalCreation/TerminalCreationOptionsView"

export enum VIEW {
  CREATION_OPTIONS = "creation_options",
  CREATE_FORM = "form",
}

export const TerminalCreationPage = () => {
  const [view, setView] = useState<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>(
    VIEW.CREATION_OPTIONS,
  )
  const activeUser = useStore((state) => state.activeUser)

  useEffect(() => {
    if (!activeUser) {
      // redirect
    }
  })

  return (
    <>
      {view === VIEW.CREATION_OPTIONS && (
        <TerminalCreationOptionsView setView={setView} />
      )}
      {view === VIEW.CREATE_FORM && <TerminalCreationForm setView={setView} />}
      {/* TODO: {view === VIEW.IMPORT_FORM && <TerminalImportForm setView={setView}/>} */}
    </>
  )
}

export default TerminalCreationPage
