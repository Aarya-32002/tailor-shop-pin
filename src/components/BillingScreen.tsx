import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, FileText, Search } from 'lucide-react';
import { Customer, Order, OrderItem } from '../types';
import { storage } from '../utils/storage';
import { generateBillPDF } from '../utils/pdf';

interface BillingScreenProps {
  onNavigate: (screen: string) => void;
}

export const BillingScreen: React.FC<BillingScreenProps> = ({ onNavigate }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [extraCharges, setExtraCharges] = useState(0);
  const [materialCharges, setMaterialCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Pending');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const customers = storage.getCustomers();
  const settings = storage.getSettings();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.id.includes(searchTerm)
  );

  const clothingTypes = Object.keys(settings.priceList);

  useEffect(() => {
    // Set default delivery date to 7 days from today
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setDeliveryDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const addItem = () => {
    const newItem: OrderItem = {
      clothingType: clothingTypes[0] || '',
      quantity: 1,
      price: settings.priceList[clothingTypes[0]] || 0,
      total: settings.priceList[clothingTypes[0]] || 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'clothingType') {
      updatedItems[index].price = settings.priceList[value as string] || 0;
    }
    
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + extraCharges + materialCharges - discount;

  const generateBill = async () => {
    if (!selectedCustomer || items.length === 0) {
      alert('Please select a customer and add at least one item');
      return;
    }

    setIsLoading(true);

    const orders = storage.getOrders();
    const orderId = `ORD-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: [...items],
      subtotal,
      extraCharges,
      materialCharges,
      discount,
      total,
      paymentStatus,
      deliveryDate,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    storage.saveOrders(orders);

    // Generate PDF
    generateBillPDF(newOrder, selectedCustomer, settings);

    // Reset form
    setTimeout(() => {
      setSelectedCustomer(null);
      setSearchTerm('');
      setItems([]);
      setExtraCharges(0);
      setMaterialCharges(0);
      setDiscount(0);
      setPaymentStatus('Pending');
      
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDeliveryDate(defaultDate.toISOString().split('T')[0]);
      
      setIsLoading(false);
      alert('Bill generated successfully!');
    }, 1000);
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
            <h1 className="text-xl font-bold text-gray-900">Create Bill</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Customer</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name, phone, or ID"
                />
              </div>

              {selectedCustomer ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-blue-900">{selectedCustomer.name}</h3>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-blue-700">Phone: {selectedCustomer.phone}</p>
                  <p className="text-sm text-blue-700">ID: {selectedCustomer.id}</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      <p className="text-xs text-gray-500">{customer.id}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bill Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Bill Details</h2>

              {/* Items */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Items</h3>
                  <button
                    onClick={addItem}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={item.clothingType}
                        onChange={(e) => updateItem(index, 'clothingType', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        {clothingTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                        placeholder="Qty"
                      />
                      
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                        placeholder="Price"
                      />
                      
                      <div className="w-24 text-center font-medium text-gray-900">
                        ₹{item.total}
                      </div>
                      
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Charges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Extra Charges</label>
                  <input
                    type="number"
                    min="0"
                    value={extraCharges}
                    onChange={(e) => setExtraCharges(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Charges</label>
                  <input
                    type="number"
                    min="0"
                    value={materialCharges}
                    onChange={(e) => setMaterialCharges(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Payment & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Pending')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {extraCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Extra Charges:</span>
                      <span>₹{extraCharges}</span>
                    </div>
                  )}
                  {materialCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Material Charges:</span>
                      <span>₹{materialCharges}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Generate Bill Button */}
              <button
                onClick={generateBill}
                disabled={!selectedCustomer || items.length === 0 || isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>{isLoading ? 'Generating...' : 'Generate Bill'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};