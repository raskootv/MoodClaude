'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dish } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import DishModal from './DishModal'

interface MenuCardProps {
  dish: Dish
}

export default function MenuCard({ dish }: MenuCardProps) {
  const [showModal, setShowModal] = useState(false)
  const price = dish.price || dish.basePrice || 0

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="card-dark text-left group w-full"
      >
        {dish.image && (
          <div className="relative w-full h-40 sm:h-48 overflow-hidden">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/80 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-white group-hover:text-gold-400 transition-colors mb-1">
            {dish.name}
          </h3>
          <p className="text-dark-300 text-sm mb-3 line-clamp-2">{dish.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-gold-400 font-bold text-lg">
              {dish.basePrice ? `À partir de ${formatPrice(price)}` : formatPrice(price)}
            </span>
            <span className="bg-gold-500/10 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-dark-900 transition-all">
              Ajouter
            </span>
          </div>
        </div>
      </button>

      {showModal && (
        <DishModal dish={dish} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
