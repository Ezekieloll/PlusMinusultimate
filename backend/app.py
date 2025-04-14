# backend/app.py
from flask import Flask, request, jsonify
import pandas as pd
import os
import ast
from flask_cors import CORS
import ast
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Path to the final CSV file (ensure this file exists in your data/ directory)
DATA_FILE = os.path.join("data", "tweets_with_geocodes_opencage.csv")
if not os.path.exists(DATA_FILE):
    raise FileNotFoundError(f"Data file '{DATA_FILE}' not found.")

# Load the processed data into a DataFrame
df = pd.read_csv(DATA_FILE)
print(f"Loaded {len(df)} tweets from {DATA_FILE}")

# Function to parse coordinate strings into Python objects
def parse_coordinates(coord_str):
    try:
        return ast.literal_eval(coord_str)
    except Exception:
        return []

# Ensure the 'coordinates' column is converted properly
if 'coordinates' in df.columns:
    df['coordinates'] = df['coordinates'].apply(lambda x: parse_coordinates(x) if isinstance(x, str) else x)

@app.route("/api/tweets", methods=["GET"])
def get_tweets():
    # Filter for valid coordinates
    filtered = df[df['coordinates'].apply(lambda x: isinstance(x, list) and len(x) > 0)]

    if filtered.empty:
        return jsonify([])

    # Apply any additional filtering based on query parameters (optional)
    tier1 = request.args.get("tier1", "All")
    detailed = request.args.get("detailed", "All")
    handle = request.args.get("handle", "All")
    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")
    
    if tier1 != "All":
        filtered = filtered[filtered["tier1_category"] == tier1]
    if detailed != "All":
        filtered = filtered[filtered["detailed_category"] == detailed]
    if handle != "All":
        filtered = filtered[filtered["handle"] == handle]
    if start_date:
        filtered = filtered[filtered["tweet_date"] >= start_date]
    if end_date:
        filtered = filtered[filtered["tweet_date"] <= end_date]

    # Convert to a list of records for the frontend
    tweets = filtered.to_dict(orient="records")
    return jsonify(tweets)

if __name__ == "__main__":
    app.run(debug=True)
