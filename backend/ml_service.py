"""
ML Service for Stock Predictions
Called by Node.js backend via child_process
"""

import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import joblib
import os

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

def get_demo_data(symbol, days=90):
    """Generate demo stock data"""
    base_prices = {
        'RELIANCE.NS': 2450,
        'TCS.NS': 3500,
        'HDFCBANK.NS': 1650,
        'INFY.NS': 1450,
        'SBIN.NS': 580,
        'ICICIBANK.NS': 950,
        'BHARTIARTL.NS': 850,
        'HINDUNILVR.NS': 2400,
        'ITC.NS': 420,
        'KOTAKBANK.NS': 1750,
        'LT.NS': 3200,
        'AXISBANK.NS': 1050,
        'WIPRO.NS': 450,
        'MARUTI.NS': 10500,
        'BAJFINANCE.NS': 7200
    }
    
    base_price = base_prices.get(symbol, 1000)
    dates = [(datetime.now() - timedelta(days=days-i)).strftime('%Y-%m-%d') for i in range(days)]
    
    np.random.seed(hash(symbol) % 2**32)
    prices = []
    current_price = base_price
    
    for i in range(days):
        change = np.random.normal(0, base_price * 0.02)
        current_price = max(current_price + change, base_price * 0.5)
        prices.append(current_price)
    
    data = []
    for i, date in enumerate(dates):
        price = prices[i]
        data.append({
            'Date': date,
            'Open': price * (1 + np.random.uniform(-0.01, 0.01)),
            'High': price * (1 + np.random.uniform(0, 0.02)),
            'Low': price * (1 - np.random.uniform(0, 0.02)),
            'Close': price,
            'Volume': int(np.random.uniform(1000000, 10000000))
        })
    
    return pd.DataFrame(data)

def load_stock_data(symbol):
    """Load stock data from CSV file"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, 'data', f'{symbol}.csv')

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # Get last 90 days
        df = df.tail(90).copy()
        return df
    else:
        # Fallback to demo data
        return get_demo_data(symbol, days=90)

def make_predictions(symbol):
    """Generate predictions for a stock"""
    try:
        # Check if model exists (models are in parent directory)
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, 'models', f'{symbol}.h5')
        scaler_path = os.path.join(base_dir, 'models', f'{symbol}_scaler.pkl')

        if not os.path.exists(model_path):
            return {'error': f'Model not found for {symbol}'}

        # Load model and scaler
        model = load_model(model_path)
        scaler = joblib.load(scaler_path)

        # Load stock data from CSV
        df = load_stock_data(symbol)

        # Calculate moving averages (same as training)
        df['MA7'] = df['Close'].rolling(window=7).mean()
        df['MA21'] = df['Close'].rolling(window=21).mean()

        # Prepare data with same features as training
        data = df[['Close', 'MA7', 'MA21']].dropna()
        scaled_data = scaler.transform(data)
        
        # Create sequences with all 3 features
        sequence_length = config.SEQUENCE_LENGTH
        X = []
        for i in range(sequence_length, len(scaled_data)):
            X.append(scaled_data[i-sequence_length:i, :])  # Use all 3 features
        X = np.array(X)
        
        # Make predictions
        predictions = model.predict(X, verbose=0)

        # Inverse transform predictions (need to create full feature array)
        # Predictions are for Close price (first column)
        pred_full = np.zeros((predictions.shape[0], 3))
        pred_full[:, 0] = predictions.flatten()
        pred_full[:, 1:] = scaled_data[sequence_length:, 1:]  # Use actual MA values
        predictions_unscaled = scaler.inverse_transform(pred_full)[:, 0]

        # Get actual values
        actual_values = data['Close'].values[sequence_length:]
        predicted = predictions_unscaled
        
        # Direction accuracy
        actual_direction = np.diff(actual_values) > 0
        predicted_direction = np.diff(predicted) > 0
        direction_accuracy = np.mean(actual_direction == predicted_direction) * 100

        # Get dates (accounting for dropna from MA calculation)
        dates_list = df['Date'].tolist()

        # Prepare response
        result = {
            'success': True,
            'symbol': symbol,
            'predictions': {
                'dates': dates_list,
                'actual': actual_values.tolist(),
                'predicted': predicted.tolist(),
                'latest_prediction': float(predicted[-1]),
                'direction_accuracy': float(direction_accuracy),
                'sentiment': {
                    'sentiment_label': 'Positive' if predicted[-1] > actual_values[-1] else 'Negative',
                    'confidence': float(min(abs((predicted[-1] - actual_values[-1]) / actual_values[-1]) * 100, 100))
                }
            }
        }
        
        return result
        
    except Exception as e:
        return {'error': str(e)}

def get_stock_data(symbol):
    """Get current stock data"""
    try:
        # Load from CSV
        df = load_stock_data(symbol)

        result = {
            'success': True,
            'symbol': symbol,
            'data': df.to_dict('records')
        }

        return result

    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({'error': 'Usage: python ml_service.py <action> <symbol>'}))
        sys.exit(1)
    
    action = sys.argv[1]
    symbol = sys.argv[2]
    
    if action == 'predict':
        result = make_predictions(symbol)
    elif action == 'stock':
        result = get_stock_data(symbol)
    else:
        result = {'error': f'Unknown action: {action}'}
    
    print(json.dumps(result))

