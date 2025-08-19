import React from 'react';
import { 
  UserPlus, 
  Search, 
  ClipboardList, 
  Receipt, 
  Settings, 
  Scissors,
  Users,
  TrendingUp
} from 'lucide-react';
import { storage } from '../utils/storage';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onLogout }) => {
  const settings = storage.getSettings();
  const customers = storage.getCustomers();
  const orders = storage.getOrders();
  
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  });

  const pendingOrders = orders.filter(order => order.paymentStatus === 'Pending');

  const menuItems = [
    {
      title: 'New Customer',
      icon: UserPlus,
      color: 'bg-green-500 hover:bg-green-600',
      screen: 'add-customer',
      description: 'Add new customer'
    },
    {
      title: 'Search Customer',
      icon: Search,
      color: 'bg-blue-500 hover:bg-blue-600',
      screen: 'search-customer',
      description: 'Find existing customer'
    },
    {
      title: 'Order History',
      icon: ClipboardList,
      color: 'bg-purple-500 hover:bg-purple-600',
      screen: 'order-history',
      description: 'View all orders'
    },
    {
      title: 'Billing',
      icon: Receipt,
      color: 'bg-orange-500 hover:bg-orange-600',
      screen: 'billing',
      description: 'Create new bill'
    },
    {
      title: 'Settings',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      screen: 'settings',
      description: 'Shop & price settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{settings.name}</h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.screen)}
              className={`${item.color} text-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left group`}
            >
              <div className="flex items-center justify-between mb-4">
                <item.icon className="w-8 h-8" />
                <div className="w-2 h-2 bg-white bg-opacity-30 rounded-full group-hover:bg-opacity-50 transition-all"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white text-opacity-90 text-sm">{item.description}</p>
            </button>
          ))}
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Today's Date: <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span></p>
              <p className="text-gray-600">Total Orders: <span className="font-medium text-gray-900">{orders.length}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Revenue This Month: <span className="font-medium text-gray-900">₹{orders.reduce((sum, order) => sum + order.total, 0)}</span></p>
              <p className="text-gray-600">Shop: <span className="font-medium text-gray-900">{settings.name}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};