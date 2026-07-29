import os
import joblib
import pandas as pd
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend_utils")

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

def load_pickle_file(filename: str):
    """
    Helper function to load a pickle file from the models directory.
    """
    filepath = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(filepath):
        logger.error(f"Required model file not found: {filepath}")
        raise FileNotFoundError(f"Model file not found: {filename} in models/ directory.")
    try:
        data = joblib.load(filepath)
        logger.info(f"Successfully loaded {filename}")
        return data
    except Exception as e:
        logger.error(f"Failed to load {filename}: {str(e)}")
        raise RuntimeError(f"Error loading {filename}: {str(e)}")

# ==========================================
# CATEGORICAL MAPPINGS FOR NIDS
# ==========================================

# Standard mappings for NSL-KDD / KDD-99 categorical columns (alphabetical order matches scikit-learn's default LabelEncoder)
PROTOCOL_MAP = {"icmp": 0, "tcp": 1, "udp": 2}

FLAG_MAP = {
    "OTH": 0, "REJ": 1, "RSTO": 2, "RSTOS0": 3, "RSTR": 4,
    "S0": 5, "S1": 6, "S2": 7, "S3": 8, "SF": 9, "SH": 10
}

# Standard alphabetical list of services in NSL-KDD
SERVICES_LIST = [
    "IRC", "X11", "Z39_50", "aol", "auth", "bgp", "courier", "csnet_ns", "ctf", "daytime",
    "discard", "domain", "domain_u", "echo", "eco_i", "ecr_i", "efs", "exec", "finger", "ftp",
    "ftp_data", "gopher", "harvest", "hostnames", "http", "http_2784", "http_443", "http_8001",
    "imap4", "iso_tsap", "jmp", "lpr", "mail", "map", "netbios_dgm", "netbios_ns", "netbios_ssn",
    "netstat", "nnsp", "nntp", "ntp_u", "other", "pm_dump", "pop_2", "pop_3", "printer",
    "private", "red_i", "remote_job", "rje", "shell", "smtp", "sql_net", "ssh", "sunrpc",
    "supdup", "systat", "telnet", "tftp_u", "tim_i", "time", "urh_i", "urp_i", "uucp",
    "uucp_path", "vmnet", "whois"
]
SERVICE_MAP = {service.lower(): idx for idx, service in enumerate(SERVICES_LIST)}

def map_protocol(val):
    if pd.isna(val):
        return 1  # Default to tcp
    v_str = str(val).strip().lower()
    return PROTOCOL_MAP.get(v_str, 1)

def map_flag(val):
    if pd.isna(val):
        return 9  # Default to SF
    v_str = str(val).strip().upper()
    return FLAG_MAP.get(v_str, 9)

def map_service(val):
    if pd.isna(val):
        return SERVICE_MAP.get("other", 41)
    v_str = str(val).strip().lower()
    return SERVICE_MAP.get(v_str, SERVICE_MAP.get("other", 41))

# ==========================================
# PREPROCESSING FUNCTIONS
# ==========================================

def preprocess_nids_data(df: pd.DataFrame, scaler):
    """
    Preprocess Network Intrusion Detection (NIDS) data before inference.
    
    --------------------------------------------------------------------------
    COPY-PASTE INSTRUCTION FROM YOUR GOOGLE COLAB NOTEBOOK:
    If you had specific preprocessing steps in your Colab notebook (such as
    dropping certain columns like ID or timestamps, replacing missing values, 
    or encoding categorical variables), you should paste them here.
    --------------------------------------------------------------------------
    """
    # Create copy to avoid SettingWithCopyWarning
    df = df.copy()

    # 1. Decode/map categorical text features to numeric codes if they are strings
    if "protocol_type" in df.columns:
        if pd.api.types.is_string_dtype(df["protocol_type"]):
            df["protocol_type"] = df["protocol_type"].apply(map_protocol)
            
    if "service" in df.columns:
        if pd.api.types.is_string_dtype(df["service"]):
            df["service"] = df["service"].apply(map_service)
            
    if "flag" in df.columns:
        if pd.api.types.is_string_dtype(df["flag"]):
            df["flag"] = df["flag"].apply(map_flag)

    # 2. Standard handling of missing values
    df = df.fillna(0)

    # 2. Align columns with the Scaler's expected inputs
    # This automatically matches the column ordering and column list expected by the scaler.
    if hasattr(scaler, "feature_names_in_"):
        expected_cols = list(scaler.feature_names_in_)
        missing_cols = [col for col in expected_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns in uploaded NIDS CSV: {missing_cols}")
        df_prepared = df[expected_cols]
    else:
        # Fallback if the scaler has no feature names (e.g. fit on raw numpy array)
        # Select numeric columns only
        df_prepared = df.select_dtypes(include=[np.number])
        if hasattr(scaler, "n_features_in_"):
            expected_dim = scaler.n_features_in_
            if df_prepared.shape[1] != expected_dim:
                raise ValueError(
                    f"Number of numeric columns ({df_prepared.shape[1]}) "
                    f"does not match model expected features ({expected_dim}). "
                    "Please ensure columns are in the correct order and format."
                )

    # 3. Apply the saved scaler
    X_scaled = scaler.transform(df_prepared)
    return X_scaled


def preprocess_malware_data(df: pd.DataFrame, scaler):
    """
    Preprocess Malware detection data before inference.
    
    --------------------------------------------------------------------------
    COPY-PASTE INSTRUCTION FROM YOUR GOOGLE COLAB NOTEBOOK:
    If you had specific preprocessing steps in your Colab notebook (such as
    dropping columns like file hashes/names, target labels, filling nulls, 
    or scaling specific features), you should paste them here.
    --------------------------------------------------------------------------
    """
    # 1. Standard handling of missing values
    df = df.fillna(0)

    # 2. Align columns with the Scaler's expected inputs
    if hasattr(scaler, "feature_names_in_"):
        expected_cols = list(scaler.feature_names_in_)
        missing_cols = [col for col in expected_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns in uploaded Malware CSV: {missing_cols}")
        df_prepared = df[expected_cols]
    else:
        # Fallback to numeric columns
        df_prepared = df.select_dtypes(include=[np.number])
        if hasattr(scaler, "n_features_in_"):
            expected_dim = scaler.n_features_in_
            if df_prepared.shape[1] != expected_dim:
                raise ValueError(
                    f"Number of numeric columns ({df_prepared.shape[1]}) "
                    f"does not match model expected features ({expected_dim}). "
                    "Please ensure columns are in the correct order and format."
                )

    # 3. Apply the saved scaler
    X_scaled = scaler.transform(df_prepared)
    return X_scaled

# ==========================================
# POST-PREDICTION MAPPER FUNCTIONS
# ==========================================

def get_nids_threat_details(prediction: str, confidence: float):
    """
    Maps a prediction string and confidence score to a Risk Level and Recommendation.
    """
    pred_lower = str(prediction).lower()
    
    if "normal" in pred_lower or "benign" in pred_lower:
        return {
            "risk_level": "Low",
            "recommendation": "No threat detected. Continue standard network monitoring and log collection."
        }
    elif "dos" in pred_lower or "ddos" in pred_lower:
        return {
            "risk_level": "High",
            "recommendation": "Potential Denial of Service (DoS/DDoS) attack detected. Enable rate-limiting, activate mitigation rules on your web application firewall, and check resource utilization."
        }
    elif "probe" in pred_lower or "scan" in pred_lower or "portscan" in pred_lower:
        return {
            "risk_level": "Medium",
            "recommendation": "Network scanning or reconnaissance detected. Block scanning IP address(es) and ensure unnecessary ports are closed/secured."
        }
    elif "brute" in pred_lower or "exploit" in pred_lower or "botnet" in pred_lower or "infiltration" in pred_lower:
        return {
            "risk_level": "Critical",
            "recommendation": "Active intrusion attempt or compromised host detected. Immediately isolate the infected network node, reset passwords, and run network security scans."
        }
    else:
        # General default mapping based on confidence
        if confidence > 0.8:
            return {
                "risk_level": "High",
                "recommendation": "Highly suspicious network activity detected. Restrict communication with the source IP and verify system health."
            }
        elif confidence > 0.5:
            return {
                "risk_level": "Medium",
                "recommendation": "Anomalous network activity detected. Monitor connection logs closely."
            }
        else:
            return {
                "risk_level": "Low",
                "recommendation": "Low risk anomaly. Monitor for further suspicious patterns."
            }


def get_malware_threat_details(prediction: str, confidence: float):
    """
    Maps a prediction string and confidence score to a Risk Level and Recommendation.
    """
    pred_lower = str(prediction).lower()
    
    if "benign" in pred_lower or "normal" in pred_lower:
        return {
            "risk_level": "Low",
            "recommendation": "File appears safe. No malicious signatures or behavior patterns identified."
        }
    elif "ransomware" in pred_lower:
        return {
            "risk_level": "Critical",
            "recommendation": "Ransomware signature detected! Immediately isolate the system from all local networks and internet, disable shared drives, and restore from cold backups."
        }
    elif "trojan" in pred_lower or "spyware" in pred_lower or "adware" in pred_lower or "backdoor" in pred_lower:
        return {
            "risk_level": "High",
            "recommendation": "Malicious code detected. Place the file in quarantine, run an endpoint security scan, and review running processes."
        }
    elif "virus" in pred_lower or "worm" in pred_lower:
        return {
            "risk_level": "High",
            "recommendation": "Self-replicating malware detected. Terminate associated processes, delete the source file, and check network propagation logs."
        }
    else:
        # General default mapping based on confidence
        if confidence > 0.8:
            return {
                "risk_level": "High",
                "recommendation": "Unclassified threat detected with high confidence. Quarantine the file and analyze in a sandbox environment."
            }
        elif confidence > 0.5:
            return {
                "risk_level": "Medium",
                "recommendation": "Suspicious file characteristics detected. Flag for security administrator verification."
            }
        else:
            return {
                "risk_level": "Low",
                "recommendation": "Low-confidence file alert. Keep endpoint protection updated."
            }
