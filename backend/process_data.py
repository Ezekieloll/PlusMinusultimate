# backend/process_data.py
import os
import sys
import argparse
import pandas as pd

# Import preprocessing modules
from preprocessing.preprocess import preprocess_data
from preprocessing.classify import apply_classification
from preprocessing.ner import apply_ner
from preprocessing.geocode import apply_geocoding

def main():
    parser = argparse.ArgumentParser(description="Process tweet data pipeline.")
    parser.add_argument(
        "--skip-pipeline",
        action="store_true",
        help="Skip data processing steps and use the existing final dataset."
    )
    args = parser.parse_args()

    # Define file paths
    raw_file = "data/tweets_data.csv"                             # Original raw data
    cleaned_file = "data/cleaned_tweets_data.csv"                 # After text cleaning
    two_tier_file = "data/tweets_with_two_tier_categories.csv"     # After classification
    with_locations_file = "data/tweets_with_locations.csv"         # After NER extraction
    with_geocodes_file = "data/tweets_with_geocodes_opencage.csv"    # Final processed file

    if args.skip_pipeline:
        if not os.path.exists(with_geocodes_file):
            print(f"Error: Final dataset '{with_geocodes_file}' does not exist. Cannot skip pipeline.")
            sys.exit(1)
        else:
            print(f"Skipping pipeline. Final dataset '{with_geocodes_file}' loaded.")
            df = pd.read_csv(with_geocodes_file)
            # No further processing required for visualization on the frontend.
            print(df.head())
            return

    # Full processing pipeline:
    print("STEP 1: Preprocessing data...")
    df = preprocess_data(raw_file, cleaned_file)
    print(f"Cleaned data saved to {cleaned_file}")

    print("STEP 2: Classifying tweets...")
    df = pd.read_csv(cleaned_file)  # Reload the cleaned file
    df = apply_classification(df)
    df.to_csv(two_tier_file, index=False)
    print(f"Two-tier classification complete. File saved to {two_tier_file}")

    print("STEP 3: Extracting locations with NER...")
    df = pd.read_csv(two_tier_file)
    df = apply_ner(df)
    df.to_csv(with_locations_file, index=False)
    print(f"Locations extracted. File saved to {with_locations_file}")

    print("STEP 4: Geocoding locations with OpenCage API...")
    df = pd.read_csv(with_locations_file)
    OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY  # Replace with your actual API key
    df = apply_geocoding(df, OPENCAGE_API_KEY)
    df.to_csv(with_geocodes_file, index=False)
    print(f"Geocoding complete. Final file saved to {with_geocodes_file}")

if __name__ == "__main__":
    main()
