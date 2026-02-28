'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dish, CartItem } from '@/lib/types'
import { formatPrice, generateUniqueId } from '@/lib/utils'
import { useCart } from './CartProvider'

interface DishModalProps {
  dish: Dish
  onClose: () => void
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  const { addItem } = useCart()
  const [selectedMeat, setSelectedMeat] = useState(dish.meatOptions?.[0]?.name || '')
  const [selectedSupplements, setSelectedSupplements] = useState<{ name: string; price: number }[]>([])
  const [selectedSpicy, setSelectedSpicy] = useState(dish.spicyOptions?.[0] || '')
  const [selectedSyrup, setSelectedSyrup] = useState(dish.syrups?.[0] || '')
  const [selectedPoppings, setSelectedPoppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

  const basePrice = dish.price || dish.basePrice || 0
  const supplementsTotal = selectedSupplements.reduce((sum, s) => sum + s.price, 0)
  const extraPoppings = selectedPoppings.length > 1 ? (selectedPoppings.length - 1) * (dish.extraPoppingPrice || 0) : 0
  const unitPrice = basePrice + extraPoppings
  const totalPrice = (unitPrice + supplementsTotal) * quantity

  const toggleSupplement = (supp: { name: string; price: number }) => {
    setSelectedSupplements(prev => {
      const exists = prev.find(s => s.name === supp.name)
      if (exists) return prev.filter(s => s.name !== supp.name)
      return [...prev, supp]
    })
  }

  const togglePopping = (popping: string) => {
    setSelectedPoppings(prev => {
      if (prev.includes(popping)) return prev.filter(p => p !== popping)
      return [...prev, popping]
    })
  }

  const handleAdd = () => {
    const item: CartItem = {
      uniqueId: generateUniqueId(),
      dishId: dish.id,
      name: dish.name,
      unitPrice,
      quantity,
      image: dish.image,
      ...(selectedMeat && { selectedMeat }),
      ...(selectedSupplements.length > 0 && { selectedSupplements }),
      ...(selectedSpicy && { selectedSpicy }),
      ...(selectedSyrup && { selectedSyrup }),
      ...(selectedPoppings.length > 0 && { selectedPoppings }),
      ...(notes && { notes }),
    }
    addItem(item)
    setAdded(true)
    setTimeout(() => onClose(), 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-dark-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-dark-600/50 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-dark-900/80 rounded-full p-2 text-dark-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {dish.image && (
          <div className="relative w-full h-48 sm:h-56">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-2xl font-heading font-bold text-white mb-1">{dish.name}</h2>
          <p className="text-dark-300 mb-4">{dish.description}</p>
          <p className="text-gold-400 font-bold text-xl mb-6">{formatPrice(basePrice)}</p>

          {/* Meat options */}
          {dish.meatOptions && dish.meatOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Choix de la viande</h3>
              <div className="grid grid-cols-2 gap-2">
                {dish.meatOptions.map(meat => (
                  <button
                    key={meat.name}
                    onClick={() => setSelectedMeat(meat.name)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-sm ${
                      selectedMeat === meat.name
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-dark-600 text-dark-200 hover:border-dark-400'
                    }`}
                  >
                    <div className="w-8 h-8 relative rounded-full overflow-hidden flex-shrink-0">
                      <Image src={meat.image} alt={meat.name} fill className="object-cover" sizes="32px" />
                    </div>
                    {meat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spicy options */}
          {dish.spicyOptions && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Niveau de piquant</h3>
              <div className="flex gap-2">
                {dish.spicyOptions.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedSpicy(level)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      selectedSpicy === level
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-dark-600 text-dark-200 hover:border-dark-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bubble tea: syrups */}
          {dish.syrups && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Choix du sirop</h3>
              <div className="grid grid-cols-2 gap-2">
                {dish.syrups.map(syrup => (
                  <button
                    key={syrup}
                    onClick={() => setSelectedSyrup(syrup)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      selectedSyrup === syrup
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-dark-600 text-dark-200 hover:border-dark-400'
                    }`}
                  >
                    {syrup}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bubble tea: poppings */}
          {dish.poppings && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">
                Poppings <span className="text-dark-400 normal-case">(1er inclus, +{formatPrice(dish.extraPoppingPrice || 0)} par suppl.)</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {dish.poppings.map(popping => (
                  <button
                    key={popping}
                    onClick={() => togglePopping(popping)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      selectedPoppings.includes(popping)
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-dark-600 text-dark-200 hover:border-dark-400'
                    }`}
                  >
                    {popping}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supplements */}
          {dish.supplements && dish.supplements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Suppléments</h3>
              <div className="grid grid-cols-1 gap-2">
                {dish.supplements.map(supp => (
                  <button
                    key={supp.name}
                    onClick={() => toggleSupplement(supp)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-sm ${
                      selectedSupplements.find(s => s.name === supp.name)
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                        : 'border-dark-600 text-dark-200 hover:border-dark-400'
                    }`}
                  >
                    <span>{supp.name}</span>
                    <span className="text-gold-400 font-semibold">+{formatPrice(supp.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Instructions spéciales</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Allergies, préférences..."
              className="input-field resize-none h-20 text-sm"
            />
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-dark-600 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-dark-300 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 font-semibold text-white min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-dark-300 hover:text-white transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'btn-gold'
              }`}
            >
              {added ? 'Ajouté !' : `Ajouter - ${formatPrice(totalPrice)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
