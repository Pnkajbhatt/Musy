import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Re-check auth state when token changes (login/logout)
  useEffect(() => {
    const sync = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : "/browse");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const navigation = [
    ["/", "Home"],
    ["/upload", "Upload"],
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

        <div className="flex items-center gap-1 rounded-2xl border border-ink-700/70 bg-ink-900/70 p-1">
          {navigation.map(([path, label]) => (
            <NavLink key={path} to={path} end={path === "/"}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${isActive ? "nav-link-active" : "text-ink-300 hover:bg-ink-800 hover:text-egg-50"}`
              }>
              {label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <NavLink to="/profile"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${isActive ? "nav-link-active" : "text-ink-300 hover:bg-ink-800 hover:text-egg-50"}`
              }>
              Profile
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                className="flex items-center gap-1.5 rounded-xl border border-ink-700/70 bg-ink-900/70 px-3 py-2 text-sm font-medium text-egg-50 transition hover:bg-ink-800"
                title="View Profile"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-aqua-500/20 text-xs font-bold text-aqua-400">
                  👤
                </span>
                <span className="hidden sm:inline">My Profile</span>
              </NavLink>
              <button onClick={handleLogout}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-300 transition hover:text-egg-50">
                Log out
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "text-egg-50" : "text-ink-300 hover:text-egg-50"}`
                }>
                Log in
              </NavLink>
              <NavLink to="/register" className="btn-primary px-3 py-2 text-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
