import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyProjects } from "../../api/projects";
import { getMyApplications } from "../../api/applications";
import { getOverview } from "../../api/analytics";
import HeroSection from "../../components/dashboard/HeroSection";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [overview, setOverview] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        projectData,
        applicationData,
        overviewData,
      ] = await Promise.all([
        getMyProjects(),
        getMyApplications(),
        getOverview(),
      ]);

      setProjects(projectData);
      setApplications(applicationData);
      setOverview(overviewData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading Dashboard...
      </div>
    );
  }
return (
  <div className="min-h-screen bg-[#F7F3EC]">
    <div className="max-w-[1600px] mx-auto p-10">

      <HeroSection />

      <div className="grid md:grid-cols-4 gap-6 mt-10">

        <StatCard
          title="PROJECTS"
          value={projects.length}
          subtitle="created by you"
        />

        <StatCard
          title="APPLIED"
          value={applications.length}
          subtitle="+3 this week"
        />

        <StatCard
          title="PLATFORM"
          value={overview?.total_projects || 0}
          subtitle="live projects"
        />

        <StatCard
          title="OPENINGS"
          value={overview?.total_opportunities || 0}
          subtitle="find your fit"
        />

      </div>

    </div>
  </div>
);
function StatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="relative bg-[#FDFBF8] border border-[#D9D0C8] rounded-3xl p-8 overflow-hidden min-h-[240px]" >

      <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#F8E7E1] rounded-full translate-x-8 translate-y-8" />

      <p className="uppercase tracking-[3px] text-[#754C3A] font-semibold">
        
      </p>

      <h3 className="text-[#5A3728] uppercase tracking-[2px] font-bold mt-2">
        {title}
      </h3>

     <h2 className="text-6xl font-light text-[#24120C] mt-3">
        {value}
      </h2>

      <p className="text-[#754C3A] mt-2">
        {subtitle}
      </p>

    </div>
  );
}
}