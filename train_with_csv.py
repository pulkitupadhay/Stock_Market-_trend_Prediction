#!/usr/bin/env python3
"""
Train LSTM models using CSV data files
Place CSV files in data/ directory with format: {SYMBOL}.csv
"""

import os
import sys
import time
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib
from config import STOCKS, SEQUENCE_LENGTH, EPOCHS, BATCH_SIZE, MODELS_DIR, DATA_DIR

def generate_sample_data(symbol, days=730):
    """Generate realistic sample stock data for demonstration"""
    print(f"📊 Generating sample data for {symbol}...")

    # Base prices for different stocks
    base_prices = {
        'HDFCBANK.NS': 1600, 'ICICIBANK.NS': 950, 'SBIN.NS': 600,
        'KOTAKBANK.NS': 1800, 'AXISBANK.NS': 1050,
        'TCS.NS': 3500, 'INFY.NS': 1450, 'WIPRO.NS': 420,
        'RELIANCE.NS': 2450, 'ONGC.NS': 180,
        'HINDUNILVR.NS': 2400, 'ITC.NS': 420, 'BRITANNIA.NS': 4800,
        'MARUTI.NS': 10500, 'BHARTIARTL.NS': 850
    }

    base_price = base_prices.get(symbol, 1000)

    dates = pd.date_range(end=datetime.now(), periods=days, freq='D')

    # Generate realistic price movements
    np.random.seed(hash(symbol) % 2**32)
    returns = np.random.normal(0.0005, 0.02, days)  # Daily returns
    prices = base_price * np.exp(np.cumsum(returns))

    # Add trend
    trend = np.linspace(0, 0.3, days)
    prices = prices * (1 + trend)

    # Generate OHLCV data
    df = pd.DataFrame({
        'Date': dates,
        'Open': prices * (1 + np.random.uniform(-0.01, 0.01, days)),
        'High': prices * (1 + np.random.uniform(0.005, 0.025, days)),
        'Low': prices * (1 + np.random.uniform(-0.025, -0.005, days)),
        'Close': prices,
        'Volume': np.random.randint(1000000, 10000000, days)
    })

    df.set_index('Date', inplace=True)
    return df

def load_or_generate_data(symbol):
    """Load data from CSV or generate sample data"""
    csv_path = os.path.join(DATA_DIR, f'{symbol}.csv')

    if os.path.exists(csv_path):
        print(f"📂 Loading data from {csv_path}...")
        df = pd.read_csv(csv_path, index_col=0, parse_dates=True)
        print(f"✅ Loaded {len(df)} days of data")
        return df
    else:
        print(f"⚠️  No CSV found for {symbol}, generating sample data...")
        df = generate_sample_data(symbol)
        # Save for future use
        df.to_csv(csv_path)
        print(f"✅ Generated and saved {len(df)} days of sample data")
        return df

def prepare_data(df, sequence_length=60):
    """Prepare data for LSTM training"""
    df['MA7'] = df['Close'].rolling(window=7).mean()
    df['MA21'] = df['Close'].rolling(window=21).mean()
    data = df[['Close', 'MA7', 'MA21']].dropna()

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    X, y = [], []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i])
        y.append(scaled_data[i, 0])

    X, y = np.array(X), np.array(y)
    split = int(0.8 * len(X))

    return X[:split], X[split:], y[:split], y[split:], scaler

def build_model(input_shape):
    """Build LSTM model"""
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(units=50, return_sequences=True),
        Dropout(0.2),
        LSTM(units=50),
        Dropout(0.2),
        Dense(units=1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(symbol):
    """Train model for a single stock"""
    print(f"\n{'='*60}")
    print(f"🚀 Training model for {symbol}")
    print('='*60)

    try:
        df = load_or_generate_data(symbol)

        if len(df) < 100:
            print(f"❌ Insufficient data for {symbol}")
            return False

        X_train, X_test, y_train, y_test, scaler = prepare_data(df, SEQUENCE_LENGTH)

        if len(X_train) < 50:
            print(f"❌ Not enough training samples for {symbol}")
            return False

        print(f"📊 Training samples: {len(X_train)}, Test samples: {len(X_test)}")

        model = build_model((X_train.shape[1], X_train.shape[2]))

        early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

        print(f"🎯 Training model...")
        model.fit(
            X_train, y_train,
            epochs=EPOCHS,
            batch_size=BATCH_SIZE,
            validation_data=(X_test, y_test),
            callbacks=[early_stop],
            verbose=0
        )

        model_path = os.path.join(MODELS_DIR, f'{symbol}.h5')
        scaler_path = os.path.join(MODELS_DIR, f'{symbol}_scaler.pkl')

        model.save(model_path)
        joblib.dump(scaler, scaler_path)

        print(f"✅ Model saved: {model_path}")
        return True

    except Exception as e:
        print(f"❌ Error training {symbol}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False



def main():
    print("\n" + "="*60)
    print("🤖 TRAIN ALL 15 INDIAN STOCKS")
    print("="*60)
    print(f"📊 Total stocks: {len(STOCKS)}")
    print(f"⏱️  Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    start_time = time.time()
    successful = 0
    failed = 0

    for i, symbol in enumerate(STOCKS, 1):
        print(f"\n[{i}/{len(STOCKS)}] Processing {symbol}...")

        if train_model(symbol):
            successful += 1
        else:
            failed += 1

    elapsed = (time.time() - start_time) / 60

    print("\n" + "="*60)
    print("📊 TRAINING SUMMARY")
    print("="*60)
    print(f"✅ Successful: {successful}/{len(STOCKS)}")
    print(f"❌ Failed: {failed}/{len(STOCKS)}")
    print(f"⏱️  Total time: {elapsed:.2f} minutes")
    print(f"🏁 Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    if successful == len(STOCKS):
        print("\n🎉 All models trained successfully!")
    elif successful > 0:
        print(f"\n⚠️  {successful} models trained, {failed} failed")
    else:
        print("\n❌ No models were trained successfully")

if __name__ == "__main__":
    main()



