export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  gender: 'Gents' | 'Ladies' | 'Kids';
  age: number;
  createdAt: string;
}

export interface Measurement {
  customerId: string;
  // Gents measurements
  chest?: number;
  waist?: number;
  hip?: number;
  shoulderWidth?: number;
  sleeveLength?: number;
  shirtLength?: number;
  pantWaist?: number;
  pantLength?: number;
  // Ladies measurements
  bust?: number;
  blouseLength?: number;
  topLength?: number;
  handLength?: number;
  handLoose?: number;
  highChest?: number;
  middleChest?: number;
  waistLoose?: number;
  hipLoose?: number;
  frontNeckDeep?: number;
  backNeckDeep?: number;
  frontLength?: number;
  lehengaLength?: number;
  lehengaLoose?: number;
  kurtiLength?: number;
  pantLoose?: number;
  // Kids measurements
  height?: number;
  dressLength?: number;
  // Common
  extraNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  extraCharges: number;
  materialCharges: number;
  discount: number;
  total: number;
  paymentStatus: 'Paid' | 'Pending';
  deliveryDate: string;
  createdAt: string;
}

export interface OrderItem {
  clothingType: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  logo?: string;
  priceList: Record<string, number>;
  pin: string;
}

export interface AppState {
  isAuthenticated: boolean;
  currentScreen: string;
  selectedCustomer: Customer | null;
  customers: Customer[];
  measurements: Measurement[];
  orders: Order[];
  settings: ShopSettings;
}