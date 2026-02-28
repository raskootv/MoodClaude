import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/images/fond/logo.png"
                  alt="Mood Thai"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="text-xl font-heading font-bold gold-text">
                Mood Thai
              </span>
            </div>
            <p className="text-dark-300 text-sm leading-relaxed">
              Saveurs authentiques de la cuisine thaïlandaise.
              Commandez en ligne pour la livraison ou à emporter.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-dark-300 hover:text-gold-400 transition-colors text-sm">
                Accueil
              </Link>
              <Link href="/commander" className="text-dark-300 hover:text-gold-400 transition-colors text-sm">
                Commander
              </Link>
              <Link href="/panier" className="text-dark-300 hover:text-gold-400 transition-colors text-sm">
                Mon Panier
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-dark-300 text-sm">
              <p>Livraison & À emporter</p>
              <p>Paiement sur place / à la livraison</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700/50 mt-8 pt-8 text-center text-dark-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Mood Thai. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
