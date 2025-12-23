
import os

DATA_DIR = 'data'
MODELS_DIR = 'models'

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

STOCKS = [
    'AXISBANK.NS',    
    'BHARTIARTL.NS',  
    'BRITANNIA.NS',   
    'HDFCBANK.NS',  
    'HINDUNILVR.NS',  
    'ICICIBANK.NS',  
    'INFY.NS',        
    'ITC.NS',         
    'KOTAKBANK.NS',   
    'MARUTI.NS',     
    'ONGC.NS',        
    'RELIANCE.NS',    
    'SBIN.NS',        
    'TCS.NS',         
    'WIPRO.NS'      
]

SEQUENCE_LENGTH = 60  
EPOCHS = 30  
BATCH_SIZE = 32
