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
    <header className="border-b border-emerald-950/80 bg-[#0a1815]/95">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
        <NavLink
          to="/"
          className="mr-auto text-xl font-black tracking-tight text-white"
        >
          musy<span className="text-emerald-400">.</span>
        </NavLink>

        <form
          onSubmit={handleSearch}
          className="order-3 flex w-full sm:order-0 sm:w-auto sm:flex-1 sm:max-w-sm"
        >
          <label htmlFor="site-search" className="sr-only">
            Search songs
          </label>
          <input
            id="site-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search songs"
            className="min-w-0 flex-1 rounded-l-xl border border-emerald-900 bg-[#10221e] px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
          />
          <button
            type="submit"
            className="rounded-r-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-[#071412] transition hover:bg-emerald-300"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-1 rounded-xl bg-[#10221e] p-1">
          {navigation.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${isActive ? "bg-emerald-400 text-[#071412]" : "text-slate-400 hover:bg-emerald-950 hover:text-white"}`
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
              `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "text-emerald-300" : "text-slate-400 hover:text-white"}`
            }
          >
            Log in
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-lg border border-emerald-500/50 px-3 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-400 hover:text-[#071412]"
          >
            Sign up
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
