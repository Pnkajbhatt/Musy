import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../apiFetch";

function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncOAuthUser() {
      try {
        const response = await apiFetch("auth/me");
        if (response.ok) {
          const resData = await response.json();
          const user = resData.data || resData;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            if (user.username) localStorage.setItem("username", user.username);
            if (user.role) localStorage.setItem("role", user.role);
            if (user.token) localStorage.setItem("token", user.token);
          }
          window.dispatchEvent(new Event("auth-change"));
          navigate("/", { replace: true });
        } else {
          navigate("/login?error=oauth_failed", { replace: true });
        }
      } catch (err) {
        setError(err.message);
        navigate("/login?error=oauth_failed", { replace: true });
      }
    }

    syncOAuthUser();
  }, [navigate]);

  return (
    <div className="glass max-w-sm rounded-3xl p-8 text-center mx-auto my-16">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-aqua-400 border-t-transparent"></div>
      <h2 className="font-display text-xl text-egg-50">Completing sign-in…</h2>
      <p className="mt-2 text-sm text-ink-300">Synchronizing your session, please wait.</p>
    </div>
  );
}

export default OAuthCallback;
