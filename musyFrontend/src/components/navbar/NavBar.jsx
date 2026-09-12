import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : "/browse");
  };

  const navigation = [
    ["/", "Home"],
    ["/upload", "Upload"],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
        <NavLink
          to="/"
          className="font-display mr-auto text-2xl font-bold tracking-tight text-egg-50"
        >
          musy
          <span className="text-blush-700">.</span>
        </NavLink>

        <form
          onSubmit={handleSearch}
          className="order-3 flex w-full overflow-hidden rounded-2xl border border-ink-700/80 bg-ink-900/80 sm:order-0 sm:w-auto sm:max-w-sm sm:flex-1"
        >
          <label htmlFor="site-search" className="sr-only">
            Search songs
          </label>
          <input
            id="site-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search a mood, title, genre"
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-egg-50 outline-none placeholder:text-ink-400"
          />
          <button
            type="submit"
            className="bg-ink-800 px-4 py-2 text-sm font-semibold text-egg-50 transition hover:bg-ink-700"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-1 rounded-2xl border border-ink-700/70 bg-ink-900/70 p-1">
          {navigation.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "nav-link-active"
                    : "text-ink-300 hover:bg-ink-800 hover:text-egg-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "text-egg-50"
                  : "text-ink-300 hover:text-egg-50"
              }`
            }
          >
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="btn-primary px-3 py-2 text-sm"
          >
            Sign up
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
