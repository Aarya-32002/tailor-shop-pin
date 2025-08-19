import React, { useState } from 'react';
import { ArrowLeft, Search, Eye, Edit, User, Phone, MapPin, Calendar } from 'lucide-react';
import { Customer } from '../types';
import { storage } from '../utils/storage';

interface SearchCustomerScreenProps {
  onNavigate: (screen: string, customer?: Customer) => void;
}

export const SearchCustomerScreen: React.FC<SearchCustomerScreenProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers = storage.getCustomers();
  const measurements = storage.getMeasurements();
  const orders = storage.getOrders();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.id.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getCustomerMeasurement = (customerId: string) => {
    return measurements.find(m => m.customerId === customerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Search Customer</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name, phone, ID, or address..."
              />
            </div>

            <div className="space-y-2">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No customers found' : 'Start typing to search customers'}
                </div>
              ) : (
                filteredCustomers.map(customer => {
                  const customerOrders = getCustomerOrders(customer.id);
                  const customerMeasurement = getCustomerMeasurement(customer.id);
                  
                  return (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{customer.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          customer.gender === 'Gents' ? 'bg-blue-100 text-blue-700' :
                          customer.gender === 'Ladies' ? 'bg-pink-100 text-pink-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {customer.gender}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
                      <p className="text-xs text-gray-500 mb-2">{customer.id}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{customerOrders.length} orders</span>
                        <span>{customerMeasurement ? 'Has measurements' : 'No measurements'}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Customer Details Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {selectedCustomer ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedCustomer.name}</h2>
                    <p className="text-gray-600">{selectedCustomer.id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onNavigate('measurement', selectedCustomer)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Measurements</span>
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Age & Gender</p>
                      <p className="font-medium">{selectedCustomer.age} years, {selectedCustomer.gender}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Measurements</h3>
                  {(() => {
                    const customerMeasurement = getCustomerMeasurement(selectedCustomer.id);
                    if (!customerMeasurement) {
                      return (
                        <div className="text-center py-4 text-gray-500">
                          <p>No measurements recorded</p>
                          <button
                            onClick={() => onNavigate('measurement', selectedCustomer)}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Add measurements
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          {selectedCustomer.gender === 'Gents' && (
                            <>
                              {customerMeasurement.chest && <div><span className="text-gray-600">Chest:</span> <span className="font-medium">{customerMeasurement.chest}"</span></div>}
                              {customerMeasurement.waist && <div><span className="text-gray-600">Waist:</span> <span className="font-medium">{customerMeasurement.waist}"</span></div>}
                              {customerMeasurement.hip && <div><span className="text-gray-600">Hip:</span> <span className="font-medium">{customerMeasurement.hip}"</span></div>}
                              {customerMeasurement.shoulderWidth && <div><span className="text-gray-600">Shoulder:</span> <span className="font-medium">{customerMeasurement.shoulderWidth}"</span></div>}
                              {customerMeasurement.sleeveLength && <div><span className="text-gray-600">Sleeve:</span> <span className="font-medium">{customerMeasurement.sleeveLength}"</span></div>}
                              {customerMeasurement.shirtLength && <div><span className="text-gray-600">Shirt Length:</span> <span className="font-medium">{customerMeasurement.shirtLength}"</span></div>}
                            </>
                          )}
                          {selectedCustomer.gender === 'Ladies' && (
                            <>
                              {customerMeasurement.bust && <div><span className="text-gray-600">Bust:</span> <span className="font-medium">{customerMeasurement.bust}"</span></div>}
                              {customerMeasurement.waist && <div><span className="text-gray-600">Waist:</span> <span className="font-medium">{customerMeasurement.waist}"</span></div>}
                              {customerMeasurement.hip && <div><span className="text-gray-600">Hip:</span> <span className="font-medium">{customerMeasurement.hip}"</span></div>}
                              {customerMeasurement.blouseLength && <div><span className="text-gray-600">Blouse:</span> <span className="font-medium">{customerMeasurement.blouseLength}"</span></div>}
                              {customerMeasurement.kurtiLength && <div><span className="text-gray-600">Kurti:</span> <span className="font-medium">{customerMeasurement.kurtiLength}"</span></div>}
                            </>
                          )}
                          {selectedCustomer.gender === 'Kids' && (
                            <>
                              {customerMeasurement.height && <div><span className="text-gray-600">Height:</span> <span className="font-medium">{customerMeasurement.height}"</span></div>}
                              {customerMeasurement.chest && <div><span className="text-gray-600">Chest:</span> <span className="font-medium">{customerMeasurement.chest}"</span></div>}
                              {customerMeasurement.waist && <div><span className="text-gray-600">Waist:</span> <span className="font-medium">{customerMeasurement.waist}"</span></div>}
                              {customerMeasurement.dressLength && <div><span className="text-gray-600">Dress Length:</span> <span className="font-medium">{customerMeasurement.dressLength}"</span></div>}
                            </>
                          )}
                        </div>
                        {customerMeasurement.extraNotes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">Notes: {customerMeasurement.extraNotes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Order History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order History</h3>
                  {(() => {
                    const customerOrders = getCustomerOrders(selectedCustomer.id);
                    if (customerOrders.length === 0) {
                      return (
                        <div className="text-center py-4 text-gray-500">
                          <p>No orders found</p>
                          <button
                            onClick={() => onNavigate('billing')}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Create first order
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {customerOrders.slice(0, 5).map(order => (
                          <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{order.id}</p>
                                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
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
                          </div>
                        ))}
                        {customerOrders.length > 5 && (
                          <button
                            onClick={() => onNavigate('order-history')}
                            className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
                          >
                            View all {customerOrders.length} orders
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};