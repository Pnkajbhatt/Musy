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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
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
    <section className="w-full max-w-md rounded-3xl border border-emerald-900/70 bg-[#10221e] p-6 shadow-2xl shadow-black/30 sm:p-9">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
          Join Musy
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Build your listening space and share what you make.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-300">
          Username
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-300">
          Password
          <div className="relative mt-2">
            <input
              type={visible ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 pr-16 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
            <button
              type="button" // important: type="button" else it will submit form
              onClick={handlePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
            >
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label className="block text-sm font-medium text-slate-300">
          Confirm password
          <input
            type="password"
            placeholder="Repeat your password"
            name="conformPassword"
            value={formData.conformPassword}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-400 px-5 py-3.5 font-bold text-[#071412] transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#10221e] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </section>
  );
}

export default Register;
