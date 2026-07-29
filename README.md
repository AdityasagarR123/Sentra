# 🛡️ AI-Based Cyber Threat Detection Framework

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange?style=for-the-badge&logo=scikitlearn)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel)

### AI-powered cybersecurity platform for **Network Intrusion Detection** and **Malware Classification**

**Developed during my internship at DRDO**

🌐 **Live Demo:** https://cyber-threat-detection-backend.vercel.app/

⚙️ **Backend API:** https://cyber-threat-detection-backend-205p.onrender.com/

</div>

---

# 📖 Overview

Cyber threats continue to evolve rapidly, making traditional signature-based security solutions insufficient for detecting modern attacks. This project presents an **AI-Based Cyber Threat Detection Framework** that leverages Machine Learning to automatically identify malicious network activity and classify potentially harmful files.

The framework combines two independent machine learning pipelines into a single web application:

- 🌐 Network Intrusion Detection System (NIDS)
- 🦠 Malware Detection System

Both models are deployed behind a FastAPI backend and accessed through an interactive React dashboard, enabling users to upload datasets and receive real-time predictions.

---

# 🚨 Problem Statement

Organizations generate enormous amounts of network traffic every day.

Among millions of legitimate connections, attackers attempt to perform activities such as:

- Denial of Service (DoS)
- Network Probing
- Unauthorized Access
- Remote-to-Local Attacks
- User-to-Root Exploits
- Malware Distribution

Traditional antivirus software and Intrusion Detection Systems primarily rely on **signature-based detection**, which struggles to identify:

- Zero-day attacks
- Unknown malware variants
- Modified attack patterns
- Previously unseen threats

Machine Learning provides a data-driven approach by learning patterns from historical attack data instead of depending solely on predefined rules.

---

# 🎯 Objectives

This project aims to:

- Detect malicious network traffic using Machine Learning
- Classify files as Benign or Malware
- Compare Deep Neural Networks against Random Forest baselines
- Provide real-time predictions through REST APIs
- Deploy an end-to-end AI-powered cybersecurity solution

---

# 🏗️ System Architecture

```
                     +----------------------+
                     |    User Uploads CSV  |
                     +----------+-----------+
                                |
                                v
                    +-----------------------+
                    |   React Frontend      |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    |   FastAPI Backend     |
                    +-----------+-----------+
                                |
                 +--------------+---------------+
                 |                              |
                 v                              v
      Network Intrusion Model         Malware Detection Model
           (Deep Neural Net)             (Deep Neural Net)
                 |                              |
                 +--------------+---------------+
                                |
                                v
                  JSON Prediction Response
                                |
                                v
                  Dashboard Visualization
```

---

# 🔍 Features

## 🌐 Network Intrusion Detection

- Detects malicious network traffic
- Supports NSL-KDD dataset
- Deep Neural Network classifier
- Random Forest baseline comparison
- Confidence scores
- Risk level assessment
- CSV upload support

---

## 🦠 Malware Detection

- Classifies executable samples
- Detects malicious files
- Deep Neural Network classifier
- Random Forest baseline
- Binary malware prediction
- Confidence estimation

---

## 📊 Interactive Dashboard

- Modern React UI
- Drag & Drop CSV Upload
- Prediction tables
- Risk visualization
- Responsive design
- API integration

---

# 🤖 Machine Learning Pipeline

```
Dataset
      │
      ▼
Data Cleaning
      │
      ▼
Feature Encoding
      │
      ▼
Standard Scaling
      │
      ▼
Train/Test Split
      │
      ▼
Deep Neural Network
      │
      ├──────────────┐
      ▼              ▼
 Random Forest   Model Comparison
      │              │
      └──────┬───────┘
             ▼
 Performance Evaluation
             ▼
 Save Model Artifacts
             ▼
 FastAPI Deployment
```

---

# 📂 Datasets Used

## Network Intrusion Detection

- NSL-KDD Dataset

Detects attacks such as:

- DoS
- Probe
- R2L
- U2R
- Normal Traffic

---

## Malware Detection

Malware feature dataset containing extracted characteristics of executable files.

Classes:

- Benign
- Malware

---

# ⚙️ Preprocessing

The following preprocessing pipeline is applied before training:

- Missing value handling
- Label Encoding
- Categorical feature encoding
- Feature normalization using StandardScaler
- Train-Test Split
- Stratified sampling

---

# 🧠 Models

## Primary Model

Deep Neural Network (MLPClassifier)

Architecture

```
Input Layer

↓

64 Hidden Neurons (ReLU)

↓

32 Hidden Neurons (ReLU)

↓

Output Layer
```

Optimizer:

- Adam

Additional Features:

- Early Stopping
- Validation Monitoring

---

## Baseline Model

Random Forest Classifier

Used for:

- Performance comparison
- Benchmarking
- Feature Importance Analysis

---

# 📈 Evaluation Metrics

Both models are evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- Weighted F1 Score
- Confusion Matrix

For Malware Detection:

- ROC Curve
- ROC-AUC Score

---

# 🚀 Deployment

## Frontend

React + Vite

Hosted on **Vercel**

🔗 https://cyber-threat-detection-backend.vercel.app/

---

## Backend

FastAPI

Hosted on **Render**

🔗 https://cyber-threat-detection-backend-205p.onrender.com/

---

# 📦 Saved Model Artifacts

```
models/
│
├── nids_model.pkl
├── malware_model.pkl
├── nids_scaler.pkl
├── malware_scaler.pkl
├── nids_label_encoder.pkl
├── malware_label_encoder.pkl
└── model_comparison.csv
```

---

# 📁 Project Structure

```
AI-Cyber-Threat-Detection
│
├── backend/
│   ├── app.py
│   ├── utils.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── models/
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── notebooks/
│
├── datasets/
│
└── README.md
```

---

# 🌐 API Endpoints

### Network Intrusion Prediction

```
POST /predict/network
```

---

### Malware Prediction

```
POST /predict/malware
```

---

# 💻 Tech Stack

### Machine Learning

- Python
- Scikit-Learn
- NumPy
- Pandas

### Backend

- FastAPI
- Uvicorn

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Deployment

- Render
- Vercel
- Docker

---

# 📸 Application

| Home | Network Detection |
|------|-------------------|
| Add Screenshot | Add Screenshot |

| Malware Detection | Results |
|-------------------|----------|
| Add Screenshot | Add Screenshot |

---

# 🔮 Future Improvements

- Deep Learning using TensorFlow/PyTorch
- Real-time packet capture
- Live traffic monitoring
- Explainable AI (SHAP/LIME)
- Threat intelligence integration
- Multi-class malware family detection
- Authentication & user management
- Cloud-native deployment with Kubernetes

---

# 👨‍💻 Author

**Aditya Sagar**

B.Tech Computer Science & Engineering

Machine Learning & AI Enthusiast

DRDO Intern

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

---

## 📜 License

This project is intended for educational and research purposes.
