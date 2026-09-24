import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import apiFetch, { getCurrentUser, resolveMediaUrl } from "../../apiFetch";

function NavBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user") || !!localStorage.getItem("token") || !!localStorage.getItem("username")
  );
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("user_avatar") || null);

  // Re-check auth state when token or user session changes (login/logout)
  useEffect(() => {
    const sync = () => {
      setIsLoggedIn(
        !!localStorage.getItem("user") || !!localStorage.getItem("token") || !!localStorage.getItem("username")
      );
      setCurrentUser(getCurrentUser());
      setAvatarUrl(localStorage.getItem("user_avatar") || null);
    };
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      apiFetch("users/artist/status")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.data?.imageUrl) {
            const resolved = resolveMediaUrl(data.data.imageUrl);
            setAvatarUrl(resolved);
            localStorage.setItem("user_avatar", resolved);
          }
        })
        .catch(() => {});
    } else {
      setAvatarUrl(null);
      localStorage.removeItem("user_avatar");
    }
  }, [isLoggedIn]);

  const isAdmin =
    currentUser?.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN") ||
    localStorage.getItem("role") === "ROLE_ADMIN" ||
    localStorage.getItem("role") === "ADMIN";

  const isArtist =
    currentUser?.roles?.some((r) => r === "ROLE_ARTIST" || r === "ARTIST") ||
    localStorage.getItem("role") === "ROLE_ARTIST" ||
    localStorage.getItem("role") === "ARTIST";

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : "/browse");
  };

  const handleLogout = async () => {
    try {
      await apiFetch("auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("user_avatar");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const navigation = [
    ...(isArtist ? [["/upload", "Upload"]] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
        <NavLink to="/" className="font-display mr-auto text-3xl sm:text-4xl font-extrabold tracking-tight text-egg-50 transition hover:opacity-90">
          musy<span className="text-blush-500">.</span>
        </NavLink>

        <form onSubmit={handleSearch}
          className="order-3 flex w-full overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-900/80 sm:order-0 sm:w-auto sm:max-w-sm sm:flex-1">
          <label htmlFor="site-search" className="sr-only">Search songs</label>
          <input
            id="site-search" type="search" value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search a mood, title, genre"
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-egg-50 outline-none placeholder:text-ink-400"
          />
          <button type="submit"
            className="bg-ink-800 px-4 py-2 text-sm font-semibold text-egg-50 transition hover:bg-ink-700">
            Search
          </button>
        </form>

        {(navigation.length > 0 || isAdmin) && (
          <div className="flex items-center gap-1 rounded-2xl border border-ink-700/70 bg-ink-900/70 p-1">
            {navigation.map(([path, label]) => (
              <NavLink key={path} to={path} end={path === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${isActive ? "nav-link-active" : "text-ink-300 hover:bg-ink-800 hover:text-egg-50"}`
                }>
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${isActive ? "bg-blush-950 text-blush-300 border border-blush-800/60" : "text-blush-400 hover:bg-ink-800 hover:text-egg-50"}`
                }>
                Dashboard
              </NavLink>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `grid h-10 w-10 place-items-center rounded-full border overflow-hidden transition ${
                  isActive
                    ? "border-aqua-400 bg-aqua-950 text-aqua-300 ring-2 ring-aqua-500/30 shadow-sm"
                    : "border-ink-700/80 bg-ink-900/80 text-ink-300 hover:border-aqua-500/50 hover:text-egg-50"
                }`
              }
              title={isLoggedIn ? currentUser?.username || "My Profile" : "Profile / Sign In"}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={() => {
                    setAvatarUrl(null);
                    localStorage.removeItem("user_avatar");
                  }}
                />
              ) : isLoggedIn ? (
                <span className="font-semibold text-sm text-aqua-300">
                  {currentUser?.username?.[0]?.toUpperCase() || "👤"}
                </span>
              ) : (
                <span className="text-base">👤</span>
              )}
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
