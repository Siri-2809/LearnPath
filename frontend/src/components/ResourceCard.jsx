import React from "react";

/**
 * ============================================
 * LearnPath - ResourceCard Component
 * ============================================
 * Displays an individual learning resource.
 *
 * Props:
 * - resource: {
 *     _id: string,
 *     title: string,
 *     subject: string,
 *     description: string,
 *     url: string,
 *     type?: string
 *   }
 */

const ResourceCard = ({ resource }) => {
    if (!resource) return null;

    const {
        title,
        subject,
        description,
        url,
        type = "Resource",
    } = resource;

    /**
     * Returns an emoji icon based on resource type
     */
    const getResourceIcon = () => {
        switch (type.toLowerCase()) {
            case "video":
                return "🎥";
            case "article":
                return "📄";
            case "course":
                return "🎓";
            case "documentation":
                return "📘";
            case "book":
                return "📚";
            case "practice":
                return "💻";
            default:
                return "🔗";
        }
    };

    return (
        <div className="card resource-card fade-in">
            <div className="resource-header">
                <span className="resource-icon">{getResourceIcon()}</span>
                <h3 className="resource-title">{title}</h3>
            </div>

            <span className="resource-subject">{subject}</span>

            <p className="resource-description">
                {description?.length > 120
                    ? `${description.substring(0, 120)}...`
                    : description}
            </p>

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary resource-btn"
            >
                View Resource
            </a>

            {/* Inline Styling */}
            <style jsx="true">{`
        .resource-card {
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .resource-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.15);
        }

        .resource-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .resource-icon {
          font-size: 2rem;
        }

        .resource-title {
          color: #1e3a8a;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .resource-subject {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          margin: 10px auto;
        }

        .resource-description {
          color: #64748b;
          font-size: 0.95rem;
          margin: 10px 0 15px;
          flex-grow: 1;
        }

        .resource-btn {
          margin-top: auto;
        }
      `}</style>
        </div>
    );
};

export default ResourceCard;