# Nexgile-MediOracle Healthcare Workforce Portal

An end-to-end healthcare workforce demand, shift execution, and intelligence portal built with **React**, **Python (Django 4.2 LTS)**, **Django REST Framework**, and **SQLite**, designed strictly to the functional specifications for healthcare facilities, registered professionals, and agency operations.

---

## 🚀 Quick Start (One-Click Launch)

Double-click `run_app.bat` in the root folder:
```bat
run_app.bat
```
This will:
1. Start the **Django REST API** on `http://127.0.0.1:8000`
2. Start the **React (Vite) Frontend** on `http://localhost:5173`
3. Automatically open `http://localhost:5173` in your browser.

---

## 🔑 Demo Role Accounts (1-Click Login Supported)

You can click any of the **Instant 1-Click Demo Login** buttons on the login page:

| Role | Username | Password | Organization / Description |
| :--- | :--- | :--- | :--- |
| **Hospital Ward Leader** | `facility_manager` | `password123` | St. Vincent's University Hospital (ICU Ward Director) |
| **Registered ICU Nurse** | `nurse_aoife` | `password123` | Aoife Murphy, RGN (NMBI #948201 Verified) |
| **Agency Administrator** | `agency_admin` | `password123` | MediOracle Agency Operations HQ |

---

## 📋 Core Modules Implemented

1. **🏥 Facility Floor & Staffing Command**
   - Real-time ward staffing ratios (Required vs. Confirmed)
   - Risk status badges (**Green** Optimal / **Yellow** Deficit / **Red** Critical Shortage)
   - "Post Urgent Shift" modal with role, ward, acuity, hourly rate, and bonus incentive
   - Live shift postings and execution lifecycle

2. **🩺 Healthcare Professional Portal**
   - Location-aware shift feed sorted by commute distance, rate, and specialty fit
   - 1-click apply and instant booking confirmation
   - **GPS Geofence Clock-In/Clock-Out Simulator** with live status tracking
   - Automated digital timesheet submission
   - **Instant Pay Wallet**: Request immediate SEPA instant payout for completed shifts

3. **🤖 Intelligent AI Matching & Scheduling**
   - Algorithmic candidate ranking (0–99% match score)
   - Multi-criteria weighted scoring: Commute proximity, active NMBI license, clinical specialty experience, reliability & rating history, and Working Time Directive rest compliance
   - Transparent **Decisive Factors breakdown** explaining why each candidate is scored
   - 1-click **"Dispatch Direct Offer"**
   - Predictive demand forecasting for time-to-fill and recommended incentive bonuses

4. **🛡️ Compliance, NMBI & Credentials Passport**
   - Pre-confirmation validation for NMBI PIN, Garda Vetting, BLS/ACLS resuscitation, and mandatory HSE training
   - 30/60/90-day expiry countdown alerts
   - Automated restriction enforcement for expired credentials

5. **⏱️ Digital Timesheets, Sign-Off & Billing**
   - Clinical Director digital sign-off and approval queue
   - Hours breakdown (Regular + Overtime + Incentive Bonuses)
   - Consolidated facility invoices with payment aging status (Paid, Net 30 Pending, Overdue)

6. **📈 Agency Executive Analytics**
   - Key operational KPIs: Fill Rate %, Open Requisitions, Avg Time to Fill, Gross Agency Margin %, and Total Clinical Spend
   - **Emergency Shortage Dispatch**: One-click broadcast to all available nurses in the region

---

## 🛠️ Manual Start (Optional)

### Backend (Django)
```bash
cd backend
python manage.py migrate
python seed_data.py          # (Initializes database with sample data)
python manage.py runserver 8000
```

### Frontend (React)
```bash
cd frontend
npm install                 # (Already installed)
npm run dev
```
