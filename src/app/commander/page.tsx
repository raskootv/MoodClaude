'use client'

import { useState } from 'react'
import menuData from '../../../data/menu.json'
import { Category } from '@/lib/types'
import MenuCard from '@/components/MenuCard'

const categories = menuData.categories as Category[]

// Remove duplicate "BestSeller" from display since those items also appear in "Plats"
const displayCategories = categories.filter(c => c.name !== 'BestSeller')

export default function CommanderPage() {
  const [activeCategory, setActiveCategory] = useState(displayCategories[0]?.name || '')

  const currentCategory = displayCategories.find(c => c.name === activeCategory) || displayCategories[0]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-dark-800/50 border-b border-dark-700/50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Notre <span className="gold-text">Menu</span>
          </h1>
          <p className="text-dark-300">Choisissez vos plats et ajoutez-les au panier</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide -mx-4 px-4">
          {displayCategories.map(category => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                activeCategory === category.name
                  ? 'bg-gold-500 text-dark-900'
                  : 'bg-dark-700 text-dark-200 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Category title */}
        <h2 className="text-2xl font-heading font-bold text-white mb-6">
          {currentCategory?.name}
        </h2>

        {/* Dishes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentCategory?.dishes.map(dish => (
            <MenuCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  )
}
