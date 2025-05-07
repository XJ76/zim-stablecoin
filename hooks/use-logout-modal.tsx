"use client"

import { create } from "zustand"

interface LogoutModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useLogoutModal = create<LogoutModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
