import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiFetch, { baseUrl, getCurrentUser } from "../../apiFetch";

function Login() {
  const [formData, setFormdata] = useState({ username: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      setError("Third-party login failed or was cancelled. Please try again.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    const target = baseUrl
      ? `${baseUrl.replace(/\/$/, "")}/oauth2/authorization/google`
      : "/oauth2/authorization/google";
    window.location.href = target;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await apiFetch("auth/login", {
        method: "POST",
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try { data = JSON.parse(responseText); }
        catch { throw new Error(`Login failed (${response.status})`); }
      }
      if (!response.ok) throw new Error(data.message || `Login failed (${response.status})`);

      const userData = data.data || data;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.username) localStorage.setItem("username", userData.username);
        if (userData.role) localStorage.setItem("role", userData.role);
        if (userData.token || userData.Token) {
          localStorage.setItem("token", userData.token || userData.Token);
        }
      }

      navigate("/");
      window.dispatchEvent(new Event("auth-change"));
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
        <h1 className="font-display mt-3 text-3xl text-egg-50">Log in to Musy</h1>
        <p className="mt-2 text-sm text-ink-300">Continue listening and sharing your sound.</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-ink-700/80 bg-ink-900/80 px-5 py-3.5 text-sm font-semibold text-egg-50 transition hover:bg-ink-800 hover:border-ink-600 shadow-sm"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-ink-800"></div>
        <span className="bg-ink-950 px-3 text-xs uppercase tracking-wider text-ink-400">or</span>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-mist-200">
          Username
          <input
            type="text" name="username" placeholder="Enter your username"
            value={formData.username} onChange={handleChange} className="field" required
          />
        </label>
        <label className="block text-sm font-medium text-mist-200">
          Password
          <div className="relative mt-2">
            <input
              type={visible ? "text" : "password"} name="password"
              placeholder="Enter your password" value={formData.password}
              onChange={handleChange} className="field mt-0 pr-16" required
            />
            <button type="button" onClick={() => setVisible((p) => !p)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-mist-400 hover:text-egg-100">
              {visible ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && <p className="rounded-xl bg-blush-500/10 px-4 py-3 text-sm text-blush-200">{error}</p>}
        <button type="submit"
          className="btn-primary w-full px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-aqua-400 hover:text-aqua-300 transition">
          Register
        </Link>
      </p>
    </section>
  );
}

export default Login;
