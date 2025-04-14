# backend/preprocessing/classify.py
import pandas as pd
import time
from transformers import pipeline

# Initialize the zero-shot classifier (make sure you have PyTorch or TensorFlow installed)
tier1_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
tier1_labels = ["Crime-related", "Achievement-based", "Neutral"]

# Define candidate detailed labels
crime_labels = ["Murder", "Robbery", "Rape", "Assault", "Theft", "Fraud", "Kidnapping"]
achievement_labels = ["Award won", "Innovation", "Record", "Milestone", "Discovery", "Recognition"]

def classify_tier1(text):
    result = tier1_classifier(text, candidate_labels=tier1_labels)
    return result['labels'][0]

def classify_tier2_crime(text):
    result = tier1_classifier(text, candidate_labels=crime_labels)
    return result['labels'][0]

def classify_tier2_achievement(text):
    result = tier1_classifier(text, candidate_labels=achievement_labels)
    return result['labels'][0]

def classify_text(text):
    if not text.strip():
        return ("Neutral", "None")
    tier1 = classify_tier1(text)
    time.sleep(0.5)  # To avoid hitting rate limits
    if tier1 == "Neutral":
        return (tier1, "None")
    elif tier1 == "Crime-related":
        detailed = classify_tier2_crime(text)
        return (tier1, detailed)
    elif tier1 == "Achievement-based":
        detailed = classify_tier2_achievement(text)
        return (tier1, detailed)
    else:
        return (tier1, "None")

def apply_classification(df):
    df[['tier1_category', 'detailed_category']] = df['processed_text'].apply(lambda x: pd.Series(classify_text(x)))
    return df