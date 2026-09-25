import React, { useEffect, useState } from "react";
import apiFetch, { getCurrentUser, resolveMediaUrl } from "../apiFetch";
import { Link, useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("artists"); // "artists" | "users" | "applications"
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalListeners: 0,
    pendingApplications: 0,
    totalSongs: 0,
  });

  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [appFilter, setAppFilter] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED
  const [userSearch, setUserSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const currentUser = getCurrentUser();
  const isAdmin =
    currentUser?.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN") ||
    localStorage.getItem("role") === "ROLE_ADMIN" ||
    localStorage.getItem("role") === "ADMIN";

  const handleLogout = async () => {
    try {
      await apiFetch("auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("user_avatar");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, artistsRes, songsRes, appsRes] =
        await Promise.allSettled([
          apiFetch("Admin/stats"),
          apiFetch("Admin/users"),
          apiFetch("Admin/artists"),
          apiFetch("song"),
          apiFetch("Admin/artist/applications"),
        ]);

      let songList = [];
      if (songsRes.status === "fulfilled" && songsRes.value.ok) {
        const data = await songsRes.value.json();
        songList = Array.isArray(data) ? data : data.data ?? [];
        setSongs(songList);
      }

      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const json = await statsRes.value.json();
        const statData = json.data || {};
        setStats({
          totalUsers: statData.totalUsers ?? 0,
          totalArtists: statData.totalArtists ?? 0,
          totalListeners: statData.totalListeners ?? 0,
          pendingApplications: statData.pendingApplications ?? 0,
          totalSongs: songList.length,
        });
      }

      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const json = await usersRes.value.json();
        setUsers(json.data || []);
      }

      if (artistsRes.status === "fulfilled" && artistsRes.value.ok) {
        const json = await artistsRes.value.json();
        setArtists(json.data || []);
      }

      if (appsRes.status === "fulfilled" && appsRes.value.ok) {
        const json = await appsRes.value.json();
        const appList = json.data || [];
        setApplications(appList);
        const pendingCount = appList.filter(
          (a) => a.status === "PENDING"
        ).length;
        setStats((prev) => ({
          ...prev,
          pendingApplications: pendingCount,
          totalSongs: songList.length,
        }));
      }
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setMessage({
        type: "error",
        text: "Could not load all dashboard data. Please check microservices.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleApprove = async (applicationId, artistName) => {
    setActionLoading(applicationId);
    try {
      const res = await apiFetch(
        `Admin/artist/applications/${applicationId}/approve`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `"${artistName}" has been approved! Promoted to Artist.`,
        });
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationID === applicationId
              ? { ...app, status: "APPROVED" }
              : app
          )
        );
        // Refresh stats and artists
        loadDashboardData();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to approve application.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error during approval." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId, artistName) => {
    if (
      !window.confirm(
        `Are you sure you want to reject the application for "${artistName}"?`
      )
    ) {
      return;
    }
    setActionLoading(applicationId);
    try {
      const res = await apiFetch(
        `Admin/artist/applications/${applicationId}/reject`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "info",
          text: `Application for "${artistName}" has been rejected.`,
        });
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationID === applicationId
              ? { ...app, status: "REJECTED" }
              : app
          )
        );
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to reject application.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error during rejection." });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-xl text-center py-20 px-6 glass rounded-3xl mx-auto space-y-4">
        <p className="text-4xl">🔒</p>
        <h2 className="font-display text-2xl font-bold text-egg-50">
          Admin Access Required
        </h2>
        <p className="text-sm text-ink-300">
          You must be logged in as an administrator to view this dashboard.
        </p>
        <Link
          to="/"
          className="btn-primary inline-block mt-4 px-6 py-2.5 text-sm font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const filteredApps =
    appFilter === "ALL"
      ? applications
      : applications.filter((app) => app.status === appFilter);

  const pendingAppsCount = applications.filter(
    (a) => a.status === "PENDING"
  ).length;

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl space-y-8">
      {/* Top Banner & Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blush-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blush-400 border border-blush-500/30">
              Administrator Dashboard
            </span>
            <span className="text-xs text-ink-400">
              Welcome back, @{currentUser?.username || "Admin"}
            </span>
          </div>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-extrabold text-egg-50">
            System Overview & Control
          </h1>
          <p className="mt-1 text-sm text-ink-300">
            Monitor registered users, active artists, uploaded music, and review pending creator applications.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-2xl border border-blush-900/60 bg-blush-950/50 hover:bg-blush-900/80 px-4 py-2.5 text-sm font-semibold text-blush-300 hover:text-egg-50 transition shrink-0"
        >
          Log out
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-sm font-medium border ${
            message.type === "success"
              ? "bg-aqua-950/80 border-aqua-800/80 text-aqua-200"
              : message.type === "info"
              ? "bg-ink-800/90 border-ink-700 text-egg-100"
              : "bg-blush-950/80 border-blush-800/80 text-blush-200"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-ink-400 hover:text-egg-50 text-sm font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-ink-800/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Total Users
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-egg-50">
            {stats.totalUsers || users.length}
          </p>
          <span className="text-[11px] text-ink-400 mt-1 block">
            Registered accounts
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-aqua-900/40 bg-aqua-950/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-aqua-400">
            Verified Artists
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-aqua-300">
            {stats.totalArtists || artists.length}
          </p>
          <span className="text-[11px] text-aqua-400/70 mt-1 block">
            Approved creators
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-ink-800/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Uploaded Songs
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-egg-50">
            {songs.length}
          </p>
          <span className="text-[11px] text-ink-400 mt-1 block">
            Live catalog tracks
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-amber-900/40 bg-amber-950/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Pending Applications
          </p>
          <p className="font-display mt-2 text-3xl font-bold text-amber-300">
            {pendingAppsCount}
          </p>
          <span className="text-[11px] text-amber-400/70 mt-1 block">
            Awaiting verification
          </span>
        </div>
      </div>

      {/* Main Section Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-800 pb-3">
        <button
          onClick={() => setActiveTab("artists")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === "artists"
              ? "bg-ink-800 text-egg-50 shadow-sm border border-ink-700"
              : "text-ink-400 hover:text-egg-50"
          }`}
        >
          <span>🎙️</span>
          <span>Artists & Tracks ({artists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === "users"
              ? "bg-ink-800 text-egg-50 shadow-sm border border-ink-700"
              : "text-ink-400 hover:text-egg-50"
          }`}
        >
          <span>👥</span>
          <span>All Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === "applications"
              ? "bg-ink-800 text-egg-50 shadow-sm border border-ink-700"
              : "text-ink-400 hover:text-egg-50"
          }`}
        >
          <span>📋</span>
          <span>Artist Applications ({applications.length})</span>
          {pendingAppsCount > 0 && (
            <span className="ml-1 rounded-full bg-amber-500 text-ink-950 px-2 py-0.2 text-xs font-black">
              {pendingAppsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ARTISTS & THEIR SONGS */}
      {activeTab === "artists" && (
        <div className="space-y-6">
          {loading ? (
            <div className="glass rounded-3xl p-12 text-center text-sm text-ink-400">
              Loading artists and tracks…
            </div>
          ) : artists.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-4xl mb-2">🎙️</p>
              <h3 className="font-display text-xl font-bold text-egg-50">
                No artists registered yet
              </h3>
              <p className="mt-1 text-sm text-ink-400">
                When users are approved through the artist applications tab, they will be listed here along with their music.
              </p>
            </div>
          ) : (
            artists.map((artist) => {
              // Find songs by this artist (match by userId or username)
              const artistSongs = songs.filter(
                (s) =>
                  (s.userId && s.userId === artist.userId) ||
                  (s.artist &&
                    s.artist.toLowerCase() ===
                      (artist.artistName || artist.username).toLowerCase())
              );

              return (
                <div
                  key={artist.userId}
                  className="glass rounded-3xl p-6 sm:p-8 space-y-6 border border-ink-800"
                >
                  {/* Artist Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-800/80 pb-5">
                    <div className="flex items-center gap-4">
                      {resolveMediaUrl(artist.profileImage) ? (
                        <img
                          src={resolveMediaUrl(artist.profileImage)}
                          alt={artist.artistName || artist.username}
                          className="h-16 w-16 rounded-2xl object-cover border border-ink-700 shadow-md"
                        />
                      ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-aqua-500/20 to-ink-800 text-3xl font-bold text-aqua-300 border border-ink-700">
                          {(artist.artistName || artist.username)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-xl font-bold text-egg-50">
                            {artist.artistName || artist.username}
                          </h2>
                          <span className="rounded-full bg-aqua-950 text-aqua-300 border border-aqua-800/70 text-[10px] font-bold px-2 py-0.5 uppercase">
                            Artist
                          </span>
                        </div>
                        <p className="text-xs text-ink-400 mt-0.5">
                          @{artist.username} · {artist.email}
                          <span className="ml-2 text-ink-500">ID #{artist.userId}</span>
                        </p>
                        {artist.genre && (
                          <span className="inline-block mt-2 rounded-lg bg-ink-800 px-2.5 py-0.5 text-xs text-aqua-300 font-medium">
                            {artist.genre}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <span className="text-xs text-ink-400 block">Catalog</span>
                      <span className="font-display text-2xl font-bold text-egg-50">
                        {artistSongs.length} {artistSongs.length === 1 ? "track" : "tracks"}
                      </span>
                    </div>
                  </div>

                  {/* Artist Bio */}
                  {artist.bio && (
                    <p className="text-xs leading-relaxed text-ink-300 bg-ink-900/50 p-3.5 rounded-2xl border border-ink-800/60 italic">
                      "{artist.bio}"
                    </p>
                  )}

                  {/* Artist's Songs Grid */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">
                      Uploaded Tracks ({artistSongs.length})
                    </h3>

                    {artistSongs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-ink-800 p-6 text-center text-xs text-ink-500">
                        This artist has not uploaded any songs yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {artistSongs.map((song) => {
                          const cover = resolveMediaUrl(
                            song.coverUrl ?? song.cover_url
                          );
                          const songId = song.songId ?? song.id;

                          return (
                            <div
                              key={songId}
                              className="rounded-2xl border border-ink-800/80 bg-ink-900/50 p-3.5 flex items-center gap-3.5 hover:border-ink-700 transition"
                            >
                              {cover ? (
                                <img
                                  src={cover}
                                  alt={song.title}
                                  className="h-12 w-12 rounded-xl object-cover border border-ink-800 shrink-0"
                                />
                              ) : (
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink-800 text-lg text-ink-400 shrink-0">
                                  ♪
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-sm text-egg-50 truncate">
                                  {song.title ?? "Untitled"}
                                </h4>
                                <p className="text-[11px] text-ink-400 truncate">
                                  {song.genre ?? "Music"} · {song.streamCount ?? 0} plays
                                </p>
                                <span className="text-[10px] text-ink-500">
                                  ID #{songId}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ALL REGISTERED USERS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search by username, email, or role…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="field sm:max-w-md w-full"
            />
            <span className="text-xs text-ink-400">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-ink-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink-300">
                <thead className="bg-ink-900/80 text-xs font-semibold uppercase tracking-wider text-ink-400 border-b border-ink-800">
                  <tr>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Username</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-ink-400">
                        Loading users…
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-ink-400">
                        No users found matching "{userSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isAdm = u.role === "ADMIN" || u.role === "ROLE_ADMIN";
                      const isArt = u.role === "ARTIST" || u.role === "ROLE_ARTIST";

                      return (
                        <tr key={u.userId} className="hover:bg-ink-800/30 transition">
                          <td className="px-5 py-3.5 font-mono text-xs text-ink-400">
                            #{u.userId}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-egg-50">
                            @{u.username}
                          </td>
                          <td className="px-5 py-3.5 text-ink-300">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${
                                isAdm
                                  ? "bg-blush-950 text-blush-300 border-blush-800/80"
                                  : isArt
                                  ? "bg-aqua-950 text-aqua-300 border-aqua-800/80"
                                  : "bg-ink-800 text-ink-300 border-ink-700"
                              }`}
                            >
                              {u.role || "USER"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-ink-400 font-mono">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ARTIST APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Status filter tabs */}
          <div className="flex items-center gap-2 border-b border-ink-800 pb-3">
            {[
              ["ALL", `All (${applications.length})`],
              ["PENDING", `Pending (${pendingAppsCount})`],
              [
                "APPROVED",
                `Approved (${
                  applications.filter((a) => a.status === "APPROVED").length
                })`,
              ],
              [
                "REJECTED",
                `Rejected (${
                  applications.filter((a) => a.status === "REJECTED").length
                })`,
              ],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setAppFilter(key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  appFilter === key
                    ? "bg-ink-800 text-egg-50 shadow-sm"
                    : "text-ink-400 hover:text-egg-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Applications Cards */}
          {loading ? (
            <div className="glass rounded-3xl p-12 text-center text-sm text-ink-400">
              Loading applications…
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center">
              <p className="text-3xl mb-2">📋</p>
              <h3 className="font-display text-lg font-bold text-egg-50">
                No {appFilter !== "ALL" ? appFilter.toLowerCase() : ""} applications found
              </h3>
              <p className="mt-1 text-xs text-ink-400">
                When users apply to become an artist from their profile, their applications will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredApps.map((app) => (
                <div
                  key={app.applicationID}
                  className="glass rounded-3xl p-5 sm:p-6 space-y-4 border border-ink-800 hover:border-ink-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {resolveMediaUrl(app.imageUrl) ? (
                        <img
                          src={resolveMediaUrl(app.imageUrl)}
                          alt={app.artistName}
                          className="h-14 w-14 rounded-2xl object-cover border border-ink-700 shadow-md"
                        />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-800 text-2xl text-ink-400 border border-ink-700">
                          🎙️
                        </div>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-bold text-egg-50">
                          {app.artistName}
                        </h3>
                        <p className="text-xs text-ink-400">
                          Username:{" "}
                          <span className="text-egg-50 font-medium">
                            @{app.username}
                          </span>
                          {app.userID && (
                            <span className="ml-1 text-ink-500">
                              · ID #{app.userID}
                            </span>
                          )}
                        </p>
                        <span className="inline-block mt-1 text-[11px] rounded-lg bg-ink-800/80 px-2 py-0.5 text-aqua-300 font-medium">
                          {app.genre || "General"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${
                        app.status === "APPROVED"
                          ? "bg-aqua-950/80 text-aqua-300 border-aqua-800/60"
                          : app.status === "PENDING"
                          ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                          : "bg-blush-950/80 text-blush-300 border-blush-800/60"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Bio */}
                  {app.bio && (
                    <div className="rounded-xl bg-ink-900/60 p-3 text-xs text-ink-300 border border-ink-800/80 italic">
                      "{app.bio}"
                    </div>
                  )}

                  {/* Application Details Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink-800/80">
                    <span className="text-[11px] text-ink-500 font-mono">
                      Submitted:{" "}
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      {app.status !== "APPROVED" && (
                        <button
                          onClick={() =>
                            handleApprove(app.applicationID, app.artistName)
                          }
                          disabled={actionLoading === app.applicationID}
                          className="rounded-xl bg-aqua-500 hover:bg-aqua-400 text-ink-950 px-3.5 py-1.5 text-xs font-bold shadow-md shadow-aqua-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === app.applicationID
                            ? "Approving…"
                            : "Approve Artist"}
                        </button>
                      )}

                      {app.status !== "REJECTED" && (
                        <button
                          onClick={() =>
                            handleReject(app.applicationID, app.artistName)
                          }
                          disabled={actionLoading === app.applicationID}
                          className="rounded-xl border border-blush-800/60 bg-blush-950/40 hover:bg-blush-900/60 text-blush-300 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                        >
                          {actionLoading === app.applicationID
                            ? "Rejecting…"
                            : "Reject"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
