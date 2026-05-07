export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
  options?: string;
  rating?: number;
  reviews?: string;
  boughtCount?: string;
  delivery?: string;
  specifications?: Record<string, string>;
  features?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: { product: Product; quantity: number }[];
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: any;
  updatedAt?: any;
}
