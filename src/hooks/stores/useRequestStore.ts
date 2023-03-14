import { create } from "zustand"
import { RequestFrob } from "../../models/request/types"

interface RequestState {
  selectedRequest: RequestFrob | undefined | null
  setSelectedRequest: (request: RequestFrob | undefined | null) => void
}

export const useRequestStore = create<RequestState>((set) => ({
  selectedRequest: undefined, // undefined on start
  setSelectedRequest: (request: RequestFrob | undefined | null) =>
    set(() => {
      return { selectedRequest: request }
    }),
}))
