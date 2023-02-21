import { create } from "zustand"

type TerminalCreationFormData = {
  name: string
  chainId: undefined | number
  about: string
  url: string
  members: { address: string }[]
  quorum: undefined | number
}

interface TerminalCreationFormState {
  formData: TerminalCreationFormData
  setFormData: (formData: TerminalCreationFormData) => void
}

export const useTerminalCreationStore = create<TerminalCreationFormState>(
  (set) => ({
    formData: {
      name: "",
      chainId: undefined,
      about: "",
      url: "",
      members: [],
      quorum: undefined,
    },
    setFormData: (formData: TerminalCreationFormData) => {
      set(() => {
        return { formData }
      })
    },
  }),
)
