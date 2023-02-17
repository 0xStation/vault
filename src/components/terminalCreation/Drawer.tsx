import BottomDrawer from "@ui/BottomDrawer"
import { Dispatch, SetStateAction, useState } from "react"
import Selector from "../core/SelectorCard"
import { TerminalCreationForm } from "./create"

export const TerminalCreationOptionsView = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
}) => {
  return (
    <div>
      <h1 className="font-bold">New Terminal</h1>
      <p className="mt-3 text-slate-500">
        Use an existing Safe, or create Terminal with a new address.
      </p>
      <Selector
        title="Create a Terminal with a new address"
        subtitle="An address is unique to each terminal"
        className="mt-7"
        onClick={() => setView(VIEW.CREATE_FORM)}
      />
    </div>
  )
}

export enum VIEW {
  CREATION_OPTIONS = "creation_options",
  CREATE_FORM = "form",
}

export const TerminalCreationDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [view, setView] = useState<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>(
    VIEW.CREATION_OPTIONS,
  )

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen} size="lg">
      {view === VIEW.CREATION_OPTIONS && (
        <TerminalCreationOptionsView setView={setView} />
      )}
      {view === VIEW.CREATE_FORM && <TerminalCreationForm setView={setView} />}
      {/* TODO: {view === VIEW.IMPORT_FORM && <TerminalImportForm setView={setView}/>} */}
    </BottomDrawer>
  )
}

export default TerminalCreationDrawer
