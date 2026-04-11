# 🚀 LearnPath

**LearnPath** is a company-specific placement preparation platform designed to help students prepare effectively for top tech companies. It leverages Artificial Intelligence, Machine Learning, and recommendation systems to generate personalized learning paths, adaptive quizzes, and structured study plans tailored to individual skill levels and industry requirements.

---

## 📌 Project Overview

LearnPath assists students in preparing for campus placements by aligning their preparation with the expectations of target companies such as:

* **TCS**
* **Infosys**
* **Google**
* **Microsoft**
* **Amazon**

The platform evaluates a student's knowledge, identifies skill gaps, and generates customized learning paths and study schedules to maximize placement success.

---

## ✨ Key Features

### 🎯 Company-Specific Preparation

* Select a target company to receive tailored preparation guidance.
* Subjects and quizzes are aligned with industry hiring standards.

### 🧠 Diagnostic Quiz & Skill Gap Analysis

* Assess proficiency in core Computer Science subjects.
* Identify strengths and weaknesses using AI/ML techniques.

### 🗺️ Personalized Learning Path

* Determines **what to study** based on company requirements.
* Uses topological sorting to ensure prerequisite-based sequencing.

### 📅 Intelligent Study Plan

* Generates a day-wise timetable.
* Prioritizes weak areas and recommends relevant resources.

### 🤖 Machine Learning Integration

* Decision Trees and Random Forests for skill-gap analysis.
* Cosine similarity for study material recommendations.

### 📊 Progress Tracking Dashboard

* Monitor learning progress and quiz performance.
* Visualize improvements through analytics and charts.

---

## 🧩 Learning Path vs. Study Plan

| Feature   | Learning Path                          | Study Plan                        |
| --------- | -------------------------------------- | --------------------------------- |
| Purpose   | Defines **what to study**              | Defines **when to study**         |
| Basis     | Company requirements and prerequisites | Quiz performance and availability |
| Algorithm | Topological Sorting                    | Scheduling Algorithm              |
| Output    | Ordered list of topics                 | Day-wise timetable with resources |

---

## 🏗️ System Architecture

```
React Frontend
       │
       ▼
Node.js + Express Backend
       │
       ├──────────────► MongoDB Database
       │
       ▼
Python ML Microservice (FastAPI/Flask)
```

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Axios**
* **React Router**
* **Chart.js**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**

### Machine Learning

* **Python**
* **Scikit-learn**
* **Pandas & NumPy**
* **FastAPI / Flask**

### Tools & Platforms

* **MongoDB Atlas**
* **Postman**
* **Git & GitHub**
* **VS Code**
* **Render / Vercel**

---

## 📁 Project Structure

```
LearnPath-AI/
│
├── backend/        # Node.js & Express API
├── frontend/       # React Application
├── ml-service/     # Python ML Microservice
├── docs/           # Project Documentation
└── README.md
```

---

## ⚙️ Installation and Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/LearnPath-AI.git
cd LearnPath-AI
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 4️⃣ ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔐 Environment Variables

Create `.env` files in each module using the provided examples.

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnpath
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```
REACT_APP_API_URL=http://localhost:5000/api
```

### ML Service (`ml-service/.env`)

```
HOST=127.0.0.1
PORT=8000
```

---

## 📡 API Endpoints

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| GET    | `/api/companies`              | Fetch all companies              |
| GET    | `/api/quiz/:company`          | Generate company-specific quiz   |
| POST   | `/api/quiz/submit`            | Submit quiz results              |
| GET    | `/api/learning-path/:company` | Generate learning path           |
| POST   | `/api/study-plan`             | Generate personalized study plan |
| GET    | `/api/resources`              | Fetch study materials            |
| POST   | `/api/auth/register`          | Register a user                  |
| POST   | `/api/auth/login`             | User login                       |

---

## 📊 Sample Workflow

1. User registers and logs in.
2. Selects a target company.
3. Takes a diagnostic quiz.
4. Receives a personalized learning path.
5. Gets a daily study plan with recommended resources.
6. Tracks progress via the dashboard.

---

## 📸 Documentation

All project-related diagrams and reports are available in the **docs/** directory:

* `architecture.png`
* `database-schema.png`
* `api-documentation.md`
* `project-report.docx`

---

## 🌟 Future Enhancements

* Resume Analyzer using NLP
* AI Interview Chatbot
* Integration with LeetCode and HackerRank
* Gamification and Leaderboards
* Deployment using Docker and Kubernetes
* Real-time analytics and performance prediction

---

## 📜 License

This project is developed for academic and educational purposes. You are free to use and modify it with proper attribution.

---

## ⭐ Acknowledgements

* GeeksforGeeks
* LeetCode
* NPTEL
* Scikit-learn Documentation
* MongoDB Documentation
* React Documentation

---

### 🚀 Empowering Students for Smarter Placements with LearnPath
