# 🛡️ Sentra: AI-Based Cyber Threat Detection Framework

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=flat-square&logo=scikit-learn&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

An end-to-end machine learning platform that combines **Network Intrusion Detection** and **Malware Classification** into a single deployable web application. 

> **Context:** Built during my internship at **DRDO** to explore how machine learning can complement traditional, signature-based cybersecurity systems by learning to recognize malicious behavior directly from data.

**🔗 Quick Links:** [Live Demo](https://cyber-threat-detection-backend.vercel.app) · [Backend API](#api-documentation) 

---

## 📖 Table of Contents
- [Why This Project?](#-why-this-project)
- [The Problem with Signature-Based Security](#-the-problem-with-signature-based-security)
- [System Architecture](#-system-architecture)
- [Core Modules](#-core-modules)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [API Documentation](#-api-documentation)
- [Installation & Setup](#-installation--setup)
- [Performance & Results](#-performance--results)
- [Known Limitations & Future Work](#-known-limitations--future-work)

---

## 🎯 Why This Project?

Most public ML-security projects stop at a Jupyter notebook. That's a reasonable way to learn the fundamentals, but it doesn't reflect how these systems actually get used in production. 

I built the **complete lifecycle**: 
`Raw dataset → Preprocessing → Model training → Benchmarking → Saved artifacts → REST API → User Interface`.

The two modules cover the most common attack surfaces: **Network Intrusion Detection** defends the perimeter (traffic between machines), while **Malware Detection** defends the endpoint (files on a machine).

---

## 🚨 The Problem with Signature-Based Security

Firewalls, traditional IDS/IPS, and Antivirus software operate on a fundamental logic: *"If this traffic/file matches known pattern X, flag it."*

While effective for known threats, this approach breaks down against:
1. **Zero-day attacks:** Techniques that have never been seen before, lacking any signature.
2. **Polymorphic threats:** Malware deliberately mutated to avoid matching a known signature while executing the same payload.

**The Sentra Approach:** Instead of memorizing exact patterns, Sentra trains models on labeled examples of normal vs. malicious behavior. It learns the statistical shape of an attack (unusual connection counts, abnormal byte ratios, suspicious file imports) and flags behavior that resembles an attack, even if the exact instance is novel.

---

## 🏗️ System Architecture

Both modules share the same underlying pattern: raw features in, a trained classifier in the middle, and a risk-scored, human-readable verdict out. 

```text
Raw Dataset
    │
    ▼
Missing Value Handling (Drop/impute incomplete records)
    │
    ▼
Categorical Encoding (Text fields → Integers)
    │
    ▼
Label Encoding (Target classes → Integers)
    │
    ▼
Feature Scaling (StandardScaler normalization)
    │
    ▼
Train/Test Split (80/20, stratified)
    │
    ▼
Model Training (MLPClassifier + Random Forest baseline)
    │
    ▼
Evaluation (Accuracy, Precision, Recall, F1, ROC-AUC)
    │
    ▼
Model Persistence (.pkl artifacts)
    │
    ▼
FastAPI Backend (Loads artifacts once, serves via REST)
    │
    ▼
React Frontend (CSV upload & results dashboard)
