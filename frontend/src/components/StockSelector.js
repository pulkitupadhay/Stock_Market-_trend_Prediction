import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';

const StockSelector = ({ selectedStock, onStockChange }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('/api/stocks');
      const data = await response.json();
      if (data.success) {
        setStocks(data.stocks);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      // Fallback to default stocks
      setStocks([
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
        { symbol: 'INFY.NS', name: 'Infosys' },
      ]);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, background: 'rgba(26, 31, 58, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="stock-select-label">Select Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            id="stock-select"
            value={selectedStock}
            label="Select Stock"
            onChange={(e) => onStockChange(e.target.value)}
            disabled={loading}
          >
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              stocks.map((stock) => (
                <MenuItem key={stock.symbol} value={stock.symbol}>
                  {stock.name} ({stock.symbol})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default StockSelector;

