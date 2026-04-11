# 📘 LearnPath API Documentation

This document provides detailed information about the RESTful APIs used in the LearnPath platform. These APIs support company-specific placement preparation, quizzes, learning path generation, study plans, resources, and machine learning integration.

---

## 🌐 Base URLs

| Service                         | URL                         |
| ------------------------------- | --------------------------- |
| **Backend (Node.js & Express)** | `http://localhost:5000/api` |
| **ML Service (Python FastAPI)** | `http://localhost:8000`     |

---

## 📌 Project Workflow

```text
Diagnostic Test → Skill Gap Analysis → Learning Path →
Study Plan → Preparation → Mock Test → Final Evaluation
```

---

## 🔐 Authentication APIs

### 📌 Register User

**Endpoint:** `POST /api/auth/register`
**Description:** Registers a new user.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "targetCompany": "Google"
}
```

#### Response

```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "jwt_token"
}
```

---

### 📌 Login User

**Endpoint:** `POST /api/auth/login`
**Description:** Authenticates a user and returns a JWT.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 📌 Get User Profile

**Endpoint:** `GET /api/auth/profile`
**Access:** Private

#### Headers

```http
Authorization: Bearer <token>
```

---

## 👤 User APIs

### 📌 Get All Users (Admin)

**Endpoint:** `GET /api/users`
**Access:** Private/Admin

### 📌 Update Target Company

**Endpoint:** `PUT /api/users/target-company`
**Access:** Private

#### Request Body

```json
{
  "targetCompany": "Amazon"
}
```

---

## 🏢 Company APIs

### 📌 Get All Companies

**Endpoint:** `GET /api/companies`
**Access:** Public

#### Response

```json
[
  {
    "_id": "1",
    "name": "Google",
    "subjects": ["DSA", "OS", "DBMS", "CN", "Aptitude"]
  }
]
```

---

### 📌 Get Company by Name

**Endpoint:** `GET /api/companies/:name`

**Example:**

```http
GET /api/companies/Google
```

---

## 🧪 Quiz APIs (Diagnostic & Mock Tests)

### 📌 Generate Quiz

**Endpoint:** `GET /api/quiz/:company`
**Access:** Private

#### Query Parameters

| Parameter  | Type   | Description            |
| ---------- | ------ | ---------------------- |
| `testType` | string | `diagnostic` or `mock` |
| `limit`    | number | Number of questions    |

#### Diagnostic Test

```http
GET /api/quiz/Google?testType=diagnostic
Authorization: Bearer <token>
```

#### Mock Test

```http
GET /api/quiz/Google?testType=mock
Authorization: Bearer <token>
```

⚠️ Mock tests are available only after completing the study plan.

#### Response

```json
{
  "success": true,
  "company": "Google",
  "testType": "diagnostic",
  "totalQuestions": 15,
  "questions": []
}
```

---

### 📌 Submit Quiz

**Endpoint:** `POST /api/quiz/submit`
**Access:** Private

#### Request Body

```json
{
  "company": "Google",
  "testType": "diagnostic",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "O(log n)"
    }
  ],
  "timeTaken": 900
}
```

#### Response

```json
{
  "success": true,
  "message": "diagnostic test submitted successfully.",
  "result": {
    "score": 8,
    "percentage": 80,
    "weakSubjects": ["Operating Systems"],
    "strongSubjects": ["Data Structures"]
  }
}
```

---

### 📌 Additional Quiz Endpoints

| Endpoint                         | Description            |
| -------------------------------- | ---------------------- |
| `GET /api/quiz/results`          | Get all quiz results   |
| `GET /api/quiz/results/:company` | Get results by company |
| `GET /api/quiz/latest/:company`  | Get latest result      |
| `GET /api/quiz/result/:id`       | Get result by ID       |

---

## 📚 Learning Path APIs

### 📌 Generate Learning Path

**Endpoint:** `POST /api/learning-path/:company`
**Access:** Private

#### Response

```json
{
  "company": "Amazon",
  "learningPath": [
    "Programming Fundamentals",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "System Design"
  ]
}
```

### 📌 Additional Endpoints

| Endpoint                              | Description            |
| ------------------------------------- | ---------------------- |
| `GET /api/learning-path`              | Get all learning paths |
| `GET /api/learning-path/:company`     | Get path by company    |
| `PUT /api/learning-path/:id/progress` | Update progress        |
| `DELETE /api/learning-path/:id`       | Delete learning path   |

#### Update Progress Request

```json
{
  "progress": 60
}
```

---

## 📅 Study Plan APIs

### 📌 Generate Study Plan

**Endpoint:** `POST /api/study-plan`

#### Request Body

```json
{
  "company": "Google",
  "durationDays": 30,
  "weakSubjects": [
    "Operating Systems",
    "Computer Networks"
  ]
}
```

### 📌 Additional Endpoints

| Endpoint                          | Description           |
| --------------------------------- | --------------------- |
| `GET /api/study-plan`             | Get all study plans   |
| `GET /api/study-plan/:company`    | Get plan by company   |
| `PUT /api/study-plan/:id/session` | Update session status |
| `DELETE /api/study-plan/:id`      | Delete study plan     |

#### Update Session Request

```json
{
  "day": 1,
  "status": "Completed"
}
```

---

## 📖 Resource APIs

### 📌 Endpoints

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/resources`                  | Get all resources        |
| GET    | `/api/resources/subject/:subject` | Get resources by subject |
| GET    | `/api/resources/:id`              | Get resource by ID       |
| POST   | `/api/resources`                  | Create resource (Admin)  |
| PUT    | `/api/resources/:id`              | Update resource (Admin)  |
| DELETE | `/api/resources/:id`              | Delete resource (Admin)  |

#### Query Parameters

| Parameter       | Description            |
| --------------- | ---------------------- |
| subject         | Filter by subject      |
| difficultyLevel | Filter by difficulty   |
| type            | Course, Article, Video |
| company         | Filter by company      |
| search          | Keyword search         |

---

## 🤖 Machine Learning APIs (Python FastAPI)

### 📌 Skill Gap Analysis

**Endpoint:** `POST /skill-gap`

#### Request

```json
{
  "scores": {
    "DSA": 60,
    "DBMS": 75,
    "OS": 40,
    "CN": 50
  }
}
```

#### Response

```json
{
  "weak_subjects": [
    "Operating Systems",
    "Computer Networks"
  ]
}
```

---

### 📌 Resource Recommendation

**Endpoint:** `POST /recommend`

#### Request

```json
{
  "subjects": ["DSA", "OS"]
}
```

#### Response

```json
{
  "recommendations": [
    {
      "subject": "DSA",
      "resource": "GeeksforGeeks - Data Structures"
    }
  ]
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## 🔒 Authentication Format

```http
Authorization: Bearer <your_token>
```

---

## 🧪 Testing Tools

* Postman
* Thunder Client (VS Code)
* cURL
* Swagger (Optional Enhancement)

---

## 🏢 Supported Companies

* TCS
* Infosys
* Google
* Microsoft
* Amazon

---

## 🛠️ Tech Stack

| Layer            | Technology           |
| ---------------- | -------------------- |
| Frontend         | React.js             |
| Backend          | Node.js, Express.js  |
| Database         | MongoDB              |
| Machine Learning | Python, Scikit-learn |
| ML API           | FastAPI              |
| Authentication   | JWT                  |

---

## 👨‍💻 Project Information

| Attribute        | Details                                       |
| ---------------- | --------------------------------------------- |
| **Project Name** | LearnPath                                     |
| **Type**         | Academic Mini Project                         |
| **Purpose**      | Company-Specific Placement Preparation System |
| **Architecture** | MERN Stack with ML Microservice               |
| **Version**      | 1.0.0                                         |
| **Author**       | Your Name                                     |

---

## 🚀 Local Development Setup

### Start Backend

```bash
cd backend
npm install
npm run dev
```

### Start ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📌 Service URLs

| Service     | URL                                                    |
| ----------- | ------------------------------------------------------ |
| Backend API | [http://localhost:5000/api](http://localhost:5000/api) |
| ML Service  | [http://localhost:8000](http://localhost:8000)         |

---

© 2026 LearnPath. All Rights Reserved.

---
