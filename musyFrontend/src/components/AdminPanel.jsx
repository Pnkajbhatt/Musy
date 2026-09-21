import React, { useEffect, useState } from "react";
import apiFetch, { getCurrentUser } from "../apiFetch";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const currentUser = getCurrentUser();
  const isAdmin =
    currentUser?.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN") ||
    localStorage.getItem("role") === "ROLE_ADMIN" ||
    localStorage.getItem("role") === "ADMIN";

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("Admin/artist/applications");
      if (res.ok) {
        const json = await res.json();
        setApplications(json.data || []);
      } else {
        setMessage({ type: "error", text: "Failed to load artist applications." });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setMessage({ type: "error", text: "Error loading applications. Check backend connection." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleApprove = async (applicationId, artistName) => {
    setActionLoading(applicationId);
    try {
      const res = await apiFetch(`Admin/artist/applications/${applicationId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `"${artistName}" has been approved! User is now promoted to Artist.`,
        });
        // Update local list
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationID === applicationId
              ? { ...app, status: "APPROVED" }
              : app
          )
        );
      } else {
        setMessage({ type: "error", text: data.message || "Failed to approve application." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error during approval." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId, artistName) => {
    if (!window.confirm(`Are you sure you want to reject the application for "${artistName}"?`)) {
      return;
    }
    setActionLoading(applicationId);
    try {
      const res = await apiFetch(`Admin/artist/applications/${applicationId}/reject`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "info",
          text: `Application for "${artistName}" has been marked as Rejected.`,
        });
        // Update local list
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationID === applicationId
              ? { ...app, status: "REJECTED" }
              : app
          )
        );
      } else {
        setMessage({ type: "error", text: data.message || "Failed to reject application." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error during rejection." });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-md text-center py-16 px-6 glass rounded-3xl mx-auto">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blush-950/60 text-3xl text-blush-400">
          🔒
        </div>
        <h2 className="font-display text-2xl font-bold text-egg-50">Access Restricted</h2>
        <p className="mt-2 text-sm text-ink-300">
          This dashboard is reserved for Musy Administrators.
        </p>
        <Link to="/" className="btn-primary inline-block mt-6 px-6 py-2.5 text-sm font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  const filteredApps = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;

  return (
    <div className="w-full max-w-5xl space-y-8 py-4">
      {/* Top Header Card */}
      <section className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blush-800/60 bg-blush-950/60 px-3 py-1 text-xs font-semibold text-blush-300 mb-2">
              <span>🛡️</span>
              <span>Administrator Portal</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-egg-50 tracking-tight">
              Artist Verification Requests
            </h1>
            <p className="text-sm text-ink-300 mt-1">
              Review user applications and grant creator permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-700 hover:text-egg-50 transition self-start sm:self-auto"
          >
            {loading ? "Refreshing…" : "↻ Refresh List"}
          </button>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-800/80 pt-6">
          <div className="rounded-2xl bg-ink-900/40 p-4 border border-ink-800/50">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
              Total Applications
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-egg-50">
              {applications.length}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-950/20 p-4 border border-amber-800/30">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Pending Review
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-amber-300">
              {pendingCount}
            </p>
          </div>
          <div className="rounded-2xl bg-aqua-950/20 p-4 border border-aqua-800/30">
            <p className="text-xs font-semibold text-aqua-400 uppercase tracking-wider">
              Approved Artists
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-aqua-300">
              {approvedCount}
            </p>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-medium flex items-center justify-between border ${
            message.type === "success"
              ? "border-aqua-500/40 bg-aqua-950/40 text-aqua-300"
              : message.type === "error"
              ? "border-blush-500/40 bg-blush-950/40 text-blush-300"
              : "border-ink-700 bg-ink-900 text-ink-200"
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-ink-800 pb-3">
        {[
          ["ALL", `All (${applications.length})`],
          ["PENDING", `Pending (${pendingCount})`],
          ["APPROVED", `Approved (${approvedCount})`],
          ["REJECTED", "Rejected"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === key
                ? "bg-ink-800 text-egg-50 shadow-sm"
                : "text-ink-400 hover:text-egg-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="glass rounded-3xl p-12 text-center text-sm text-ink-400">
          Loading applications…
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-3xl mb-2">📋</p>
          <h3 className="font-display text-lg font-bold text-egg-50">
            No {filter !== "ALL" ? filter.toLowerCase() : ""} applications found
          </h3>
          <p className="mt-1 text-xs text-ink-400">
            When users apply to become an artist, their submissions will appear here.
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
                  {app.imageUrl ? (
                    <img
                      src={app.imageUrl}
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
                      Username: <span className="text-egg-50 font-medium">@{app.username}</span>
                      {app.userID && <span className="ml-1 text-ink-500">· ID #{app.userID}</span>}
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
                  Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                </span>

                <div className="flex items-center gap-2 ml-auto">
                  {app.status !== "APPROVED" && (
                    <button
                      onClick={() => handleApprove(app.applicationID, app.artistName)}
                      disabled={actionLoading === app.applicationID}
                      className="rounded-xl bg-aqua-500 hover:bg-aqua-400 text-ink-950 px-3.5 py-1.5 text-xs font-bold shadow-md shadow-aqua-500/20 transition disabled:opacity-50"
                    >
                      {actionLoading === app.applicationID ? "Approving…" : "Approve Artist"}
                    </button>
                  )}

                  {app.status !== "REJECTED" && (
                    <button
                      onClick={() => handleReject(app.applicationID, app.artistName)}
                      disabled={actionLoading === app.applicationID}
                      className="rounded-xl border border-blush-800/60 bg-blush-950/40 hover:bg-blush-900/60 text-blush-300 px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                    >
                      {actionLoading === app.applicationID ? "Rejecting…" : "Reject"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
