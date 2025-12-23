import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PsychologyIcon from '@mui/icons-material/Psychology';

const PredictionCard = ({ predictions }) => {
  if (!predictions || !predictions.predictions) return null;

  const { predictions: pred, hybrid_prediction } = predictions;
  const priceDiff = pred.latest_prediction - pred.current_price;
  const priceChangePercent = (priceDiff / pred.current_price) * 100;
  const isPositive = priceDiff >= 0;

  return (
    <Paper elevation={3} sx={{ p: 3, background: 'rgba(26, 31, 58, 0.8)', backdropFilter: 'blur(10px)', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PsychologyIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6">
          AI Predictions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* LSTM Prediction */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              LSTM Price Prediction
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              ₹{pred.latest_prediction.toFixed(2)}
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
                {isPositive ? '+' : ''}{priceDiff.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Current Price: ₹{pred.current_price.toFixed(2)}
            </Typography>
          </Box>
        </Grid>

        {/* Hybrid Prediction */}
        {hybrid_prediction && (
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              background: hybrid_prediction.direction === 'UP' 
                ? 'rgba(76, 175, 80, 0.1)' 
                : 'rgba(244, 67, 54, 0.1)',
              border: hybrid_prediction.direction === 'UP'
                ? '1px solid rgba(76, 175, 80, 0.3)'
                : '1px solid rgba(244, 67, 54, 0.3)'
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hybrid Model (LSTM + Sentiment)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {hybrid_prediction.direction}
                </Typography>
                {hybrid_prediction.direction === 'UP' ? (
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 40, color: '#f44336' }} />
                )}
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Confidence: {hybrid_prediction.confidence.toFixed(1)}%
              </Typography>
              <Chip 
                label={`${hybrid_prediction.confidence >= 70 ? 'High' : hybrid_prediction.confidence >= 50 ? 'Medium' : 'Low'} Confidence`}
                size="small"
                color={hybrid_prediction.confidence >= 70 ? 'success' : hybrid_prediction.confidence >= 50 ? 'warning' : 'error'}
              />
            </Box>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2, p: 2, borderRadius: 1, background: 'rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" color="text.secondary">
          ⚠️ Predictions are based on historical data and sentiment analysis. 
          Always do your own research before making investment decisions.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PredictionCard;

