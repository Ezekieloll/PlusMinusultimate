# backend/preprocessing/preprocess.py
import pandas as pd
import re

def clean_text(text):
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    # Remove mentions and hashtags
    text = re.sub(r'@\w+|#\w+', '', text)
    return text.strip().lower()

def preprocess_data(input_file, output_file):
    df = pd.read_csv(input_file)
    # Assume the raw CSV has a column named "tweet_text"
    df['cleaned_text'] = df['tweet_text'].astype(str).apply(clean_text)
    # For simplicity, let processed_text equal cleaned_text (you can add more steps)
    df['processed_text'] = df['cleaned_text']
    df.to_csv(output_file, index=False)
    return df
