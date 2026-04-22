# 🚀 LearnPath

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-orange)](LICENSE)

**LearnPath** is an AI-powered placement preparation platform that generates personalized learning paths, adaptive quizzes, and intelligent study plans for top tech companies. Using advanced ML algorithms and recommendation systems, LearnPath helps students identify skill gaps and achieve optimal interview readiness.

---

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation-and-setup)
- [Configuration](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Usage Workflow](#-sample-workflow)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

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
* Recommendation engine for personalized content delivery.

### 📊 Progress Tracking Dashboard

* Monitor learning progress and quiz performance.
* Visualize improvements through interactive analytics and charts.
* Real-time skill gap assessment and tracking.

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
LearnPath-1/
│
├── backend/                      # Node.js & Express API
│   ├── routes/                   # API route handlers
│   ├── controllers/              # Business logic controllers
│   ├── models/                   # MongoDB Mongoose models
│   ├── services/                 # Business services & ML integration
│   ├── middleware/               # Authentication & error handling
│   ├── algorithms/               # Core algorithms (topological sort, scheduling)
│   ├── data/                     # Mock data (companies, questions, resources)
│   ├── config/                   # Database configuration
│   └── server.js                 # Express server entry point
│
├── Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (local or Atlas cloud)
- **Git**
- **npm** or **yarn** package manager

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Siri-2809/LearnPath.git
cd LearnPath-1
```

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Seed initial data
npm run seed

# Start development server
npm start
# or for development with hot-reload
npm run dev
```

**Backend runs on:** `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

---

### 4️⃣ ML Service Setup

```bash
cd ml-service

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
# or with specific host/port
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**ML Service runs on:** `http://localhost:8000
### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run seed
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

### Core Endpoints   | Description                         | Auth |
| ------ | -------------------------------- | ----------------------------------- | ---- |
| GET    | `/api/companies`                 | Fetch all companies                | ❌   |
| GET    | `/api/resources`                 | Fetch study materials              | ❌   |
| GET    | `/api/resources?company=:id`     | Fetch resources for company        | ❌   |
| POST   | `/api/auth/register`             | Register a new user                | ❌   |
| POST   | `/api/auth/login`                | User login                         | ❌   |
| GET    | `/api/users/profile`             | Get user profile                   | ✅   |
| GET    | `/api/quiz/:company`             | Get company-specific quiz          | ✅   |
| POST   | `/api/quiz/submit`               | Submit quiz results                | ✅   |
| GET    | `/api/learning-path/:company`    | Generate personalized learning path| ✅   |
| POST   | `/api/study-plan`                | Generate study plan                | ✅   |
| GET    | `/api/study-plan/:id`            | Get user study plan                | ✅

### Backend (`backend/.env`)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Registration & Authentication                           │
│    User creates account and logs in with JWT token         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 2. Company Selection                                         │
│    Choose target company (Google, Microsoft, TCS, etc.)    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 3. Diagnostic Quiz Assessment                              │
│    ML model evaluates skill levels across CS subjects      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 4. Skill Gap Analysis                                       │
│    Decision Trees identify strengths & weaknesses          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 5. Personalized Learning Path                              │
│    Topological sort creates prerequisite-based roadmap     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 6. Intelligent Study Plan                                  │
│    Scheduling algorithm generates day-wise timetable       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 7. Resource Recommendations                                │
│    Cosine similarity finds best study materials            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 8. Progress Tracking                                       │
│    Dashboard displays analytics & performance metrics      │
└─────────────────────────────────────────────────────────────┘
```
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
🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Solution: Ensure MongoDB is running locally or update MONGO_URI in .env
Command: mongod  # Start MongoDB locally
```

**Port Already in Use**
```
Backend: Change PORT in backend/.env
Frontend: PORT=3001 npm start
ML Service: uvicorn main:app --port 8001 --reload
```

**Module Not Found Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python
pip install --upgrade -r requirements.txt
```

**ML Service Connection Issue**
```
Ensure ML_SERVICE_URL in backend/.env points to running ML service
Check CORS settings if frontend can't reach backend/ML service
```

---

## 🌟 Future Enhancements

- 🔤 Resume Analyzer using NLP for skill extraction
- 🤖 AI Interview Chatbot for mock interviews
- 🔗 Integration with LeetCode and HackerRank APIs
- 🏆 Gamification with leaderboards and badges
- 🐳 Docker & Kubernetes deployment setup
- 📈 Real-time performance prediction model
- 📱 Mobile app (React Native)
- 💬 WebSocket integration for real-time notifications

---

## 📖 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and commit: `git commit -m "Add feature X"`
4. **Push to your fork**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** with a clear description
6. **Follow the code style** and add tests if applicable

### Code Style Guidelines

- **Backend**: Use ES6+ standards, follow Express best practices
- **Frontend**: Use functional components, React hooks, and follow Airbnb style guide
- **Python**: Follow PEP 8 conventions

---

## 📜 License

This project is developed for **academic and educational purposes**. You are free to use and modify it with proper attribution.

Licensed under the **MIT License** - see LICENSE file for details.

---

## 🤝 Support & Contact

For questions or issues:
- Open an issue on [GitHub Issues](https://github.com/Siri-2809/LearnPath/issues)
- Check existing [documentation](docs/api-documentation.md)
- Review [project report](docs/) for detailed information

---

## ⭐ Acknowledgements

Special thanks to these amazing resources:

* [GeeksforGeeks](https://www.geeksforgeeks.org/) - Algorithm concepts
* [LeetCode](https://www.leetcode.com/) - DSA problems
* [NPTEL](https://nptel.ac.in/) - Educational content
* [Scikit-learn Documentation](https://scikit-learn.org/)
* [MongoDB Documentation](https://docs.mongodb.com/)
* [React Documentation](https://react.dev/)
* [Express.js Guide](https://expressjs.com/)

---

### 🚀 Empowering Students for Smarter Placements with LearnPath

**Made with ❤️ for campus placements**
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
