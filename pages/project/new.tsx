import { useEffect, useState } from "react"
import TerminalCreationForm from "../../src/components/terminalCreation/create"
import { TerminalCreationOptionsView } from "../../src/components/terminalCreation/TerminalCreationOptionsView"
import useStore from "../../src/hooks/stores/useStore"

export enum VIEW {
  CREATION_OPTIONS = "creation_options",
  CREATE_FORM = "create_form",
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
    </>
  )
}

export default TerminalCreationPage