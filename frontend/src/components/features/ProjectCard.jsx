import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="bm-card">

      <div className="bm-card__spine" />

      <div className="bm-card__inner">

        <div>

          <span className="bm-type-badge">
            {project.project_type}
          </span>

          <h2 className="bm-card__title">
            {project.title}
          </h2>

        </div>

        <p className="bm-card__desc">
          {project.description}
        </p>

        <div className="bm-card__timeline">

          <span className="bm-section-label">
            Timeline
          </span>

          <span className="bm-timeline-value">
            {project.timeline}
          </span>

        </div>

        <div className="bm-card__footer">

          <Link
            to={`/projects/${project.id}`}
            className="bm-btn bm-btn--primary"
          >
            View Project
          </Link>

        </div>

      </div>

    </article>
  );
}