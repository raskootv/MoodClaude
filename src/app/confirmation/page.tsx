'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Order } from '@/lib/types'
import { formatPrice, getItemTotal } from '@/lib/utils'

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('mood-thai-last-order')
    if (saved) {
      try {
        setOrder(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [])

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Aucune commande trouvée</h1>
          <p className="text-dark-300 mb-6">Commencez par passer une commande</p>
          <Link href="/commander" className="btn-gold">Commander</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="text-center mb-10 animate-fade-in">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Commande <span className="gold-text">confirmée</span> !
          </h1>
          <p className="text-dark-300 text-lg">Merci pour votre commande</p>
        </div>

        {/* Order details */}
        <div className="card-dark p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-600/50">
            <div>
              <p className="text-dark-400 text-sm">Numéro de commande</p>
              <p className="text-gold-400 font-bold text-lg font-mono">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-dark-400 text-sm">Type</p>
              <p className="text-white font-semibold">
                {order.orderType === 'delivery' ? 'Livraison' : 'À emporter'}
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Informations</h3>
            <div className="space-y-1 text-sm">
              <p className="text-white">{order.customerName}</p>
              <p className="text-dark-300">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-dark-300">{order.customerEmail}</p>}
              {order.deliveryAddress && (
                <p className="text-dark-300">{order.deliveryAddress}</p>
              )}
              {order.deliveryNotes && (
                <p className="text-dark-400 italic">{order.deliveryNotes}</p>
              )}
              {order.pickupTime && (
                <p className="text-dark-300">Retrait : {order.pickupTime}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Articles</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.uniqueId} className="flex justify-between text-sm py-1">
                  <span className="text-dark-200">
                    {item.quantity}x {item.name}
                    {item.selectedMeat && ` (${item.selectedMeat})`}
                    {item.selectedSupplements && item.selectedSupplements.length > 0 && (
                      <span className="text-dark-400"> + {item.selectedSupplements.map(s => s.name).join(', ')}</span>
                    )}
                  </span>
                  <span className="text-white font-medium flex-shrink-0 ml-4">
                    {formatPrice(getItemTotal(item))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-dark-600/50 pt-4 flex justify-between items-center">
            <span className="font-heading font-bold text-white text-lg">Total</span>
            <span className="text-2xl font-bold gold-text">{formatPrice(order.total)}</span>
          </div>

          <div className="mt-4 bg-dark-700/50 rounded-lg p-3">
            <p className="text-dark-300 text-sm text-center">
              Paiement à la {order.orderType === 'delivery' ? 'livraison' : 'réception'} par CB ou espèces
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-outline-gold text-center flex-1">
            Retour à l&apos;accueil
          </Link>
          <Link href="/commander" className="btn-gold text-center flex-1">
            Commander à nouveau
          </Link>
        </div>
      </div>
    </div>
  )
}
