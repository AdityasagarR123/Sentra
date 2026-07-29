# 🛡️ AI-Based Cyber Threat Detection Framework

> An end-to-end AI-powered cybersecurity platform that combines Network Intrusion Detection and Malware Classification into a unified web application. Developed during my internship at DRDO to explore how Machine Learning can complement traditional cybersecurity solutions by identifying malicious network activity and suspicious executable files.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Project-blue?style=for-the-badge)](https://cyber-threat-detection-backend.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-FastAPI-success?style=for-the-badge)](https://cyber-threat-detection-backend-205p.onrender.com/)

</div>

---

# Table of Contents

- Introduction
- Why This Project?
- Understanding the Problem
- Existing Solutions & Their Limitations
- Project Goals
- System Overview
- Architecture
- Module 1: Network Intrusion Detection
- Module 2: Malware Detection
- Machine Learning Pipeline
- Model Comparison
- Deployment
- Frontend
- Backend
- API Documentation
- Project Structure
- Installation
- Results
- Future Improvements
- References

---

# Introduction

Cybersecurity has become one of the most critical challenges in modern computing. Every organization, whether it is a government agency, financial institution, healthcare provider, or cloud service provider, continuously exchanges enormous amounts of data across networks. Hidden within this traffic are malicious activities such as denial-of-service attacks, unauthorized access attempts, reconnaissance scans, and malware distribution.

Traditional cybersecurity solutions primarily rely on predefined signatures and manually crafted rules to detect threats. While effective against known attacks, these systems struggle when confronted with previously unseen attack patterns, polymorphic malware, or sophisticated adversaries that intentionally modify their behavior to evade detection.

The objective of this project is to demonstrate how Machine Learning can enhance traditional cybersecurity systems by learning patterns directly from data instead of depending solely on static signatures. The resulting framework integrates two independent machine learning modules into a single deployable application:

- **Network Intrusion Detection System (NIDS)** for detecting malicious network traffic.
- **Malware Detection System** for classifying executable files as benign or malicious.

The complete solution includes data preprocessing, model training, evaluation, comparison with baseline algorithms, deployment through FastAPI, and a React-based web interface for real-time predictions.

---

# Why This Project?

Explain **your motivation** here.

Example:

During my internship at DRDO, I wanted to understand how Artificial Intelligence could be applied to cybersecurity beyond theoretical research. Most public projects stop after training a model in a Jupyter notebook. I wanted to build an end-to-end system that demonstrates the complete machine learning lifecycle—from raw cybersecurity datasets and preprocessing to deployment as a usable web application.

The project focuses on two complementary cybersecurity tasks. While Network Intrusion Detection monitors communication occurring inside a network, Malware Detection focuses on identifying malicious executable files before they can compromise a system. Combining both approaches provides broader protection against modern cyber threats.

---

# Understanding the Problem

(Explain cybersecurity in detail.)

Talk about:

- Network traffic
- Why attacks occur
- Examples
- Zero-day attacks
- Signature detection
- Behavioural detection
- AI

This section should be **600+ words**.

---

# Existing Solutions

Explain:

Firewall

↓

IDS

↓

IPS

↓

Antivirus

↓

Why Machine Learning?

---

# Project Objectives

Explain every objective with paragraphs.

Not bullets.

---

# Complete System Overview

Explain how both modules work together.

Include a nice Mermaid diagram.

```mermaid
graph LR

A[User Uploads CSV]
B[React Dashboard]
C[FastAPI Backend]
D[Network Intrusion Model]
E[Malware Model]
F[Prediction Engine]
G[Results Dashboard]

A --> B
B --> C
C --> D
C --> E
D --> F
E --> F
F --> G
```

---

# Module 1 — Network Intrusion Detection

This should be almost a mini research paper.

Explain:

- What is NIDS?
- Why NSL-KDD?
- What features exist?
- Why preprocessing?
- Why scaling?
- Why Label Encoding?
- Why MLP?
- Why Random Forest?
- Evaluation
- Results
- What model learned

---

# Module 2 — Malware Detection

Same style.

Explain

- Malware
- Types
- Dataset
- Feature Engineering
- DNN
- Random Forest
- ROC-AUC
- Final model

---

# Machine Learning Pipeline

```
Raw Dataset
     │
Cleaning
     │
Encoding
     │
Scaling
     │
Train/Test Split
     │
Neural Network
     │
Random Forest
     │
Evaluation
     │
Save Models
     │
FastAPI
     │
React
```

Explain every stage.

---

# Why Two Models?

Instead of just saying

Random Forest

explain

Why Random Forest is still one of the strongest algorithms on tabular data.

Why DNN was expected to outperform.

Why benchmarking matters.

---

# Model Evaluation

Explain

Accuracy

Precision

Recall

F1

Weighted F1

Confusion Matrix

ROC Curve

ROC-AUC

Instead of defining them mathematically, explain what they mean for cybersecurity.

---

# Backend

Explain

FastAPI

REST APIs

Prediction pipeline

Saved pickle files

Confidence scores

JSON responses

---

# Frontend

Explain

React

CSV Upload

Visualization

API Integration

User Experience

---

# Deployment

Explain why

Frontend → Vercel

Backend → Render

were chosen.

Explain deployment challenges.

---

# Folder Structure

Explain every folder.

Not just show tree.

---

# API Documentation

Show request

Show response

Explain fields.

---

# Screenshots

Home

Upload

Prediction

Results

Confusion Matrix

Dashboard

---

# Future Work

Explain ideas instead of listing them.

For example,

Real-time packet capture using Scapy

TensorFlow implementation

Kafka streaming

Docker Compose

Cloud deployment

Explain why each matters.

---

# References

NSL-KDD Paper

Scikit-Learn Documentation

FastAPI Documentation

Render

Vercel

---

# Author

**Aditya Sagar**

B.Tech Computer Science Engineering

Machine Learning Research | Cybersecurity | AI

Developed during internship at **DRDO**
