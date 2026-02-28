'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartProvider'
import { formatPrice, getItemTotal } from '@/lib/utils'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-700 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-dark-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">Votre panier est vide</h1>
          <p className="text-dark-300 mb-6">Ajoutez des plats pour commencer votre commande</p>
          <Link href="/commander" className="btn-gold">
            Voir le menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-dark-800/50 border-b border-dark-700/50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Mon <span className="gold-text">Panier</span>
          </h1>
          <p className="text-dark-300">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.uniqueId} className="card-dark p-4 flex gap-4">
              {item.image && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <div className="text-sm text-dark-300 mt-1 space-y-0.5">
                      {item.selectedMeat && <p>Viande : {item.selectedMeat}</p>}
                      {item.selectedSpicy && <p>Piquant : {item.selectedSpicy}</p>}
                      {item.selectedSyrup && <p>Sirop : {item.selectedSyrup}</p>}
                      {item.selectedPoppings && item.selectedPoppings.length > 0 && (
                        <p>Poppings : {item.selectedPoppings.join(', ')}</p>
                      )}
                      {item.selectedSupplements && item.selectedSupplements.length > 0 && (
                        <p>Suppl. : {item.selectedSupplements.map(s => s.name).join(', ')}</p>
                      )}
                      {item.notes && <p className="italic">Note : {item.notes}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.uniqueId)}
                    className="text-dark-400 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    aria-label="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-dark-600 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                      className="px-3 py-1.5 text-dark-300 hover:text-white transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 font-semibold text-white text-sm min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                      className="px-3 py-1.5 text-dark-300 hover:text-white transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gold-400 font-bold">{formatPrice(getItemTotal(item))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-300">Sous-total</span>
            <span className="text-white font-semibold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="border-t border-dark-600/50 pt-4 flex items-center justify-between mb-6">
            <span className="text-lg font-heading font-bold text-white">Total</span>
            <span className="text-xl font-bold gold-text">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/commander" className="btn-outline-gold text-center flex-1">
              Continuer les achats
            </Link>
            <Link href="/checkout" className="btn-gold text-center flex-1">
              Valider la commande
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
