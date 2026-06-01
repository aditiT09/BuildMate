import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const form = new URLSearchParams();

      form.append("username", email);
      form.append("password", password);

      const response = await api.post(
        "/auth/login",
        form,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const token =
        response.data.access_token;

      login(token);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "350px",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <h1>BuildMate</h1>

        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

        <br />
        <br />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Link to="/register">
          Create Account
        </Link>
      </form>
    </div>
  );
}

export default Login;