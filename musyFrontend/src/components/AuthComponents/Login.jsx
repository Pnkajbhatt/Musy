import { useState } from "react";
import apiFetch from "../../apiFetch";

function Login() {
  const [formData, setFormdata] = useState({
    username: "",
    password: "",
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
    try {
      setLoading(true);

      const response = await apiFetch("auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(`Login failed (${response.status})`);
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Login failed (${response.status})`);
      }

      const token =
        data.token ?? data.Token ?? data.data?.token ?? data.data?.Token;
      if (token) {
        localStorage.setItem("token", token);
      }

      console.log("Success:", data);
      alert("login Successful!");

      setFormdata({
        username: "",
        password: "",
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
        <p className="kicker">Welcome back</p>
        <h1 className="font-display mt-3 text-3xl text-egg-50">
          Log in to Musy
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          Continue listening and sharing your sound.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-mist-200">
          Username
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
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
              placeholder="Enter your password"
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
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </section>
  );
}

export default Login;
