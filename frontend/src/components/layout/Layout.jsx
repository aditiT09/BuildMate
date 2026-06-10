import DashboardNavbar from "./DashboardNavbar";

export default function Layout({ children }) {
  return (
    <>
      <DashboardNavbar />
      {/* pt-[60px] to offset fixed navbar height */}
      <main style={{ paddingTop: 60 }}>
        {children}
      </main>
    </>
  );
}