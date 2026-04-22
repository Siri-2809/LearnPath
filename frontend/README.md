# 🎨 LearnPath Frontend

React-based user interface for the LearnPath placement preparation platform. Built with React 18, Axios for API calls, React Router for navigation, and Chart.js for analytics visualization.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Components](#key-components)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## 📦 Overview

The frontend provides a complete user interface for:
- User authentication (login/registration)
- Company selection
- Quiz taking and assessment
- Learning path visualization
- Study plan scheduling
- Resource browsing and filtering
- Progress tracking and analytics
- User profile management

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **Chart.js** - Data visualization
- **CSS3** - Styling and responsive design
- **JWT** - Token-based authentication

---

## 📁 Project Structure

```
src/
├── pages/                          # Page components
│   ├── Home.jsx                    # Landing page
│   ├── Login.jsx                   # Login authentication
│   ├── Register.jsx                # User registration
│   ├── CompanySelection.jsx        # Company choice
│   ├── Dashboard.jsx               # User dashboard
│   ├── Quiz.jsx                    # Quiz interface
│   ├── QuizResult.jsx              # Quiz results display
│   ├── LearningPath.jsx            # Learning path visualization
│   ├── StudyPlan.jsx               # Study plan timetable
│   ├── Resources.jsx               # Resources listing
│   └── NotFound.jsx                # 404 error page
│
├── components/                     # Reusable components
│   ├── Navbar.jsx                  # Navigation bar
│   ├── Footer.jsx                  # Footer component
│   ├── CompanyCard.jsx             # Company card
│   ├── QuizCard.jsx                # Quiz card
│   ├── ResourceCard.jsx            # Resource card
│   ├── QuestionCard.jsx            # Question card
│   ├── StudyPlanTable.jsx          # Study plan table
│   ├── ProgressChart.jsx           # Progress chart
│   └── LearningPathTimeline.jsx    # Timeline visualization
│
├── context/                        # React Context
│   └── AuthContext.jsx             # Auth context provider
│
├── hooks/                          # Custom hooks
│   └── useAuth.js                  # Authentication hook
│
├── services/                       # API services
│   ├── api.js                      # Axios instance configuration
│   ├── authService.js              # Auth endpoints
│   ├── companyService.js           # Company endpoints
│   ├── quizService.js              # Quiz endpoints
│   ├── learningPathService.js      # Learning path endpoints
│   ├── studyPlanService.js         # Study plan endpoints
│   ├── resourceService.js          # Resource endpoints
│   └── userService.js              # User endpoints
│
├── utils/                          # Utility functions
│   └── helpers.js                  # Helper functions
│
├── assets/                         # Static assets
│   ├── images/                     # Images
│   └── styles/                     # Global styles
│
├── App.jsx                         # Root component
├── App.css                         # App styles
├── index.js                        # React entry point
├── index.css                       # Global styles
└── routes.jsx                      # Route configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file with API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# Optional: enable debug mode
REACT_APP_DEBUG=false
```

---

## 📝 Available Scripts

### `npm start`

Runs the app in development mode.
- Open [http://localhost:3000](http://localhost:3000) in browser
- Page reloads when you make changes
- Console shows lint errors

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build/` folder.
- Correctly bundles React in production mode
- Optimizes build for best performance
- Build is minified with hashed filenames
- Ready for deployment

### `npm run eject`

**⚠️ Warning: This is irreversible!**

Ejects from Create React App configuration, giving full control over build setup.

---

## 🧩 Key Components

### AuthContext
Manages global authentication state:
- User data
- JWT token
- Login/logout operations
- Protected routes

### useAuth Hook
Custom hook to access auth context from any component:

```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### Protected Routes
Routes requiring authentication are protected by checking token in context.

---

## 🌐 API Integration

All API calls are made through service layers in `src/services/`:

```javascript
// Example: Quiz Service
import quizService from '../services/quizService';

const fetchQuiz = async (companyId) => {
  try {
    const response = await quizService.getQuiz(companyId);
    setQuiz(response.data);
  } catch (error) {
    console.error('Error fetching quiz:', error);
  }
};
```

**Base URL**: Set via `REACT_APP_API_URL` environment variable

**Authentication**: JWT token sent via Authorization header

---

## 🎨 Styling

- **Global styles**: `index.css` and `App.css`
- **Component styles**: Inline CSS or separate CSS modules
- **Responsive design**: Mobile-first approach
- **Color scheme**: Professional blue/green with accent colors

---

## 🔨 Building for Production

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

Build outputs to `build/` directory - ready for deployment to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: API calls failing (CORS error)

- Ensure backend is running on correct port
- Backend CORS settings allow frontend origin
- Check `REACT_APP_API_URL` in `.env` is correct

### Issue: Authentication not working

- Clear browser localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify backend is returning proper auth tokens
- Check browser console for detailed error messages

### Issue: Blank page or white screen

- Check browser console (F12) for errors
- Verify Node.js version: `node --version`
- Clear cache and hard refresh (Ctrl+Shift+R)
- Check that `index.js` is loading `App.jsx`

---

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [React Router Guide](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Chart.js Docs](https://www.chartjs.org/)

---

## 🔄 Performance Optimization

- Code splitting with React.lazy()
- Memoization of components with React.memo()
- Efficient state management with Context API
- Lazy loading of images
- Optimized bundle size

---

Made with ❤️ as part of LearnPath
