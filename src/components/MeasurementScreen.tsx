import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Customer, Measurement } from '../types';
import { storage } from '../utils/storage';

interface MeasurementScreenProps {
  customer: Customer;
  onNavigate: (screen: string) => void;
}

export const MeasurementScreen: React.FC<MeasurementScreenProps> = ({ customer, onNavigate }) => {
  const [measurements, setMeasurements] = useState<Partial<Measurement>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing measurements if available
    const loadMeasurements = async () => {
      const customerMeasurement = await storage.getMeasurementByCustomerId(customer.id);
      if (customerMeasurement) {
        setMeasurements(customerMeasurement);
      }
    };
    
    loadMeasurements();
  }, [customer.id]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await storage.saveMeasurement({
        customerId: customer.id,
        ...measurements
      });
      
      onNavigate('home');
    } catch (error) {
      console.error('Failed to save measurements:', error);
      alert('Failed to save measurements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value ? parseFloat(value) : undefined }));
  };

  const renderGentsMeasurements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chest (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.chest || ''}
          onChange={(e) => handleInputChange('chest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter chest measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Waist (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.waist || ''}
          onChange={(e) => handleInputChange('waist', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter waist measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hip (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.hip || ''}
          onChange={(e) => handleInputChange('hip', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hip measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shoulder Width (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.shoulderWidth || ''}
          onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter shoulder width"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.sleeveLength || ''}
          onChange={(e) => handleInputChange('sleeveLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter sleeve length"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shirt Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.shirtLength || ''}
          onChange={(e) => handleInputChange('shirtLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter shirt length"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pant Waist (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.pantWaist || ''}
          onChange={(e) => handleInputChange('pantWaist', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter pant waist"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pant Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.pantLength || ''}
          onChange={(e) => handleInputChange('pantLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter pant length"
        />
      </div>
    </div>
  );

  const renderLadiesMeasurements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Shoulder & General Section */}
      <div className="md:col-span-2">
        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">General Measurements</h4>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shoulder Width (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.shoulderWidth || ''}
          onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter shoulder width"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">High Chest (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.highChest || ''}
          onChange={(e) => handleInputChange('highChest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter high chest measurement"
        />
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Middle Chest (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.middleChest || ''}
          onChange={(e) => handleInputChange('middleChest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter middle chest measurement"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Waist (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.waist || ''}
          onChange={(e) => handleInputChange('waist', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter waist measurement"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Waist Loose (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.waistLoose || ''}
          onChange={(e) => handleInputChange('waistLoose', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter waist loose measurement"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hip (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.hip || ''}
          onChange={(e) => handleInputChange('hip', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hip measurement"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hip Loose (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.hipLoose || ''}
          onChange={(e) => handleInputChange('hipLoose', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hip loose measurement"
        />
      </div>

      {/* Blouse/Top Section */}
      <div className="md:col-span-2 mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Blouse/Top Measurements</h4>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Blouse Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.blouseLength || ''}
          onChange={(e) => handleInputChange('blouseLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter blouse length"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Top Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.topLength || ''}
          onChange={(e) => handleInputChange('topLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter top length"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hand Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.handLength || ''}
          onChange={(e) => handleInputChange('handLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hand length"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hand Loose (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.handLoose || ''}
          onChange={(e) => handleInputChange('handLoose', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hand loose"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.sleeveLength || ''}
          onChange={(e) => handleInputChange('sleeveLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter sleeve length"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Front Neck Deep (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.frontNeckDeep || ''}
          onChange={(e) => handleInputChange('frontNeckDeep', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter front neck deep"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Back Neck Deep (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.backNeckDeep || ''}
          onChange={(e) => handleInputChange('backNeckDeep', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter back neck deep"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Front Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.frontLength || ''}
          onChange={(e) => handleInputChange('frontLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter front length"
        />
      </div>

      {/* Pant Section */}
      <div className="md:col-span-2 mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Pant Measurements</h4>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pant Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.pantLength || ''}
          onChange={(e) => handleInputChange('pantLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter pant length"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pant Loose (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.pantLoose || ''}
          onChange={(e) => handleInputChange('pantLoose', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter pant loose"
        />
      </div>

      {/* Lehenga Section */}
      <div className="md:col-span-2 mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Lehenga Measurements</h4>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Lehenga Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.lehengaLength || ''}
          onChange={(e) => handleInputChange('lehengaLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter lehenga length"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Lehenga Loose (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.lehengaLoose || ''}
          onChange={(e) => handleInputChange('lehengaLoose', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter lehenga loose"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kurti Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.kurtiLength || ''}
          onChange={(e) => handleInputChange('kurtiLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter kurti length"
        />
      </div>
    </div>
  );

  const renderKidsMeasurements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.height || ''}
          onChange={(e) => handleInputChange('height', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter height"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chest (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.chest || ''}
          onChange={(e) => handleInputChange('chest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter chest measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Waist (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.waist || ''}
          onChange={(e) => handleInputChange('waist', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter waist measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hip (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.hip || ''}
          onChange={(e) => handleInputChange('hip', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hip measurement"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.sleeveLength || ''}
          onChange={(e) => handleInputChange('sleeveLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter sleeve length"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dress Length (inches)</label>
        <input
          type="number"
          step="0.5"
          value={measurements.dressLength || ''}
          onChange={(e) => handleInputChange('dressLength', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter dress length"
        />
      </div>
    </div>
  );

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
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {customer.gender} Measurements
              </h1>
              <p className="text-sm text-gray-600">
                {customer.name} - {customer.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Customer Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Name:</span>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <span className="text-blue-600">Phone:</span>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                <div>
                  <span className="text-blue-600">Gender:</span>
                  <p className="font-medium">{customer.gender}</p>
                </div>
                <div>
                  <span className="text-blue-600">Age:</span>
                  <p className="font-medium">{customer.age} years</p>
                </div>
              </div>
            </div>

            {/* Measurements Form */}
            {customer.gender === 'Gents' && renderGentsMeasurements()}
            {customer.gender === 'Ladies' && renderLadiesMeasurements()}
            {customer.gender === 'Kids' && renderKidsMeasurements()}

            {/* Extra Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Notes
              </label>
              <textarea
                value={measurements.extraNotes || ''}
                onChange={(e) => setMeasurements(prev => ({ ...prev, extraNotes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special notes or instructions..."
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isLoading ? 'Saving...' : 'Save Measurements'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};