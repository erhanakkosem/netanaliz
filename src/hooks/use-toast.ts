'use client'

import { useState, useEffect } from 'react'

export type ToastOptions = {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive' | 'warning'
}

export type ToastItem = ToastOptions & { id: string }

let toastItems: ToastItem[] = []
let toastListeners: Array<(items: ToastItem[]) => void> = []
let toastCounter = 0

export function toast(options: ToastOptions) {
  const id = String(++toastCounter)
  const item: ToastItem = { ...options, id }
  toastItems = [...toastItems, item]
  toastListeners.forEach(l => l(toastItems))
  setTimeout(() => {
    toastItems = toastItems.filter(t => t.id !== id)
    toastListeners.forEach(l => l(toastItems))
  }, 5000)
  return id
}

export function dismissToast(id: string) {
  toastItems = toastItems.filter(t => t.id !== id)
  toastListeners.forEach(l => l(toastItems))
}

export function subscribeToasts(listener: (items: ToastItem[]) => void) {
  toastListeners.push(listener)
  listener(toastItems)
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener)
  }
}

export function useToasts() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsub = subscribeToasts(setItems)
    return unsub
  }, [])

  return { toasts: items, dismissToast }
}
