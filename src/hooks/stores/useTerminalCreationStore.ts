import { create } from "zustand"

type TerminalCreationFormData = {
  name: string
  chainId: number
  about: string
  url: string
  members: { address: string }[]
  quorum: number
}

interface TerminalCreationFormState {
  formData: TerminalCreationFormData
  setFormData: (formData: TerminalCreationFormData) => void
}

export const useTerminalCreationStore = create<TerminalCreationFormState>(
  (set) => ({
    formData: {
      name: "",
      chainId: 1,
      about: "",
      url: "",
      members: [],
      quorum: 0,
    },
    setFormData: (formData: TerminalCreationFormData) => {
      set(() => {
        return { formData }
      })
    },
  }),
)
