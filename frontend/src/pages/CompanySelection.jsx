import React, { useEffect, useState } from "react";
import CompanyCard from "../components/CompanyCard";
import companyService from "../services/companyService";

/**
 * ============================================
 * LearnPath - Company Selection Page
 * ============================================
 * Features:
 * - Fetches companies from backend
 * - Displays them using CompanyCard
 * - Allows users to select a target company
 * - Responsive and visually appealing UI
 */

const CompanySelection = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Fetch companies from backend
     */
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);

                const response = await companyService.getAllCompanies();

                // Normalize response to always be an array
                const companyData =
                    response?.data?.data || // If response = { success, data }
                    response?.data ||       // If response = axios response
                    response ||             // If service already returns data
                    [];

                const companiesArray = Array.isArray(companyData)
                    ? companyData
                    : [];

                setCompanies(companiesArray);
                setFilteredCompanies(companiesArray);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Failed to load companies. Please try again later.");
                setCompanies([]);
                setFilteredCompanies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    /**
     * Handle search filtering
     */
    useEffect(() => {
        if (!Array.isArray(companies)) return;

        const filtered = companies.filter((company) =>
            company.name.toLowerCase().includes(search.toLowerCase())
        );

        setFilteredCompanies(filtered);
    }, [search, companies]);

    if (loading) {
        return (
            <div className="container flex-center" style={{ height: "60vh" }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container fade-in">
            {/* Header */}
            <div className="page-header">
                <h1>Select Your Target Company</h1>
                <p>
                    Choose a company to start your personalized placement preparation
                    journey.
                </p>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {/* Company Grid */}
            {filteredCompanies.length > 0 ? (
                <div className="grid grid-3">
                    {filteredCompanies.map((company) => (
                        <CompanyCard key={company._id} company={company} />
                    ))}
                </div>
            ) : (
                <div className="card text-center">
                    <h3>No Companies Found</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>
            )}

            {/* Inline Styling */}
            <style jsx="true">{`
        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          color: #1e3a8a;
          font-weight: 700;
        }

        .page-header p {
          color: #64748b;
        }

        .search-container {
          max-width: 400px;
          margin: 0 auto 30px;
        }

        .search-input {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #cbd5f5;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          outline: none;
        }

        .alert {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .alert-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 768px) {
          .search-container {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default CompanySelection;