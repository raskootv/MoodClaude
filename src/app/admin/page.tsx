'use client'

import { useState, useEffect, useCallback } from 'react'
import { Order, OrderStatus } from '@/lib/types'
import { formatPrice, getItemTotal } from '@/lib/utils'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  preparing: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  ready: 'bg-green-500/10 text-green-400 border-green-500/30',
  completed: 'bg-dark-600/50 text-dark-300 border-dark-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const NEXT_STATUS: Record<string, OrderStatus> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?password=moodthai2024`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchOrders()
      const interval = setInterval(fetchOrders, 15000) // Auto-refresh every 15s
      return () => clearInterval(interval)
    }
  }, [authenticated, fetchOrders])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'moodthai2024') {
      setAuthenticated(true)
    }
  }

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders?password=moodthai2024`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)
        )
      }
    } catch {
      // ignore
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-sm w-full px-4">
          <div className="card-dark p-8">
            <h1 className="text-2xl font-heading font-bold text-center mb-2">
              <span className="gold-text">Admin</span>
            </h1>
            <p className="text-dark-400 text-center text-sm mb-6">Dashboard Mood Thai</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field mb-4"
                placeholder="Mot de passe"
                autoFocus
              />
              <button type="submit" className="w-full btn-gold">
                Connexion
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))
  const historyOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status))
  const displayOrders = activeTab === 'active' ? activeOrders : historyOrders

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Admin header */}
      <div className="bg-dark-800 border-b border-dark-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold">
              Dashboard <span className="gold-text">Admin</span>
            </h1>
            <p className="text-dark-400 text-sm">
              {activeOrders.length} commande{activeOrders.length !== 1 ? 's' : ''} en cours
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 text-dark-300 hover:text-gold-400 transition-colors"
              title="Rafraîchir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="text-sm text-dark-400 hover:text-red-400 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-dark p-4">
            <p className="text-dark-400 text-sm">En attente</p>
            <p className="text-2xl font-bold text-yellow-400">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="card-dark p-4">
            <p className="text-dark-400 text-sm">En préparation</p>
            <p className="text-2xl font-bold text-orange-400">
              {orders.filter(o => o.status === 'preparing').length}
            </p>
          </div>
          <div className="card-dark p-4">
            <p className="text-dark-400 text-sm">Prêtes</p>
            <p className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.status === 'ready').length}
            </p>
          </div>
          <div className="card-dark p-4">
            <p className="text-dark-400 text-sm">Total aujourd&apos;hui</p>
            <p className="text-2xl font-bold gold-text">
              {formatPrice(orders.filter(o => {
                const today = new Date().toDateString()
                return new Date(o.createdAt).toDateString() === today
              }).reduce((sum, o) => sum + o.total, 0))}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-gold-500 text-dark-900'
                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
            }`}
          >
            En cours ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gold-500 text-dark-900'
                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
            }`}
          >
            Historique ({historyOrders.length})
          </button>
        </div>

        {/* Orders list */}
        {displayOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">
              {activeTab === 'active' ? 'Aucune commande en cours' : 'Aucun historique'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map(order => (
              <div key={order.id} className="card-dark overflow-hidden">
                {/* Order header */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-dark-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-gold-400 font-bold text-sm">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          order.orderType === 'delivery'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        }`}>
                          {order.orderType === 'delivery' ? 'Livraison' : 'Emporter'}
                        </span>
                      </div>
                      <p className="text-sm text-dark-300 mt-1">
                        {order.customerName} &middot; {order.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-white font-bold">{formatPrice(order.total)}</p>
                      <p className="text-dark-400 text-xs">{formatDate(order.createdAt)}</p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-dark-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {/* Expanded details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-dark-600/50 p-4 bg-dark-800/50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Articles</h4>
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.uniqueId} className="bg-dark-700/50 rounded-lg p-3">
                              <div className="flex justify-between">
                                <span className="text-white font-medium text-sm">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-gold-400 font-semibold text-sm">
                                  {formatPrice(getItemTotal(item))}
                                </span>
                              </div>
                              <div className="text-xs text-dark-400 mt-1 space-y-0.5">
                                {item.selectedMeat && <p>Viande : {item.selectedMeat}</p>}
                                {item.selectedSpicy && <p>Piquant : {item.selectedSpicy}</p>}
                                {item.selectedSyrup && <p>Sirop : {item.selectedSyrup}</p>}
                                {item.selectedPoppings && item.selectedPoppings.length > 0 && (
                                  <p>Poppings : {item.selectedPoppings.join(', ')}</p>
                                )}
                                {item.selectedSupplements && item.selectedSupplements.length > 0 && (
                                  <p>Suppl. : {item.selectedSupplements.map(s => `${s.name} (+${formatPrice(s.price)})`).join(', ')}</p>
                                )}
                                {item.notes && <p className="italic text-dark-300">Note : {item.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer info */}
                      <div>
                        <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Client</h4>
                        <div className="bg-dark-700/50 rounded-lg p-3 space-y-2 text-sm">
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-dark-300">{order.customerPhone}</p>
                          {order.customerEmail && <p className="text-dark-300">{order.customerEmail}</p>}
                          {order.deliveryAddress && (
                            <div className="pt-2 border-t border-dark-600/50">
                              <p className="text-dark-400 text-xs mb-1">Adresse de livraison</p>
                              <p className="text-white">{order.deliveryAddress}</p>
                              {order.deliveryNotes && <p className="text-dark-400 italic">{order.deliveryNotes}</p>}
                            </div>
                          )}
                          {order.pickupTime && (
                            <div className="pt-2 border-t border-dark-600/50">
                              <p className="text-dark-400 text-xs mb-1">Retrait</p>
                              <p className="text-white">{order.pickupTime}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {NEXT_STATUS[order.status] && (
                            <button
                              onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                              className="btn-gold text-sm px-4 py-2"
                            >
                              {STATUS_LABELS[NEXT_STATUS[order.status]]}
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="text-sm px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile price/date */}
                    <div className="sm:hidden mt-4 pt-4 border-t border-dark-600/50 flex justify-between text-sm">
                      <span className="text-dark-400">{formatDate(order.createdAt)}</span>
                      <span className="text-gold-400 font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
