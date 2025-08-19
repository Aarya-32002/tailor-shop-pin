import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Upload, Scissors } from 'lucide-react';
import { storage } from '../utils/storage';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState(storage.getSettings());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    storage.saveSettings(settings);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  const handlePriceChange = (clothingType: string, price: string) => {
    setSettings(prev => ({
      ...prev,
      priceList: {
        ...prev.priceList,
        [clothingType]: parseFloat(price) || 0
      }
    }));
  };

  const addClothingType = () => {
    const newType = prompt('Enter clothing type name:');
    if (newType && !settings.priceList[newType]) {
      setSettings(prev => ({
        ...prev,
        priceList: {
          ...prev.priceList,
          [newType]: 0
        }
      }));
    }
  };

  const removeClothingType = (clothingType: string) => {
    if (confirm(`Remove ${clothingType} from price list?`)) {
      const newPriceList = { ...settings.priceList };
      delete newPriceList[clothingType];
      setSettings(prev => ({
        ...prev,
        priceList: newPriceList
      }));
    }
  };

  const exportData = () => {
    const data = {
      customers: storage.getCustomers(),
      measurements: storage.getMeasurements(),
      orders: storage.getOrders(),
      settings: storage.getSettings(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tailor-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (confirm('This will replace all existing data. Are you sure?')) {
          if (data.customers) storage.saveCustomers(data.customers);
          if (data.measurements) storage.saveMeasurements(data.measurements);
          if (data.orders) storage.saveOrders(data.orders);
          if (data.settings) storage.saveSettings(data.settings);
          
          alert('Data imported successfully! Please refresh the page.');
        }
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Shop Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Scissors className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shop Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Tailoring Shop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Shop address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login PIN
                </label>
                <input
                  type="password"
                  value={settings.pin}
                  onChange={(e) => setSettings(prev => ({ ...prev, pin: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter PIN"
                />
              </div>
            </div>
          </div>

          {/* Price List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Price List</h2>
              <button
                onClick={addClothingType}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Add Type
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.priceList).map(([clothingType, price]) => (
                <div key={clothingType} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{clothingType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => handlePriceChange(clothingType, e.target.value)}
                      className="w-24 px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeClothingType(clothingType)}
                      className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={exportData}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export Backup</span>
              </button>

              <label className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>• Export creates a backup file with all your data</p>
              <p>• Import will replace all current data with backup data</p>
              <p>• Keep regular backups to prevent data loss</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};