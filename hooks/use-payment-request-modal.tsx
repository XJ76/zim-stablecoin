"use client"

import { create } from "zustand"

interface PaymentRequestModalStore {
  isOpen: boolean
  openPaymentRequestModal: () => void
  closePaymentRequestModal: () => void
}

export const usePaymentRequestModal = create<PaymentRequestModalStore>((set) => ({
  isOpen: false,
  openPaymentRequestModal: () => set({ isOpen: true }),
  closePaymentRequestModal: () => set({ isOpen: false }),
}))
