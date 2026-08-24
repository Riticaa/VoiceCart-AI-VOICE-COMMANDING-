export type ProductCategory = 
  | 'Produce' 
  | 'Dairy' 
  | 'Pantry & Staples' 
  | 'Snacks' 
  | 'Beverages' 
  | 'Personal Care';

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  brand: string;
  category: ProductCategory;
  price: number; // in Indian Rupees (₹)
  unit: string;
  image: string;
  rating: number;
  reviewCount: number;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  seasonalTag?: string;
  inStock: boolean;
  frequentlyBoughtDays?: number;
  lastBoughtTime?: string;
  description?: string;
  substituteId?: string;
  substituteReason?: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  checked: boolean;
  image?: string;
  brand?: string;
}

export interface VoiceCommandHistory {
  id: string;
  commandText: string;
  actionTaken: string;
  timestamp: string;
  timeAgo: string;
  language?: string;
}

export interface SubstituteSuggestion {
  originalItem: string;
  suggestedProduct: Product;
  matchPercentage: number;
  reason: string;
}

export interface NLPCommandResult {
  action: 'ADD_ITEM' | 'REMOVE_ITEM' | 'SEARCH' | 'SHOW_LIST' | 'SHOW_SUGGESTIONS' | 'CHECKOUT' | 'APPLY_PROMO' | 'CLEAR_LIST' | 'SWAP_ITEM' | 'UNKNOWN';
  items?: Array<{
    name: string;
    category?: ProductCategory;
    quantity?: number;
    unit?: string;
    brand?: string;
    isOrganic?: boolean;
  }>;
  searchQuery?: string;
  filters?: {
    maxPrice?: number;
    isOrganic?: boolean;
    brand?: string;
    category?: string;
  };
  spokenFeedback: string;
  detectedLanguage?: 'en' | 'hi' | 'hinglish' | 'ta' | 'te';
  confidence?: number;
}

export interface OrderDetails {
  orderId: string;
  items: ShoppingListItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  address: {
    name: string;
    street: string;
    city: string;
    pincode: string;
    phone: string;
  };
  deliveryType: 'Delivery' | 'Pickup';
  paymentMethod: 'card' | 'upi' | 'cod';
  placedAt: string;
}
