import { Customer, Measurement, Order, ShopSettings } from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'tailor_customers',
  MEASUREMENTS: 'tailor_measurements',
  ORDERS: 'tailor_orders',
  SETTINGS: 'tailor_settings',
  AUTH: 'tailor_auth'
};

export const storage = {
  // Customers
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  
  saveCustomers: (customers: Customer[]): void => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Measurements
  getMeasurements: (): Measurement[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveMeasurements: (measurements: Measurement[]): void => {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements));
  },

  // Orders
  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },
  
  saveOrders: (orders: Order[]): void => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Settings
  getSettings: (): ShopSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      name: 'Your Tailoring Shop',
      address: 'Shop Address',
      phone: '+1234567890',
      pin: '1234',
      priceList: {
        'Shirt': 500,
        'Pant': 400,
        'Blouse': 600,
        'Kurti': 800,
        'Lehenga': 2000,
        'Frock': 700,
        'Suit': 1200
      }
    };
  },
  
  saveSettings: (settings: ShopSettings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Authentication
  isAuthenticated: (): boolean => {
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!auth) return false;
    
    const { date } = JSON.parse(auth);
    const today = new Date().toDateString();
    return date === today;
  },
  
  setAuthenticated: (): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      date: new Date().toDateString()
    }));
  },

  clearAuth: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};

export const generateCustomerId = (): string => {
  const date = new Date();
  const dateStr = date.getFullYear().toString() + 
    (date.getMonth() + 1).toString().padStart(2, '0') + 
    date.getDate().toString().padStart(2, '0');
  
  const customers = storage.getCustomers();
  const todayCustomers = customers.filter(c => c.id.startsWith(dateStr));
  const nextNumber = (todayCustomers.length + 1).toString().padStart(3, '0');
  
  return `${dateStr}-${nextNumber}`;
};