import { useState, useEffect } from 'react';
import api from '../services/api';
import { InventoryForecast } from '../types';

// This custom hook is used to manage the state and fetching of inventory forecasts
// It provides a way to fetch, store, and manage the loading and error states
// related to inventory forecasts in a React component
export const useInventoryForecast = () => {
  // State to store the array of inventory forecasts
  const [forecast, setForecast] = useState<InventoryForecast[]>([]);
  // State to track if the forecast is currently being loaded
  const [loading, setLoading] = useState(false);
  // State to store any error messages that occur during fetching
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the inventory forecast from the API
  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedForecast = await api.get('/inventory-forecast');
      setForecast(fetchedForecast.data);
    } catch (err) {
      setError('Failed to fetch inventory forecast');
      console.error('Error fetching inventory forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch the forecast when the component mounts
  useEffect(() => {
    fetchForecast();
  }, []);

  // Return the state and fetchForecast function for use in components
  return { forecast, loading, error, fetchForecast };
};
