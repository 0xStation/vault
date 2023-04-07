import { create } from "zustand"

interface RequestState {
  selectedRequestId: string | undefined | null
  setSelectedRequestId: (request: string | undefined | null) => void
}

export const useRequestStore = create<RequestState>((set) => ({
  selectedRequestId: undefined, // undefined on start
  setSelectedRequestId: (request: string | undefined | null) =>
    set(() => {
      return { selectedRequestId: request }
    }),
}))
