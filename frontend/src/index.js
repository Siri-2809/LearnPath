import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Global Styles
import "./App.css";
import "./assets/styles/global.css";

// Main App Component
import App from "./App";

// Authentication Context
import { AuthProvider } from "./context/AuthContext";

// Render React Application
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);