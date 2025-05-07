"use client"

import { create } from "zustand"

interface PaymentRequestModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const usePaymentRequestModal = create<PaymentRequestModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
