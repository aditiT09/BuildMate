import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </>
  );
}