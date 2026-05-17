# 🩸 Blood Donor Finder

> A full-stack web application that connects patients in urgent need of blood with registered donors nearby — matching by blood type and city, with real-time email alerts and one-click donor confirmation.

![Tech Stack](https://img.shields.io/badge/Django-4.2-green?style=flat-square&logo=django)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Flow](#-system-flow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Gmail SMTP Configuration](#gmail-smtp-configuration)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🔍 Overview

Blood Donor Finder solves a critical real-world problem: when a patient urgently needs blood, finding a compatible nearby donor is a race against time. This platform:

- Lets donors **register once** with their blood type and city
- Lets patients or families **post an urgent blood request**
- **Automatically matches** donors by blood type and city
- **Sends email alerts** to all matched donors instantly
- Shares the **donor's contact details** with the requester only after the donor confirms availability

No middlemen. No manual searching. Direct, privacy-respecting contact.
<p align="center">
<img width="1919" height="908" alt="Screenshot 2026-05-18 003305" src="https://github.com/user-attachments/assets/27cba990-e1b4-4302-a5a0-876a83f815cf" />

<img width="1918" height="888" alt="image" src="https://github.com/user-attachments/assets/2ac5f95e-8247-4d1f-be6e-f3ab7df6aac3" />


  <img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/4935cff3-34e0-40af-a928-2c82ddcce6ee" />

</p>


## ✨ Features

| Feature | Description |
|---|---|
| Donor Registration | Register with name, email, phone, blood type, and city |
| Blood Request Posting | Post urgent requests with patient and hospital info |
| Smart Matching | Filters donors by exact blood type + city (case-insensitive) |
| Email Alerts | Gmail SMTP alerts sent to all matched available donors |
| One-Click Confirmation | Unique token-based link in email for donor to confirm |
| Contact Sharing | Requester receives donor details only after confirmation |
| Active Requests Feed | Browse all currently pending blood requests |
| Admin Panel | Django admin for full data management |

---

## 🛠 Tech Stack

**Backend**
- Python 3.11
- Django 4.2
- Django REST Framework 3.15
- MySQL 8.0
- Django CORS Headers

**Frontend**
- React 18
- Vite
- React Router DOM v6
- Axios

**Email**
- Gmail SMTP via Django's built-in email backend

---

## 🔄 System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Donor registers (blood type + city)                       │
│          │                                                  │
│          ▼                                                  │
│   Patient posts urgent blood request                        │
│          │                                                  │
│          ▼                                                  │
│   System queries: blood_type match + city match             │
│          │                                                  │
│          ▼                                                  │
│   Email sent to each matched donor                          │
│   (unique confirmation link per donor)                      │
│          │                                                  │
│          ▼                                                  │
│   Donor clicks "I'm Available" link                         │
│          │                                                  │
│          ▼                                                  │
│   DonorNotification marked confirmed                        │
│   Request status → fulfilled                                │
│          │                                                  │
│          ▼                                                  │
│   Requester receives donor contact details via email        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
blood-donor-finder/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                        # Environment variables (not committed)
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   └── urls.py
│   └── core/
│       ├── migrations/
│       ├── __init__.py
│       ├── models.py               # Donor, BloodRequest, DonorNotification
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── email_service.py        # Gmail SMTP logic
│       └── admin.py
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios base config
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── BloodRequestCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── RegisterDonor.jsx
    │   │   ├── RequestBlood.jsx
    │   │   └── Confirmation.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js 18+
- MySQL 8.0
- Git

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/blood-donor-finder.git
cd blood-donor-finder/backend

# 2. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create MySQL database
# Open MySQL shell and run:
CREATE DATABASE blood_donor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5. Create your .env file (see Environment Variables section)

# 6. Run migrations
python manage.py makemigrations
python manage.py migrate

# 7. Create superuser for admin panel
python manage.py createsuperuser

# 8. Start the development server
python manage.py runserver
```

Backend will be live at: `http://localhost:8000`
Admin panel at: `http://localhost:8000/admin`

---

### Frontend Setup

```bash
# From the project root
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

### Gmail SMTP Configuration

This project uses Gmail's SMTP server for sending email alerts. To set it up:

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords** → Select app: Mail → Generate
4. Copy the 16-character app password
5. Paste it as `EMAIL_HOST_PASSWORD` in your `.env` file

> ⚠️ Never use your actual Gmail password. Always use an App Password.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
SECRET_KEY=your-django-secret-key-here

DB_NAME=blood_donor_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

EMAIL_HOST_USER=yourgmail@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password

FRONTEND_URL=http://localhost:5173
```

> `.env` is listed in `.gitignore` and should **never** be committed to version control.

---

## 📡 API Reference

Base URL: `http://localhost:8000/api/`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/donors/register/` | Register a new donor |
| `POST` | `/requests/create/` | Post an urgent blood request + trigger alerts |
| `GET` | `/requests/active/` | List all pending blood requests |
| `GET` | `/confirm/<uuid:token>/` | Donor confirms availability via email link |

---

### POST `/donors/register/`

**Request Body:**
```json
{
  "name": "Ali Hassan",
  "email": "ali@example.com",
  "phone": "03001234567",
  "blood_type": "B+",
  "city": "Lahore"
}
```

**Response:**
```json
{
  "message": "Registered successfully! You will be notified when someone needs your blood type."
}
```

---

### POST `/requests/create/`

**Request Body:**
```json
{
  "requester_name": "Sara Khan",
  "requester_email": "sara@example.com",
  "requester_phone": "03009876543",
  "patient_name": "Ahmed Khan",
  "blood_type": "B+",
  "city": "Lahore",
  "hospital": "Services Hospital Lahore",
  "notes": "Needed urgently for surgery tomorrow"
}
```

**Response:**
```json
{
  "message": "Request posted. 3 donor(s) notified in Lahore.",
  "request_id": 7,
  "donors_notified": 3
}
```

---

### GET `/confirm/<token>/`

Called when donor clicks their email confirmation link.

**Response (on first confirmation):**
```json
{
  "message": "Thank you! The requester has been notified with your contact details.",
  "data": {
    "token": "uuid-here",
    "donor_name": "Ali Hassan",
    "blood_type": "B+",
    "city": "Lahore",
    "hospital": "Services Hospital Lahore",
    "is_confirmed": true
  }
}
```

---

## 🗃 Database Models

### Donor
| Field | Type | Description |
|---|---|---|
| `name` | CharField | Full name |
| `email` | EmailField (unique) | Contact email |
| `phone` | CharField | Phone number |
| `blood_type` | CharField | One of 8 blood types |
| `city` | CharField | City of residence |
| `is_available` | BooleanField | Available for donation |
| `registered_at` | DateTimeField | Auto timestamp |

### BloodRequest
| Field | Type | Description |
|---|---|---|
| `requester_name` | CharField | Person posting the request |
| `requester_email` | EmailField | Where donor contacts are sent |
| `patient_name` | CharField | Patient needing blood |
| `blood_type` | CharField | Required blood type |
| `city` | CharField | City of the hospital |
| `hospital` | CharField | Hospital name |
| `status` | CharField | pending / fulfilled / expired |
| `created_at` | DateTimeField | Auto timestamp |

### DonorNotification
| Field | Type | Description |
|---|---|---|
| `donor` | FK → Donor | The alerted donor |
| `blood_request` | FK → BloodRequest | The linked request |
| `token` | UUIDField (unique) | One-time confirmation token |
| `is_confirmed` | BooleanField | Whether donor confirmed |
| `notified_at` | DateTimeField | When email was sent |
| `confirmed_at` | DateTimeField | When donor confirmed |

---

## 🔮 Future Improvements

- [ ] SMS alerts via Twilio for donors without email access
- [ ] Blood type compatibility matching (not just exact match)
- [ ] Donor availability toggle from a personal dashboard
- [ ] Google Maps integration to show nearby hospitals
- [ ] Request expiry via Celery scheduled task (auto-expire after 24h)
- [ ] OTP-based donor identity verification
- [ ] Mobile app with push notifications (React Native)
- [ ] Analytics dashboard for admin (requests per city, response rates)

---

## 👩‍💻 Author

**Ishna**
Final Year Software Engineering Student — COMSATS University Islamabad, Sahiwal Campus
Batch 2022–2026

Built with Django + React + MySQL as an academic and portfolio project.

---

> *"Every donor is someone's lifeline. This platform just makes finding them faster."*
