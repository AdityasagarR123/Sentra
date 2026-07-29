import os
import joblib
import pandas as pd
import numpy as np

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
SCALER_PATH = os.path.join(MODELS_DIR, "nids_scaler.pkl")
OUTPUT_PATH = os.path.join(BASE_DIR, "sample_nids.csv")

print("=== Generating Sample NIDS CSV ===")

# 1. Load the NIDS scaler
if not os.path.exists(SCALER_PATH):
    raise FileNotFoundError(f"Scaler not found at {SCALER_PATH}. Please make sure files are in the models folder.")

try:
    scaler = joblib.load(SCALER_PATH)
    print("Successfully loaded nids_scaler.pkl")
except Exception as e:
    raise RuntimeError(f"Error loading scaler: {str(e)}")

# 2. Get expected feature names
if not hasattr(scaler, "feature_names_in_"):
    raise ValueError("The loaded scaler does not contain feature_names_in_. Cannot determine column names automatically.")

features = list(scaler.feature_names_in_)
print(f"Scaler expects {len(features)} features.")

# 3. Create realistic random values for NIDS dataset (based on KDD/NSL-KDD schema)
np.random.seed(42)  # For reproducibility
num_rows = 10
data = {}

# Define typical categoricals and binary flags
categorical_choices = {
    "protocol_type": ["tcp", "udp", "icmp"],
    "service": ["http", "private", "smtp", "ftp_data", "domain_u", "other"],
    "flag": ["SF", "S0", "REJ", "RSTR", "RSTO", "SH"]
}

binary_columns = ["land", "logged_in", "root_shell", "is_host_login", "is_guest_login"]

for col in features:
    if col in categorical_choices:
        data[col] = np.random.choice(categorical_choices[col], size=num_rows)
    elif col in binary_columns:
        data[col] = np.random.choice([0, 1], size=num_rows, p=[0.9, 0.1])
    elif "rate" in col:
        # Rates are values between 0.0 and 1.0
        data[col] = np.round(np.random.uniform(0.0, 1.0, size=num_rows), 4)
    elif "count" in col:
        # Counts are integers, e.g., 0 to 511
        data[col] = np.random.randint(0, 512, size=num_rows)
    elif col in ["src_bytes", "dst_bytes"]:
        # Bytes can be larger integers
        data[col] = np.random.randint(0, 100000, size=num_rows)
    elif col == "duration":
        # Connection duration
        data[col] = np.random.randint(0, 1000, size=num_rows)
    else:
        # Default fallback for other numeric columns
        data[col] = np.round(np.random.uniform(0.0, 10.0, size=num_rows), 4)

# 4. Generate DataFrame and save to CSV
df = pd.DataFrame(data)
df.to_csv(OUTPUT_PATH, index=False)

print(f"\nSuccessfully generated sample CSV file: {OUTPUT_PATH}")
print(f"File contains {num_rows} rows and {len(df.columns)} columns.")
print("\nGenerated Column Names:")
print(list(df.columns))
