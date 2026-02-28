export interface MeatOption {
  name: string
  image: string
}

export interface Supplement {
  name: string
  price: number
}

export interface Dish {
  id: string
  name: string
  description: string
  price?: number
  basePrice?: number
  additionalMeatPrice?: number
  image?: string
  meatOptions?: MeatOption[]
  defaultIngredients?: string[]
  supplements?: Supplement[]
  spicyOptions?: string[]
  syrups?: string[]
  poppings?: string[]
  extraPoppingPrice?: number
}

export interface Category {
  name: string
  dishes: Dish[]
}

export interface MenuData {
  categories: Category[]
}

export interface CartItem {
  uniqueId: string
  dishId: string
  name: string
  unitPrice: number
  quantity: number
  image?: string
  selectedMeat?: string
  selectedSupplements?: { name: string; price: number }[]
  selectedSpicy?: string
  selectedSyrup?: string
  selectedPoppings?: string[]
  notes?: string
}

export type OrderType = 'delivery' | 'takeaway'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  orderType: OrderType
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress?: string
  deliveryNotes?: string
  pickupTime?: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}
