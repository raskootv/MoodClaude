'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from './CartProvider'
import { formatPrice } from '@/lib/utils'

export default function Header() {
  const { totalItems, totalPrice } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 relative">
              <Image
                src="/assets/images/fond/logo.png"
                alt="Mood Thai"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="text-xl md:text-2xl font-heading font-bold gold-text">
              Mood Thai
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-dark-200 hover:text-gold-400 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/commander" className="text-dark-200 hover:text-gold-400 transition-colors font-medium">
              Commander
            </Link>
            <Link href="/panier" className="relative flex items-center gap-2 btn-gold text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Panier
              {totalItems > 0 && (
                <span className="bg-dark-900 text-gold-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              {totalItems > 0 && (
                <span className="text-xs font-bold ml-1">
                  {formatPrice(totalPrice)}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile nav button + cart */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/panier" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-dark-200"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-dark-700/50 py-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-dark-200 hover:text-gold-400 transition-colors font-medium py-2"
              >
                Accueil
              </Link>
              <Link
                href="/commander"
                onClick={() => setMenuOpen(false)}
                className="text-dark-200 hover:text-gold-400 transition-colors font-medium py-2"
              >
                Commander
              </Link>
              <Link
                href="/panier"
                onClick={() => setMenuOpen(false)}
                className="text-dark-200 hover:text-gold-400 transition-colors font-medium py-2"
              >
                Panier {totalItems > 0 && `(${totalItems} - ${formatPrice(totalPrice)})`}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
