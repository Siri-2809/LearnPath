import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * ============================================
 * LearnPath - Home Page
 * ============================================
 * Landing page introducing the platform with
 * key features, call-to-action buttons, and
 * a modern UI consistent with the theme.
 */

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Accelerate Your Placement Journey with{" "}
            <span className="text-primary">LearnPath</span>
          </h1>
          <p className="hero-subtitle">
            An AI-powered platform that provides personalized learning paths,
            mock tests, and skill gap analysis to help you crack top company
            interviews.
          </p>

          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <h2 className="section-title text-center">Why Choose LearnPath?</h2>

        <div className="grid grid-3">
          <div className="card feature-card">
            <h3>AI-Powered Insights</h3>
            <p>
              Identify your strengths and weaknesses with intelligent skill gap
              analysis powered by machine learning.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Company-Specific Quizzes</h3>
            <p>
              Practice with curated questions tailored to top companies like
              Google, Amazon, and Microsoft.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Personalized Learning Paths</h3>
            <p>
              Follow structured learning plans designed to help you succeed in
              technical interviews.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Progress Tracking</h3>
            <p>
              Monitor your performance through interactive dashboards and visual
              analytics.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Curated Resources</h3>
            <p>
              Access high-quality study materials, tutorials, and practice
              platforms.
            </p>
          </div>

          <div className="card feature-card">
            <h3>Placement Ready</h3>
            <p>
              Prepare efficiently with mock tests and structured study plans
              tailored to your goals.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>

          <div className="grid grid-3 steps">
            <div className="step card">
              <div className="step-number">1</div>
              <h3>Select Your Target Company</h3>
              <p>Choose the company you aspire to join.</p>
            </div>

            <div className="step card">
              <div className="step-number">2</div>
              <h3>Take Diagnostic Tests</h3>
              <p>Assess your skills and identify gaps.</p>
            </div>

            <div className="step card">
              <div className="step-number">3</div>
              <h3>Follow Your Learning Path</h3>
              <p>Improve with personalized study plans and resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="cta">
        <div className="container text-center">
          <h2>Start Your Journey Today </h2>
          <p>Join LearnPath and take the first step toward your dream job.</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary">
              Create an Account
            </Link>
          )}
        </div>
      </section>

      {/* Inline Styling */}
      <style jsx="true">{`
        .hero {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #ffffff;
          padding: 80px 20px;
          text-align: center;
        }

        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto 30px;
          line-height: 1.6;
          color: #e2e8f0;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .features {
          padding: 60px 20px;
        }

        .feature-card {
          text-align: center;
          padding: 25px;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 40px;
          color: #1e3a8a;
          font-weight: 700;
        }

        .how-it-works {
          background: #f8fafc;
          padding: 60px 20px;
        }

        .step {
          text-align: center;
          padding: 25px;
        }

        .step-number {
          width: 50px;
          height: 50px;
          margin: 0 auto 15px;
          background: #2563eb;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: bold;
        }

        .cta {
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          color: white;
          padding: 60px 20px;
        }

        .cta h2 {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .cta p {
          margin-bottom: 20px;
          color: #e0f2fe;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
