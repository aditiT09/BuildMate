// ProjectCard.jsx

import { Link } from "react-router-dom";
import Card from "../ui/Card";

export default function ProjectCard({ project }) {
  return (
    <Card>

      <h2 className="text-2xl font-bold text-[#2B1B12] mb-3">
        {project.title}
      </h2>

      <p className="text-[#4A372D] mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-5">
        <span className="bg-[#F4A460] px-3 py-1 rounded-full text-sm">
          {project.project_type}
        </span>

        <span className="border border-[#D2B48C] px-3 py-1 rounded-full text-sm">
          {project.timeline}
        </span>
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="inline-block bg-[#E35336] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
      >
        View Details
      </Link>

    </Card>
  );
}