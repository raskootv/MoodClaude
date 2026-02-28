'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { formatPrice, generateOrderId, getItemTotal } from '@/lib/utils'
import { OrderType, Order } from '@/lib/types'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [orderType, setOrderType] = useState<OrderType>('takeaway')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Panier vide</h1>
          <p className="text-dark-300 mb-6">Ajoutez des plats avant de passer commande</p>
          <Link href="/commander" className="btn-gold">Voir le menu</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Veuillez indiquer votre adresse de livraison.')
      return
    }

    setIsSubmitting(true)

    const order: Order = {
      id: generateOrderId(),
      items,
      total: totalPrice,
      orderType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryNotes: deliveryNotes.trim() || undefined,
      pickupTime: orderType === 'takeaway' ? pickupTime.trim() || undefined : undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      if (!res.ok) throw new Error('Erreur serveur')

      clearCart()
      localStorage.setItem('mood-thai-last-order', JSON.stringify(order))
      router.push('/confirmation')
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="bg-dark-800/50 border-b border-dark-700/50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            <span className="gold-text">Finaliser</span> la commande
          </h1>
          <p className="text-dark-300">Remplissez vos informations pour passer commande</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order type */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Type de commande</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  orderType === 'takeaway'
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-dark-600 hover:border-dark-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mx-auto mb-2 ${orderType === 'takeaway' ? 'text-gold-400' : 'text-dark-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className={`font-semibold ${orderType === 'takeaway' ? 'text-gold-400' : 'text-dark-200'}`}>
                  À emporter
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  orderType === 'delivery'
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-dark-600 hover:border-dark-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mx-auto mb-2 ${orderType === 'delivery' ? 'text-gold-400' : 'text-dark-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`font-semibold ${orderType === 'delivery' ? 'text-gold-400' : 'text-dark-200'}`}>
                  Livraison
                </span>
              </button>
            </div>
          </div>

          {/* Customer info */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Vos informations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Nom complet *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="input-field"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Téléphone *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="input-field"
                  placeholder="06 XX XX XX XX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Email <span className="text-dark-500">(optionnel)</span></label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="input-field"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
          </div>

          {/* Delivery address */}
          {orderType === 'delivery' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-heading font-semibold text-white mb-4">Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-300 mb-1.5">Adresse complète *</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="input-field"
                    placeholder="Numéro, rue, ville, code postal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-300 mb-1.5">Instructions <span className="text-dark-500">(optionnel)</span></label>
                  <textarea
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    className="input-field resize-none h-20"
                    placeholder="Digicode, étage, bâtiment..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pickup time */}
          {orderType === 'takeaway' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-heading font-semibold text-white mb-4">Retrait</h2>
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">
                  Heure de retrait souhaitée <span className="text-dark-500">(optionnel)</span>
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-heading font-semibold text-white mb-4">Récapitulatif</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.uniqueId} className="flex justify-between text-sm">
                  <span className="text-dark-300">
                    {item.quantity}x {item.name}
                    {item.selectedMeat && ` (${item.selectedMeat})`}
                  </span>
                  <span className="text-white font-medium">{formatPrice(getItemTotal(item))}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-600/50 pt-3 flex justify-between">
              <span className="font-heading font-bold text-white">Total</span>
              <span className="font-bold text-xl gold-text">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-dark-400 text-xs mt-3">
              Paiement à la {orderType === 'delivery' ? 'livraison' : 'réception'} (CB ou espèces)
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande'}
          </button>
        </form>
      </div>
    </div>
  )
}
