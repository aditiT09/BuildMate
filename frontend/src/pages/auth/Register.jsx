import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../../api/users";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(formData);

      alert("Account created successfully");

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed"
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

        <p>Create your account</p>

        <br />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />

        <br />
        <br />

        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          style={{
            width: "100%",
            resize: "vertical",
          }}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        <br />
        <br />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Link to="/login">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default Register;