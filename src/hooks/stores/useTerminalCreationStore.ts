import { create } from "zustand"

type TerminalCreationFormData = {
  name: string
  chainId: undefined | number
  about: string
  url: string
  members: { address: string }[]
  quorum: undefined | number
  address: undefined | string
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
      address: "",
    },
    setFormData: (formData: TerminalCreationFormData) => {
      set(() => {
        return { formData }
      })
    },
  }),
)
