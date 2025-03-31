# backend/preprocessing/geocode.py
import time
import requests

# Define the OpenCage API endpoint
GEOCODE_URL = "https://api.opencagedata.com/geocode/v1/json"

def geocode_location_opencage(location_name, api_key):
    """
    Given a location name, returns (latitude, longitude) using the OpenCage Geocoder API.
    
    Parameters:
        location_name (str): The name of the location to geocode.
        api_key (str): Your OpenCage API key.
        
    Returns:
        tuple: (latitude, longitude) if geocoding is successful; otherwise, (None, None).
    """
    location_name = location_name.strip()
    if not location_name:
        return None, None

    params = {
        "q": location_name,
        "key": api_key,
        "limit": 1,
        "no_annotations": 1
    }
    
    response = requests.get(GEOCODE_URL, params=params)
    if response.status_code != 200:
        print(f"Error: Status code {response.status_code} for {location_name}")
        return None, None
    
    data = response.json()
    if data.get("results"):
        result = data["results"][0]
        lat = result["geometry"]["lat"]
        lon = result["geometry"]["lng"]
        return lat, lon
    else:
        print(f"No geocoding results for {location_name}.")
        return None, None

def geocode_locations(locations_list, api_key):
    """
    Given a list of location names, returns a list of (lat, lon) tuples for each valid location.
    
    Parameters:
        locations_list (list): A list of location names (strings).
        api_key (str): Your OpenCage API key.
        
    Returns:
        list: A list of tuples, where each tuple is (latitude, longitude).
    """
    coordinates = []
    if not locations_list:
        return coordinates
    for loc in locations_list:
        if not loc.strip():
            continue
        lat, lon = geocode_location_opencage(loc, api_key)
        if lat is not None and lon is not None:
            coordinates.append((lat, lon))
        # Wait a bit between calls to respect API rate limits
        time.sleep(0.2)
    return coordinates

def apply_geocoding(df, api_key):
    """
    Applies geocoding to the 'locations' column of a pandas DataFrame.
    The 'locations' column is expected to contain a list of location names (or a string representation of a list).
    The function creates a new column 'coordinates' containing a list of (lat, lon) tuples for each row.
    
    Parameters:
        df (pandas.DataFrame): The DataFrame with a 'locations' column.
        api_key (str): Your OpenCage API key.
        
    Returns:
        pandas.DataFrame: The original DataFrame with an added 'coordinates' column.
    """
    df['coordinates'] = df['locations'].apply(lambda locs: geocode_locations(locs, api_key))
    return df
