import { useRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import { useStore } from "../../hooks/stores/useStore"
import Selector from "../core/SelectorCard"
import Layout from "./Layout"

export enum VIEW {
  CREATION_OPTIONS = "creation_options",
  CREATE_FORM = "form",
}

export const TerminalCreationOptionsView = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
}) => {
  const router = useRouter()
  const activeUser = useStore((state) => state.activeUser)
  return (
    <Layout backFunc={() => router.back()} isCloseIcon={true}>
      <h2 className="font-bold">New Terminal</h2>
      <p className="mt-3 text-slate-500">
        Use an existing Safe, or create Terminal with a new address.
      </p>
      <Selector
        title="Create a Terminal with a new address"
        subtitle="An address is unique to each terminal"
        className="mt-7"
        onClick={() => setView(VIEW.CREATE_FORM)}
      />
    </Layout>
  )
}

export default TerminalCreationOptionsView
