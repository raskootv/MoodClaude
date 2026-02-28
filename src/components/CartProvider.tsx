'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { CartItem } from '@/lib/types'
import { getItemTotal } from '@/lib/utils'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (uniqueId: string) => void
  updateQuantity: (uniqueId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mood-thai-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        // ignore invalid data
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mood-thai-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => [...prev, item])
  }, [])

  const removeItem = useCallback((uniqueId: string) => {
    setItems(prev => prev.filter(item => item.uniqueId !== uniqueId))
  }, [])

  const updateQuantity = useCallback((uniqueId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.uniqueId !== uniqueId))
    } else {
      setItems(prev =>
        prev.map(item =>
          item.uniqueId === uniqueId ? { ...item, quantity } : item
        )
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + getItemTotal(item), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
