# 💧 HydroGuard AI – Smart Water Quality and Usage Prediction using Machine Learning

HydroGuard AI is a Machine Learning-powered web application that analyzes water quality based on physical, chemical, and environmental parameters to predict the most suitable water usage category. The application also calculates the Water Quality Index (WQI), displays prediction confidence, and provides resource guidelines for effective water management.

---

## 🌐 Live Demo

🔗 **Website:** https://hydroguard-ai.onrender.com/

---

## 📌 Project Overview

Water is one of the most valuable natural resources, and ensuring its quality is essential for public health, agriculture, industries, and environmental sustainability. Traditional water quality assessment requires manual analysis of multiple parameters and expert interpretation.

HydroGuard AI automates this process using Machine Learning. Users simply enter water quality parameters through an interactive web interface, and the application predicts the most appropriate water usage category while calculating the Water Quality Index (WQI).

---

## ❓ Problem Statement

Determining whether water is suitable for drinking, domestic use, irrigation, or industrial applications requires analyzing multiple physical and chemical parameters. Manual assessment is time-consuming, costly, and requires expert knowledge.

This project addresses this challenge by developing an intelligent Machine Learning system capable of automatically classifying water usage based on water quality parameters, helping users make faster and more informed decisions.

---

## 🎯 Objectives

- Analyze water quality using multiple parameters.
- Predict the most suitable water usage category.
- Calculate Water Quality Index (WQI).
- Display prediction confidence.
- Provide water resource guidelines and recommendations.
- Develop an interactive and user-friendly web application.

---

# 💧 Water Usage Categories

The model predicts one of the following classes:

- 🥤 Drinking
- 🏠 Domestic
- 🌾 Irrigation
- 🏭 Industrial
- ❌ No Use

---

# 📊 Dataset Features

### Chemical Parameters

- pH
- Total Dissolved Solids (TDS)
- Turbidity
- Dissolved Oxygen (DO)
- Biological Oxygen Demand (BOD)
- Chemical Oxygen Demand (COD)
- Nitrate

### Environmental Parameters

- Fluoride
- Hardness
- Electrical Conductivity (EC)
- Temperature
- Rainfall
- Water Source
- Season

### Derived Feature

- Water Quality Index (WQI)

---

# 📈 Exploratory Data Analysis (EDA)

The following analyses were performed:

- Dataset Overview
- Missing Value Analysis
- Duplicate Record Detection
- Unique Value Analysis
- Statistical Summary
- Distribution of Water Usage Categories
- Distribution of Water Sources
- Seasonal Distribution
- Average TDS by Water Usage
- Average WQI by Season
- Correlation Heatmap
- Boxplots for Outlier Detection

---

# 🤖 Machine Learning Model

## Algorithm Used

**Random Forest Classifier**

### Why Random Forest?

- High prediction accuracy
- Supports multiclass classification
- Reduces overfitting
- Handles nonlinear relationships
- Works well with numerical and encoded categorical features
- Provides prediction probabilities

---

# ⚙ Hyperparameter Tuning

Hyperparameters were optimized using **GridSearchCV**.

### Best Parameters

```python
{
    'criterion': 'entropy',
    'max_depth': None,
    'min_samples_leaf': 2,
    'min_samples_split': 5,
    'n_estimators': 150
}
```

---

# 🛠 Technologies Used

## Programming Language

- Python

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Flask

## Machine Learning

- Scikit-learn

## Data Processing

- Pandas
- NumPy

## Data Visualization

- Matplotlib
- Seaborn

## Model Serialization

- Pickle

---

# 🌐 Website Modules

## 🏠 Home

- Project introduction
- Overview of HydroGuard AI
- Navigation to Prediction page

---

## 🔍 Predict

Users enter:

- Water Quality Parameters
- Environmental Factors

The application sends the data to the Machine Learning model for prediction.

---

## 📊 Dashboard

Displays:

- Predicted Water Usage
- Water Quality Index (WQI)
- Prediction Confidence
- Resource Guidelines
- Treatment Recommendations

---

## ℹ About

Contains

- Project Overview
- Methodology
- Dataset Information
- Machine Learning Workflow

---

## 📞 Contact

Allows users to send queries or feedback.

---

# 🔄 Machine Learning Workflow

```
Water Quality Dataset
        │
        ▼
Data Cleaning
        │
        ▼
Exploratory Data Analysis
        │
        ▼
Feature Selection
        │
        ▼
Label Encoding
        │
        ▼
Train-Test Split (80:20)
        │
        ▼
Random Forest Classifier
        │
        ▼
GridSearchCV
        │
        ▼
Model Evaluation
        │
        ▼
Save Model (.pkl)
        │
        ▼
Flask Backend
        │
        ▼
Web Application
```

---

# 🌍 Website Workflow

```
User
   │
   ▼
Home Page
   │
   ▼
Prediction Page
   │
   ▼
Enter Water Parameters
   │
   ▼
Click Predict
   │
   ▼
Flask Backend
   │
   ▼
Load Random Forest Model
   │
   ▼
Predict Water Usage
   │
   ▼
Calculate WQI
   │
   ▼
Dashboard
   │
   ▼
Prediction + Recommendations
```

---

# 📁 Project Structure

```
HydroGuard-AI/
│
├── static/
│   ├── css/
│   ├── js/
│   ├── images/
│
├── templates/
│   ├── index.html
│   ├── predict.html
│   ├── dashboard.html
│   ├── about.html
│   └── contact.html
│
├── model/
│   ├── random_forest_model.pkl
│   ├── label_encoders.pkl
│
├── dataset/
│   └── water_quality_dataset.csv
│
├── app.py
├── requirements.txt
└── README.md
```

---

# 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/HydroGuard-AI.git
```

### Move into the Project Folder

```bash
cd HydroGuard-AI
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
python app.py
```

### Open Browser

```
http://127.0.0.1:5000/
```

---

# 📊 Model Performance

| Metric | Value |
|----------|--------|
| Algorithm | Random Forest |
| Classification | Multiclass |
| Train-Test Split | 80 : 20 |
| Hyperparameter Tuning | GridSearchCV |
| Test Accuracy | ~75% |

---

# 🌍 Applications

- Water Treatment Plants
- Municipal Water Supply
- Smart Water Management
- Environmental Monitoring
- Agriculture
- Industrial Water Quality Monitoring
- Pollution Control Boards
- Academic Research

---

# 🚀 Future Enhancements

- IoT Sensor Integration
- Real-Time Water Monitoring
- Mobile Application
- Cloud Deployment
- GIS-Based Water Mapping
- Automatic Water Quality Reports
- Historical Trend Analysis
- AI-Based Recommendation System

---

# 📸 Website Preview

### Home Page

- Modern AI-inspired interface
- Interactive navigation
- Water-themed animations

### Prediction Page

- Input water quality parameters
- Environmental parameter selection
- Instant prediction

### Dashboard

- Water Usage Prediction
- WQI Meter
- Prediction Confidence
- Resource Guidelines
- Treatment Recommendations

---

# 👩‍💻 Author

**Bhuvana Nagarajan**

**B.Tech – Artificial Intelligence and Data Science**

Hindusthan Institute of Technology

Coimbatore, Tamil Nadu

---

# Tools snd libraries used

- Scikit-learn
- Flask
- Pandas
- NumPy
- Matplotlib
- Seaborn

---

# 📄 License

This project is developed for **academic and educational purposes** as a Final Year B.Tech Project.

---

# ⭐ Project Summary

HydroGuard AI is an intelligent Machine Learning web application that predicts the most appropriate usage of water using a **Random Forest Classifier** trained on water quality parameters. The system calculates the **Water Quality Index (WQI)**, predicts **Drinking**, **Domestic**, **Industrial**, **Irrigation**, or **No Use**, and presents the results through an interactive dashboard with prediction confidence and practical recommendations.

This project demonstrates the integration of **Machine Learning**, **Data Analysis**, and **Flask Web Development** to build a practical solution for smart water resource management.
