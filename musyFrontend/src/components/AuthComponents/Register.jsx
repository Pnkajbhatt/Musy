import apiFetch from "../../apiFetch";
import { useState } from "react";

function Register() {
  const [formData, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
    conformPassword: "",
  });
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordVisibility = () => {
    setVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (formData.password != formData.conformPassword) {
      setError("password do not matched");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
        }),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(`Registration failed (${response.status})`);
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Registration failed (${response.status})`,
        );
      }

      console.log("Success:", data);
      alert("Registration Successful!");

      setFormdata({
        username: "",
        email: "",
        password: "",
        conformPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass w-full max-w-md rounded-3xl p-6 sm:p-9">
      <div className="mb-8">
        <p className="kicker">Join Musy</p>
        <h1 className="font-display mt-3 text-3xl text-egg-50">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          Build your listening space and share what you make.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-mist-200">
          Username
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            className="field"
            required
          />
        </label>
        <label className="block text-sm font-medium text-mist-200">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="field"
            required
          />
        </label>
        <label className="block text-sm font-medium text-mist-200">
          Password
          <div className="relative mt-2">
            <input
              type={visible ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="field mt-0 pr-16"
              required
            />
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-mist-400 hover:text-egg-100"
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="block text-sm font-medium text-mist-200">
          Confirm password
          <input
            type="password"
            placeholder="Repeat your password"
            name="conformPassword"
            value={formData.conformPassword}
            onChange={handleChange}
            className="field"
            required
          />
        </label>

        {error && (
          <p className="rounded-xl bg-blush-500/10 px-4 py-3 text-sm text-blush-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn-primary w-full px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </section>
  );
}

export default Register;
