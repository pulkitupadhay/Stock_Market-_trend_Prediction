import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TwitterIcon from '@mui/icons-material/Twitter';

const SentimentAnalysis = ({ sentiment }) => {
  if (!sentiment) return null;

  const { news, twitter } = sentiment;

  const getSentimentIcon = (percentage) => {
    if (percentage > 50) return <SentimentSatisfiedAltIcon sx={{ color: '#4caf50' }} />;
    if (percentage < 30) return <SentimentDissatisfiedIcon sx={{ color: '#f44336' }} />;
    return <SentimentNeutralIcon sx={{ color: '#ff9800' }} />;
  };

  const getSentimentColor = (percentage) => {
    if (percentage > 50) return '#4caf50';
    if (percentage < 30) return '#f44336';
    return '#ff9800';
  };

  const renderSentimentSection = (data, icon, title) => {
    const { summary } = data;
    const positivePercent = summary.positive_percentage;
    const negativePercent = summary.negative_percentage;
    const neutralPercent = summary.neutral_percentage;

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Positive</Typography>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              {positivePercent.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={positivePercent} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Negative</Typography>
            <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 'bold' }}>
              {negativePercent.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={negativePercent} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#f44336'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Neutral</Typography>
            <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
              {neutralPercent.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={neutralPercent} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9800'
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          {getSentimentIcon(positivePercent)}
          <Typography variant="body2" color="text.secondary">
            Overall: {positivePercent > 50 ? 'Positive' : positivePercent < 30 ? 'Negative' : 'Neutral'}
          </Typography>
          <Chip 
            label={`${summary.total_items} items`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, background: 'rgba(26, 31, 58, 0.8)', backdropFilter: 'blur(10px)', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Sentiment Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Based on news articles and social media
      </Typography>

      {renderSentimentSection(news, <NewspaperIcon />, 'News Sentiment')}
      
      <Divider sx={{ my: 3 }} />
      
      {renderSentimentSection(twitter, <TwitterIcon />, 'Social Media Sentiment')}
    </Paper>
  );
};

export default SentimentAnalysis;

