# PhishNet AI

PhishNet AI is a web-based phishing detection system with:

- a public-facing frontend in `public/`
- a Node.js backend in `backend/`
- a Python machine learning service in `ai-service/`

## Project Structure

```text
AiPhisingDetection/
├─ app.js
├─ package.json
├─ package-lock.json
├─ public/
│  ├─ index.html
│  ├─ assistant.html
│  ├─ login.html
│  ├─ signup.html
│  └─ assets/
│     ├─ css/
│     ├─ images/
│     └─ js/
├─ backend/
│  ├─ server.js
│  ├─ constants/
│  ├─ services/
│  └─ utils/
└─ ai-service/
   ├─ app.py
   ├─ train_model.py
   ├─ requirements.txt
   ├─ data/
   └─ model/
```

## Local Run

Start the Python AI service:

```powershell
python ai-service/app.py
```

Start the Node.js app:

```powershell
node app.js
```

Open the site in your browser:

```text
http://localhost:3000
```
