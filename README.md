# PhishNet AI

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-F7DF1E?logo=javascript&logoColor=000)
![Status](https://img.shields.io/badge/Status-Active%20Development-0A7C86)

PhishNet AI is a web-based phishing detection and awareness system built for students. It includes a suspicious link scanner, an AI assistant, phishing awareness quizzes, badges, a leaderboard, and user progress tracking.

## Live Project

- Frontend: `https://pishnetai.vercel.app/`
- Repository: `https://github.com/R3ym0nd0/PishNetAI`

## What This Project Does

PhishNet AI is not just a simple URL checker. It helps users:

- scan suspicious links
- ask phishing-related questions
- learn through quizzes
- track quiz progress and badges

The scanner uses several layers:

- URL validation
- webpage analysis
- rule-based and heuristic checks
- Python AI phishing prediction
- Google Safe Browsing checks
- local phishing dataset checks using `verified_online.csv`

## Main Features

### Main Page

- suspicious URL scanner
- guided walkthrough
- feature section
- anti-phishing reminders
- feedback form

### Quiz Page

- phishing awareness quiz sets
- guest and signed-in quiz access
- quiz history for signed-in users
- badges and rank progress
- leaderboard and public profile view

### AI Assistant

- answers phishing-related questions
- helps explain suspicious links and scams
- supports saved chats for signed-in users

### Account Features

- sign up, sign in, and reset password
- profile note / About You
- awareness rank and progress
- earned points and performance stats

## Tech Stack

### Frontend

- HTML
- CSS
- Vanilla JavaScript

### Backend

- Node.js
- Express
- PostgreSQL

### AI and Detection

- Python Flask AI service
- trained phishing model in `ai-service/model/phishing_model.joblib`
- Google Safe Browsing
- local phishing dataset check
- Llama 3.1 8B Instant for the assistant

## Project Structure

```text
AiPhisingDetection/
|-- app.js
|-- package.json
|-- package-lock.json
|-- public/
|   |-- index.html
|   |-- assistant.html
|   |-- login.html
|   |-- signup.html
|   |-- reset-password.html
|   |-- quiz.html
|   |-- terms.html
|   `-- assets/
|       |-- css/
|       |-- images/
|       `-- js/
|-- backend/
|   |-- server.js
|   |-- constants/
|   |-- services/
|   |-- utils/
|   `-- db/
|-- ai-service/
|   |-- app.py
|   |-- train_model.py
|   |-- requirements.txt
|   |-- data/
|   `-- model/
|-- top-1m.csv
`-- verified_online.csv
```

## Local Setup

### 1. Install Node dependencies

```powershell
npm install
```

### 2. Install Python dependencies

```powershell
pip install -r ai-service/requirements.txt
```

### 3. Set environment variables

Common backend environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- `AI_SERVICE_URL`
- `SAFE_BROWSING_API_KEY`

### 4. Start the Python AI service

```powershell
python ai-service/app.py
```

### 5. Start the Node.js app

```powershell
node app.js
```

### 6. Open the project

```text
http://localhost:3000
```

## Model Training

To retrain the phishing model:

```powershell
python ai-service/train_model.py
```

This updates:

- `ai-service/model/phishing_model.joblib`

## Scanner Notes

The scanner does not rely on only one signal. It combines:

- visible webpage checks
- AI model prediction
- browser-style reputation lookup
- local phishing dataset matching

This makes the result more explainable, but it still has limitations. Some websites use unusual structures, third-party forms, or anti-bot protections that can affect the scan result.

## Deployment Notes

The project can be deployed with separate services for:

- frontend
- Node backend
- Python AI service

Recommended health endpoints:

- Node backend: `/health`
- Python AI service: `/health`

## Notes

- Safe Browsing is optional, but it improves dangerous-site detection.
- The local phishing dataset check works without an extra API call.
- The scanner AI and assistant AI are different parts of the system.

## License

This project is currently maintained as an academic / thesis-style system.
