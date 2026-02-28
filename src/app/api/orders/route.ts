import { NextRequest, NextResponse } from 'next/server'
import { Order, OrderStatus } from '@/lib/types'

// In-memory store for orders (persists as long as the serverless function is warm)
// For production, replace with a real database (PostgreSQL, MongoDB, etc.)
const orders: Order[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')

  if (password !== 'moodthai2024') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Return orders sorted by most recent first
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json(sorted)
}

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json()

    if (!order.id || !order.customerName || !order.customerPhone || !order.items?.length) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    orders.push(order)
    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')

    if (password !== 'moodthai2024') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { orderId, status } = await request.json() as { orderId: string; status: OrderStatus }

    const order = orders.find(o => o.id === orderId)
    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    order.status = status
    order.updatedAt = new Date().toISOString()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
