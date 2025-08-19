import React, { useState, useEffect } from 'react';
import { Customer } from './types';
import { storage } from './utils/storage';

// Components
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { AddCustomerScreen } from './components/AddCustomerScreen';
import { MeasurementScreen } from './components/MeasurementScreen';
import { BillingScreen } from './components/BillingScreen';
import { SearchCustomerScreen } from './components/SearchCustomerScreen';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setIsAuthenticated(storage.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    storage.clearAuth();
    setIsAuthenticated(false);
    setCurrentScreen('home');
    setSelectedCustomer(null);
  };

  const handleNavigate = (screen: string, customer?: Customer) => {
    setCurrentScreen(screen);
    if (customer) {
      setSelectedCustomer(customer);
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Render current screen
  switch (currentScreen) {
    case 'home':
      return <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />;
    
    case 'add-customer':
      return <AddCustomerScreen onNavigate={handleNavigate} />;
    
    case 'measurement':
      return selectedCustomer ? (
        <MeasurementScreen customer={selectedCustomer} onNavigate={handleNavigate} />
      ) : (
        <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />
      );
    
    case 'billing':
      return <BillingScreen onNavigate={handleNavigate} />;
    
    case 'search-customer':
      return <SearchCustomerScreen onNavigate={handleNavigate} />;
    
    case 'order-history':
      return <OrderHistoryScreen onNavigate={handleNavigate} />;
    
    case 'settings':
      return <SettingsScreen onNavigate={handleNavigate} />;
    
    default:
      return <HomeScreen onNavigate={handleNavigate} onLogout={handleLogout} />;
  }
}

export default App;