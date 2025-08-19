import React, { useState } from 'react';
import { ArrowLeft, Search, Eye, FileText, Filter, Calendar } from 'lucide-react';
import { Order } from '../types';
import { storage } from '../utils/storage';
import { generateBillPDF } from '../utils/pdf';

interface OrderHistoryScreenProps {
  onNavigate: (screen: string) => void;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [dateFilter, setDateFilter] = useState('');

  const orders = storage.getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const customers = storage.getCustomers();
  const settings = storage.getSettings();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.paymentStatus === statusFilter;
    const matchesDate = !dateFilter || new Date(order.createdAt).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getCustomerById = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const generatePDF = (order: Order) => {
    const customer = getCustomerById(order.customerId);
    if (customer) {
      generateBillPDF(order, customer, settings);
    }
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = filteredOrders.filter(order => order.paymentStatus === 'Paid');
  const pendingAmount = filteredOrders
    .filter(order => order.paymentStatus === 'Pending')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Order History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{filteredOrders.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Paid Orders</div>
            <div className="text-2xl font-bold text-blue-600">{paidOrders.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Pending Amount</div>
            <div className="text-2xl font-bold text-orange-600">₹{pendingAmount}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">All Orders</h2>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search orders..."
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
                
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              ) : (
                filteredOrders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.total}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.paymentStatus === 'Paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {order.items.map(item => `${item.quantity}x ${item.clothingType}`).join(', ')}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Order: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {selectedOrder ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedOrder.id}</h2>
                    <p className="text-gray-600">{selectedOrder.customerName}</p>
                  </div>
                  <button
                    onClick={() => generatePDF(selectedOrder)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate PDF</span>
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-medium">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                      selectedOrder.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-medium font-mono text-sm">{selectedOrder.customerId}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.clothingType}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-bold">₹{item.total}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Charges & Total */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.extraCharges > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Extra Charges:</span>
                        <span>₹{selectedOrder.extraCharges}</span>
                      </div>
                    )}
                    {selectedOrder.materialCharges > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Material Charges:</span>
                        <span>₹{selectedOrder.materialCharges}</span>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Discount:</span>
                        <span>-₹{selectedOrder.discount}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};