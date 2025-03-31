# backend/preprocessing/ner.py
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_locations(text):
    doc = nlp(text)
    # Extract entities that are locations
    locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC", "FAC"]]
    return locations

def apply_ner(df):
    # Use original tweet_text for NER (you can choose cleaned_text if preferred)
    df['locations'] = df['tweet_text'].astype(str).apply(extract_locations)
    return df
