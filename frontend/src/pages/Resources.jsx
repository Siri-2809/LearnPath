import React, { useEffect, useState } from "react";
import resourceService from "../services/resourceService";
import companyService from "../services/companyService";
import useAuth from "../hooks/useAuth";
import ResourceCard from "../components/ResourceCard";
/**
 * ============================================
 * LearnPath - Resources Page
 * ============================================
 * Features:
 * - Fetches curated learning resources for company's required subjects
 * - Filters resources by subject
 * - Displays categorized study materials
 * - Responsive and modern UI
 */

const Resources = () => {
    const { user } = useAuth();

    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Fetch resources from backend
     */
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                console.log("📥 Fetching resources...");
                
                // Fetch company info to get required subjects
                let companySubjects = [];
                if (user?.targetCompany) {
                    try {
                        const companyResponse = await companyService.getCompanyByName(user.targetCompany);
                        companySubjects = Array.isArray(companyResponse?.company?.subjects)
                            ? companyResponse.company.subjects
                            : [];
                        console.log(`✓ Company ${user.targetCompany} subjects:`, companySubjects);
                    } catch (err) {
                        console.warn("⚠️ Could not fetch company subjects:", err);
                    }
                }

                // Fetch resources for company's subjects
                const response = await resourceService.getAllResources(user?.targetCompany);
                console.log("✓ Resources response received:", response);

                // Extract resources from response
                // Backend returns: { success: true, count, resources: [...] }
                let resourcesArray = [];
                
                if (Array.isArray(response)) {
                    // If response is already an array
                    resourcesArray = response;
                } else if (response && typeof response === 'object') {
                    // If response is an object, try to extract resources
                    resourcesArray = response.resources || response.data?.resources || [];
                }

                console.log("✓ Extracted resources type:", typeof resourcesArray, "Length:", resourcesArray.length);

                if (!Array.isArray(resourcesArray)) {
                    console.error("❌ Resources is not an array:", typeof resourcesArray, resourcesArray);
                    setError("Invalid resources data received from server.");
                    setLoading(false);
                    return;
                }

                if (resourcesArray.length === 0) {
                    console.warn("⚠️ No resources found in the database");
                }

                console.log(`✓ Found ${resourcesArray.length} resources`);
                setResources(resourcesArray);
                setFilteredResources(resourcesArray);

                // Extract unique subjects from resources
                const allResourceSubjects = new Set(resourcesArray.map((resource) => resource.subject).filter(Boolean));
                
                // If company subjects are available, filter to only show those subjects
                let uniqueSubjects = ["All"];
                if (companySubjects.length > 0) {
                    // Only show subjects that are in the company AND have resources
                    const companySubjectsWithResources = companySubjects.filter(
                        (subject) => allResourceSubjects.has(subject)
                    );
                    uniqueSubjects = ["All", ...companySubjectsWithResources];
                    console.log("✓ Filtered to company subjects with resources:", companySubjectsWithResources);
                } else {
                    // If no company info, show all subjects from resources
                    uniqueSubjects = [...uniqueSubjects, ...Array.from(allResourceSubjects)];
                    console.log("✓ Showing all resource subjects:", uniqueSubjects);
                }
                
                console.log("✓ Final subjects list:", uniqueSubjects);
                setSubjects(uniqueSubjects);
            } catch (err) {
                console.error("❌ Error fetching resources:", err);
                setError("Failed to load resources. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    /**
     * Filter resources by subject
     */
    useEffect(() => {
        if (selectedSubject === "All") {
            setFilteredResources(resources);
        } else {
            const filtered = resources.filter(
                (resource) => resource.subject === selectedSubject
            );
            setFilteredResources(filtered);
        }
    }, [selectedSubject, resources]);

    /**
     * Loading State
     */
    if (loading) {
        return (
            <div className="container flex-center" style={{ height: "60vh" }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container resources-page fade-in">
            {/* Header */}
            <div className="page-header">
                <h1>Learning Resources</h1>
                <p>
                    Enhance your skills with curated study materials and expert
                    recommendations.
                </p>
            </div>

            {/* Company Selection Reminder */}
            {!user?.targetCompany && (
                <div className="alert alert-info text-center" style={{ marginBottom: "20px" }}>
                    📌 <strong>No company selected</strong>. 
                    <a href="/companies" style={{ marginLeft: "10px", textDecoration: "underline" }}>
                        Select a company
                    </a>
                    {" "}to see resources for your target company.
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {/* Subject Filter */}
            <div className="filter-container">
                <label htmlFor="subject">Filter by Subject:</label>
                <select
                    id="subject"
                    className="form-control"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    {subjects && subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                                {subject}
                            </option>
                        ))
                    ) : (
                        <option>No subjects available</option>
                    )}
                </select>
            </div>

            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
                <div className="grid grid-3">
                    {filteredResources.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} />
                    ))}
                </div>
            ) : (
                <div className="card text-center">
                    <h3>No Resources Found</h3>
                    <p>Try selecting a different subject.</p>
                </div>
            )}

            {/* Inline Styling */}
            <style jsx="true">{`
        .resources-page {
          padding-bottom: 40px;
        }

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

        .filter-container {
          max-width: 300px;
          margin: 0 auto 30px;
          text-align: center;
        }

        .filter-container label {
          font-weight: 500;
          color: #1e3a8a;
        }

        .filter-container select {
          margin-top: 8px;
        }

        .resource-card {
          text-align: center;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .resource-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
        }

        .resource-subject {
          color: #2563eb;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .resource-description {
          color: #64748b;
          margin-bottom: 15px;
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
          .filter-container {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default Resources;