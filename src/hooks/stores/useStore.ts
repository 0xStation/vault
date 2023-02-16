import { create } from "zustand"
import { Account } from "../../models/account/types"

interface StoreState {
  activeUser: undefined | Account | null
  setActiveUser: (user: undefined | Account | null) => void
}

const useStore = create<StoreState>((set) => ({
  activeUser: undefined, // undefined on start, Account if found, null if not found
  setActiveUser: (user: undefined | Account | null) =>
    set(() => {
      return { activeUser: user }
    }),
}))

export default useStore
