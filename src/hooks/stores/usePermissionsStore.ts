import { create } from "zustand"

interface PermissionsStoreState {
  isSigner: boolean
  setIsSigner: (isSigner: boolean) => void
}

export const usePermissionsStore = create<PermissionsStoreState>((set) => ({
  isSigner: false,
  setIsSigner: (isSigner: boolean) => {
    set(() => ({
      isSigner,
    }))
  },
}))
