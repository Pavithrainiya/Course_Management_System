# 🎓 CourseHub — Full-Stack Course & Learning Management System (LMS)

[![Django REST Framework](https://img.shields.io/badge/Backend-Django_5.0_REST_Framework-green.svg?logo=django)](https://www.djangoproject.com/)
[![React 18](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB.svg?logo=react)](https://reactjs.org/)
[![JWT Authentication](https://img.shields.io/badge/Security-SimpleJWT_Bearer_Auth-red.svg?logo=jsonwebtokens)](https://jwt.io/)
[![SMTP Live Email](https://img.shields.io/badge/Email-Live_SMTP_Notifications-amber.svg?logo=gmail)](https://mail.google.com/)
[![Vercel Deployment](https://img.shields.io/badge/Frontend_Deploy-Vercel-black.svg?logo=vercel)](https://vercel.com/)
[![Render Deployment](https://img.shields.io/badge/Backend_Deploy-Render-blue.svg?logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A state-of-the-art, glassmorphic Learning Management System (LMS) built with **Django REST Framework**, **React 18**, **Vite**, and **Tailored Glassmorphism CSS Design System**. Features automated SMTP email notifications, AI tutoring, interactive quizzes, QR code certificate verification, and secure OTP password resets.

---

## ✨ Key Features & Capabilities

### 📚 1. Dynamic Course Catalog & Smart Enrollment
- Browse multi-category courses (Python Full-Stack, Database Systems & PostgreSQL, Web Development & React.js, Artificial Intelligence & Machine Learning).
- Instant enrollment with fallback course lookup support (`CourseId: 101, 102, 103, 104`).
- Automatic real-time **SMTP email dispatch** sent to students containing enrollment confirmation, course syllabus, official mission briefing, and video lecture links.

### 📝 2. Interactive Quiz Engine & Certificate Integrity
- Dynamic multi-question quizzes with immediate scoring, detailed explanation feedback, and pass/fail thresholds.
- **Strict Certificate Guard**: Quiz attempts with **0% score** are strictly blocked from generating certificates or displaying claim buttons.
- Verifiable **QR Code Certificate Generation** with Admin Approval Workflows.

### 🔒 3. OTP Password Reset & Secure Auth
- **Forgot / Reset Password Modal** directly on the Login page (`/login`) and inside the **User Profile Drawer**.
- Instant 6-digit OTP verification codes generated and sent to user email addresses via live SMTP (`pavijeevi56@gmail.com`).
- 30-day JWT Bearer Token authorization with automatic Axios silent token refresh interceptors.

### 🤖 4. AI Learning Assistant & Tutor (RAG Engine)
- Integrated Context-Aware AI Learning Assistant providing course summaries, database tips, React state explanations, machine learning fundamentals, and practice quiz questions.

### 📊 5. Comprehensive Analytics & Data Export
- Real-time admin dashboard statistics tracking total courses, enrolled students, completed quizzes, and user metrics.
- One-click **CSV Data Exports** and **Formatted PDF Printing** with automated data-URI fallbacks for pop-up blocked browsers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, React Router DOM |
| **Styling & Design** | Vanilla CSS Glassmorphic Tokens, Aurora Gradients, Cyberpunk Dark Mode |
| **Icons & Visuals** | Lucide React Icon Library |
| **Backend Framework** | Python 3.12, Django 5.x, Django REST Framework (DRF) |
| **Authentication** | SimpleJWT (JSON Web Tokens) Bearer Auth & User Profiles |
| **Database** | PostgreSQL / SQLite3 |
| **Mail Dispatcher** | Django SMTP Email Backend (`smtp.gmail.com:587` with App Passwords) |
| **Frontend Hosting** | Vercel (`vercel.json`) |
| **Backend Hosting** | Render Cloud (`requirements.txt`, Gunicorn) |

---

## 📁 Repository Structure

```text
Course_Management_System/
│
├── README.md                            # Comprehensive Root Documentation
├── .gitignore                           # Git ignore rules for virtualenvs and build artifacts
│
└── Assignment 1/                        # Core Application Directory
    ├── manage.py                        # Django Management CLI
    ├── requirements.txt                 # Backend Python Dependencies for Render
    ├── vercel.json                      # Vercel Deployment Configuration
    ├── db.sqlite3                       # Local SQLite Database
    │
    ├── Admin_Panel/                     # Django App for APIs, Models & Serializers
    │   ├── models.py                    # Database Schemas (Course, Student, Quiz, Certificate)
    │   ├── views_api.py                 # REST API Views & AI Tutor Logic
    │   ├── utils_email.py               # Robust SMTP Mail Dispatcher
    │   ├── serializers.py               # DRF Serializers
    │   └── urls.py                      # API Endpoints Router
    │
    ├── Django_Project/                  # Core Django Settings & JWT Config
    │   ├── settings.py                  # Environment & Email Configuration
    │   └── urls.py                      # Global URL Routing
    │
    └── frontend/                        # React + Vite Frontend Application
        ├── package.json                 # Node Dependencies
        ├── vite.config.js               # Vite Development Server Config
        ├── src/
        │   ├── components/              # Reusable UI Components (Navbar, Drawer, Modals)
        │   ├── pages/                   # Application Views (Dashboard, Catalog, Portal, Detail, Login)
        │   ├── services/                # Axios API Client & Interceptors
        │   └── index.css                # Slate-Grey Glassmorphism Design System Tokens
```

---

## 🚀 Quick Start & Local Setup Guide

### 1. Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18.x or higher
- **Git**

### 2. Backend Setup (Django REST API)

```bash
# Navigate to the core project directory
cd "Assignment 1"

# Create and activate a Python virtual environment
python -m venv myenv
# On Windows PowerShell:
.\myenv\Scripts\Activate.ps1
# On macOS/Linux:
# source myenv/bin/activate

# Install required packages
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Django development server on port 8000
python manage.py runserver 8000
```
Backend server will start running at `http://localhost:8000/`.

---

### 3. Frontend Setup (React + Vite)

```bash
# Open a new terminal tab and navigate to frontend
cd "Assignment 1/frontend"

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Frontend application will start running at `http://localhost:5173/`.

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | User Login & JWT Token Generation | ❌ No |
| `POST` | `/api/auth/register/` | Student Account Registration | ❌ No |
| `POST` | `/api/auth/token/refresh/` | Silent Access Token Refresh | ❌ No |
| `POST` | `/api/auth/forgot-password/` | Send 6-digit OTP reset code via SMTP | ❌ No |
| `POST` | `/api/auth/reset-password/` | Verify OTP code & reset password | ❌ No |
| `GET` | `/api/courses/` | Retrieve catalog of active courses | ❌ No |
| `POST` | `/api/enrollments/` | Enroll student & dispatch email | 🔒 Yes |
| `GET` | `/api/student-portal/enrollments/` | Fetch current student's enrollments | 🔒 Yes |
| `POST` | `/api/quizzes/<id>/submit/` | Submit quiz attempt & compute score | 🔒 Yes |
| `POST` | `/api/certificates/generate/` | Request QR certificate (Score > 0%) | 🔒 Yes |
| `POST` | `/api/ai-assistant/` | Query RAG AI Learning Tutor | ❌ No |

---

## 🌐 Deployment Instructions

### Deploying Frontend to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Select repository **`Pavithrainiya/Course_Management_System`**.
3. Set **Root Directory** to `Assignment 1/frontend`.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Click **Deploy**.

### Deploying Backend to Render
1. Log into your [Render Dashboard](https://render.com/) and create a new **Web Service**.
2. Select repository **`Pavithrainiya/Course_Management_System`**.
3. Set **Root Directory** to `Assignment 1`.
4. Set **Build Command** to `pip install -r requirements.txt && python manage.py migrate`.
5. Set **Start Command** to `gunicorn Django_Project.wsgi:application`.
6. Add Environment Variable `EMAIL_HOST_PASSWORD` with your Gmail App Password.
7. Click **Create Web Service**.

---

## 👤 Author & Acknowledgments

- **Developer / Maintainer**: [Pavithra K (Pavithrainiya)](https://github.com/Pavithrainiya)
- **Email Contact**: `pavijeevi56@gmail.com`
- **Repository**: [Course_Management_System](https://github.com/Pavithrainiya/Course_Management_System)

---
*Built with ❤️ for excellence in modern full-stack web education.*
