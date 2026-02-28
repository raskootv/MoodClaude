export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €'
}

export function generateOrderId(): string {
  const now = new Date()
  const date = now.toISOString().slice(2, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MT-${date}-${random}`
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function getItemTotal(item: { unitPrice: number; quantity: number; selectedSupplements?: { price: number }[] }): number {
  const supplementsTotal = item.selectedSupplements?.reduce((sum, s) => sum + s.price, 0) || 0
  return (item.unitPrice + supplementsTotal) * item.quantity
}
