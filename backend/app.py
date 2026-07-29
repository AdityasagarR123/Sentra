import os
import time
import shutil
import logging
import pandas as pd
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# Import our utility functions
from utils import (
    load_pickle_file,
    preprocess_nids_data,
    preprocess_malware_data,
    get_nids_threat_details,
    get_malware_threat_details,
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("backend_app")

# Ensure uploads directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Risk levels mapping for prioritization
RISK_PRIORITY = {
    "Critical": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1
}

# Lifespan context manager for loading models once at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FastAPI server: Loading ML models, scalers, and encoders...")
    try:
        # Load NIDS models
        app.state.nids_model = load_pickle_file("nids_model.pkl")
        app.state.nids_scaler = load_pickle_file("nids_scaler.pkl")
        app.state.nids_label_encoder = load_pickle_file("nids_label_encoder.pkl")
        
        # Load Malware models
        app.state.malware_model = load_pickle_file("malware_model.pkl")
        app.state.malware_scaler = load_pickle_file("malware_scaler.pkl")
        app.state.malware_label_encoder = load_pickle_file("malware_label_encoder.pkl")
        
        logger.info("All pre-trained ML models and scalers loaded successfully.")
    except Exception as e:
        logger.error(f"Critical error loading models during startup: {str(e)}")
        # We do not crash the app startup, but subsequent requests will fail gracefully
        # or we let it raise so the service fails to start if models are missing
        raise RuntimeError(f"Server startup failed due to missing/invalid models: {str(e)}")
        
    yield
    logger.info("Shutting down FastAPI server: Clean up resources if necessary.")


app = FastAPI(
    title="AI-Based Cyber Threat Detection Framework API",
    description="Production-ready FastAPI backend for running NIDS and Malware predictions.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware
# Allows requests from any origin (e.g. frontend dev servers, Hugging Face Spaces, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI-Based Cyber Threat Detection Backend is running.",
        "docs_url": "/docs"
    }


@app.post("/predict/network")
async def predict_network(request: Request, file: UploadFile = File(...)):
    """
    Accepts a network traffic features CSV file, runs NIDS model prediction, and returns
    predictions, confidence, risk levels, and security recommendations.
    """
    # 1. Validate file extension
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV files are supported.")
    
    # 2. Save CSV to uploads folder for tracking/logging
    file_path = os.path.join(UPLOADS_DIR, f"nids_{int(time.time())}_{file.filename}")
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to save file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file upload: {str(e)}")

    # 3. Read CSV into Pandas DataFrame
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        logger.error(f"Failed to read CSV: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # 4. Check if DataFrame is empty
    if df.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV file contains no data.")

    # 5. Preprocess and Run Inference
    try:
        # Retrieve models from app state
        scaler = request.app.state.nids_scaler
        model = request.app.state.nids_model
        label_encoder = request.app.state.nids_label_encoder

        # Run preprocessing (imputing, feature selection, scaling)
        X_scaled = preprocess_nids_data(df, scaler)

        # Run prediction
        predictions = model.predict(X_scaled)
        
        # Decode target labels
        decoded_labels = label_encoder.inverse_transform(predictions)

        # Get confidence/probabilities
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_scaled)
            confidences = np.max(probs, axis=1).tolist()
        else:
            # Fallback if model does not support predict_proba
            confidences = [1.0] * len(predictions)

        # Generate list of individual predictions
        results = []
        for idx, (label, conf) in enumerate(zip(decoded_labels, confidences)):
            details = get_nids_threat_details(label, conf)
            results.append({
                "row_index": idx,
                "prediction": str(label),
                "confidence": round(float(conf), 4),
                "risk_level": details["risk_level"],
                "recommendation": details["recommendation"]
            })

        # Determine overall threat summary (highest threat in the batch)
        highest_threat_result = max(results, key=lambda x: RISK_PRIORITY.get(x["risk_level"], 0))

        return {
            "prediction": highest_threat_result["prediction"],
            "confidence": highest_threat_result["confidence"],
            "risk_level": highest_threat_result["risk_level"],
            "recommendation": highest_threat_result["recommendation"],
            "is_batch": len(results) > 1,
            "total_samples": len(results),
            "results": results
        }

    except ValueError as val_err:
        logger.warning(f"Validation error in NIDS processing: {str(val_err)}")
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        logger.error(f"Prediction logic error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction processing: {str(e)}")


@app.post("/predict/malware")
async def predict_malware(request: Request, file: UploadFile = File(...)):
    """
    Accepts a malware classification features CSV file, runs malware prediction model, and returns
    predictions, confidence, risk levels, and security recommendations.
    """
    # 1. Validate file extension
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV files are supported.")
    
    # 2. Save CSV to uploads folder for tracking/logging
    file_path = os.path.join(UPLOADS_DIR, f"malware_{int(time.time())}_{file.filename}")
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.error(f"Failed to save file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file upload: {str(e)}")

    # 3. Read CSV into Pandas DataFrame
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        logger.error(f"Failed to read CSV: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # 4. Check if DataFrame is empty
    if df.empty:
        raise HTTPException(status_code=400, detail="The uploaded CSV file contains no data.")

    # 5. Preprocess and Run Inference
    try:
        # Retrieve models from app state
        scaler = request.app.state.malware_scaler
        model = request.app.state.malware_model
        label_encoder = request.app.state.malware_label_encoder

        # Run preprocessing (imputing, feature selection, scaling)
        X_scaled = preprocess_malware_data(df, scaler)

        # Run prediction
        predictions = model.predict(X_scaled)
        
        # Decode target labels
        decoded_labels = label_encoder.inverse_transform(predictions)

        # Get confidence/probabilities
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_scaled)
            confidences = np.max(probs, axis=1).tolist()
        else:
            # Fallback if model does not support predict_proba
            confidences = [1.0] * len(predictions)

        # Generate list of individual predictions
        results = []
        for idx, (label, conf) in enumerate(zip(decoded_labels, confidences)):
            details = get_malware_threat_details(label, conf)
            results.append({
                "row_index": idx,
                "prediction": str(label),
                "confidence": round(float(conf), 4),
                "risk_level": details["risk_level"],
                "recommendation": details["recommendation"]
            })

        # Determine overall threat summary (highest threat in the batch)
        highest_threat_result = max(results, key=lambda x: RISK_PRIORITY.get(x["risk_level"], 0))

        return {
            "prediction": highest_threat_result["prediction"],
            "confidence": highest_threat_result["confidence"],
            "risk_level": highest_threat_result["risk_level"],
            "recommendation": highest_threat_result["recommendation"],
            "is_batch": len(results) > 1,
            "total_samples": len(results),
            "results": results
        }

    except ValueError as val_err:
        logger.warning(f"Validation error in malware processing: {str(val_err)}")
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        logger.error(f"Prediction logic error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction processing: {str(e)}")
