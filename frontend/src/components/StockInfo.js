import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StockInfo = ({ data }) => {
  if (!data || !data.info) return null;

  const { info } = data;
  const latestData = data.data[data.data.length - 1];
  const previousData = data.data[data.data.length - 2];
  
  const priceChange = latestData.Close - previousData.Close;
  const priceChangePercent = (priceChange / previousData.Close) * 100;
  const isPositive = priceChange >= 0;

  return (
    <Paper elevation={3} sx={{ p: 3, background: 'rgba(26, 31, 58, 0.8)', backdropFilter: 'blur(10px)', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {info.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {info.symbol}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          ₹{latestData.Close.toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ color: '#4caf50' }} />
          ) : (
            <TrendingDownIcon sx={{ color: '#f44336' }} />
          )}
          <Typography
            variant="body1"
            sx={{ color: isPositive ? '#4caf50' : '#f44336', fontWeight: 'bold' }}
          >
            {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Open</Typography>
          <Typography variant="body2">₹{latestData.Open.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">High</Typography>
          <Typography variant="body2">₹{latestData.High.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Low</Typography>
          <Typography variant="body2">₹{latestData.Low.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Volume</Typography>
          <Typography variant="body2">{(latestData.Volume / 1000000).toFixed(2)}M</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {info.sector && info.sector !== 'N/A' && (
          <Chip label={info.sector} size="small" color="primary" variant="outlined" />
        )}
        {info.industry && info.industry !== 'N/A' && (
          <Chip label={info.industry} size="small" color="secondary" variant="outlined" />
        )}
      </Box>
    </Paper>
  );
};

export default StockInfo;

