import Link from 'next/link'
import Image from 'next/image'
import menuData from '../../data/menu.json'
import { MenuData } from '@/lib/types'

const featuredIds = ['boeuf-loc-lac', 'pad-thai', 'mood-qui-pleure-riz-thai', 'chicken-bowl']

export default function HomePage() {
  const data = menuData as MenuData
  const bestSeller = data.categories.find(c => c.name === 'BestSeller')
  const featured = bestSeller?.dishes.filter(d => featuredIds.includes(d.id)).slice(0, 4) || []

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/fond/fonds.png"
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/40 to-dark-900" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="w-24 h-24 md:w-32 md:h-32 relative mx-auto mb-6">
            <Image
              src="/assets/images/fond/logo.png"
              alt="Mood Thai Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="128px"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4">
            <span className="gold-text">Mood Thai</span>
          </h1>
          <p className="text-lg md:text-xl text-dark-200 mb-3 max-w-2xl mx-auto">
            Saveurs authentiques de la cuisine thaïlandaise
          </p>
          <p className="text-dark-300 mb-8 text-sm md:text-base">
            Livraison & À emporter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/commander" className="btn-gold text-lg px-8 py-4">
              Commander maintenant
            </Link>
            <Link href="/commander" className="btn-outline-gold text-lg px-8 py-4">
              Voir le menu
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">Commande rapide</h3>
              <p className="text-dark-300 text-sm">Choisissez vos plats, validez et c&apos;est prêt !</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">Livraison & Emporter</h3>
              <p className="text-dark-300 text-sm">On vous livre ou vous venez chercher, à vous de choisir</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-500/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10h18M3 14h18M12 3v18" />
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">Paiement à réception</h3>
              <p className="text-dark-300 text-sm">Payez à la livraison ou au comptoir par CB ou espèces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-heading">
            Nos <span className="gold-text">Best Sellers</span>
          </h2>
          <p className="text-dark-300 text-center mb-12 max-w-xl mx-auto">
            Les plats préférés de nos clients
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(dish => (
              <Link
                key={dish.id}
                href="/commander"
                className="card-dark group"
              >
                {dish.image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800/80 to-transparent" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-white group-hover:text-gold-400 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-gold-400 font-bold mt-2">
                    {dish.price ? `${dish.price.toFixed(2).replace('.', ',')} €` : `À partir de ${(dish.basePrice || 0).toFixed(2).replace('.', ',')} €`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/commander" className="btn-gold text-lg px-8 py-4">
              Voir tout le menu
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-dark-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-4">
            Envie de <span className="gold-text">Thai</span> ?
          </h2>
          <p className="text-dark-300 mb-8 text-lg">
            Commandez en quelques clics, on s&apos;occupe du reste.
          </p>
          <Link href="/commander" className="btn-gold text-lg px-10 py-4">
            Commander maintenant
          </Link>
        </div>
      </section>
    </>
  )
}
