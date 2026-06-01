import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { token } = useAuth();

  return (
    <div>
      <h1>BuildMate Dashboard</h1>

      <p>
        Logged In: {token ? "YES" : "NO"}
      </p>
    </div>
  );
}

export default Dashboard;