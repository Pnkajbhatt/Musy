import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiFetch, { getCurrentUser } from "../../apiFetch";
import SongCard from "../Songs/SongCard";

function Profile({ onPlay }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState("liked"); // "liked" | "history" | "uploads"

  const [allSongs, setAllSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingHistory, setClearingHistory] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Fetch all songs, liked songs, and play history
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    async function fetchProfileData() {
      setLoading(true);
      try {
        // Fetch all songs
        const songsRes = await apiFetch("song");
        let songsData = [];
        if (songsRes.ok) {
          const raw = await songsRes.json();
          songsData = Array.isArray(raw) ? raw : raw.data ?? [];
          setAllSongs(songsData);
        }

        // Fetch likes
        const likesRes = await apiFetch("likes");
        if (likesRes.ok) {
          const likesData = await likesRes.json();
          const likedList = Array.isArray(likesData)
            ? likesData
            : likesData.data ?? [];
          // Map like record's songId to the actual song object
          const matchedLikedSongs = likedList
            .map((item) => {
              const sid = String(item.songId ?? item.id);
              return songsData.find(
                (s) => String(s.songId ?? s.song_id ?? s.id) === sid
              );
            })
            .filter(Boolean);
          setLikedSongs(matchedLikedSongs);
        }

        // Fetch history
        const historyRes = await apiFetch("history");
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const histList = Array.isArray(historyData)
            ? historyData
            : historyData.data ?? [];
          // Map history record's songId to the actual song object
          const matchedHistSongs = histList
            .map((item) => {
              const sid = String(item.songId ?? item.id);
              return songsData.find(
                (s) => String(s.songId ?? s.song_id ?? s.id) === sid
              );
            })
            .filter(Boolean);
          setHistorySongs(matchedHistSongs);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [isLoggedIn]);

  const handleClearHistory = async () => {
    if (clearingHistory) return;
    setClearingHistory(true);
    try {
      const res = await apiFetch("history", { method: "DELETE" });
      if (res.ok) {
        setHistorySongs([]);
      }
    } catch (err) {
      console.error("Failed to clear history:", err);
    } finally {
      setClearingHistory(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  // Uploaded songs by current user
  const uploadedSongs = allSongs.filter(
    (song) =>
      currentUser?.userId &&
      String(song.userId) === String(currentUser.userId)
  );

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-xl text-center py-16 px-6 glass rounded-3xl">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-ink-800 text-3xl text-mist-400">
          👤
        </div>
        <h2 className="font-display text-3xl text-egg-50">Profile Sign-in</h2>
        <p className="mt-2 text-sm text-ink-300">
          Sign in to view your liked tracks, listening history, and uploaded songs.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login" className="btn-primary px-6 py-2.5 text-sm">
            Log In
          </Link>
          <Link to="/register" className="btn-ghost px-6 py-2.5 text-sm">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const username = currentUser?.username || "Musy Listener";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* Profile Header Card */}
      <section className="glass overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl bg-gradient-to-tr from-aqua-500/20 via-ink-800 to-blush-500/20 border border-ink-700/80 shadow-inner">
                <span className="font-display text-4xl sm:text-5xl font-bold text-egg-50">
                  {userInitial}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-aqua-400 border-2 border-ink-950" />
            </div>

            {/* User details */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-egg-50">
                  {username}
                </h1>
                <span className="rounded-full bg-aqua-950/80 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-aqua-300 uppercase border border-aqua-800/40">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-400">Musy Member · Listening Room</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/upload"
              className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-aqua-500/20"
            >
              <span>+</span>
              <span>Upload Track</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-700 hover:text-egg-50 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-800/80 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab("liked")}
            className={`rounded-2xl p-4 text-left transition ${
              activeTab === "liked"
                ? "bg-ink-800/80 border border-ink-700"
                : "bg-ink-900/40 hover:bg-ink-800/40"
            }`}
          >
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
              Liked Songs
            </p>
            <p className="font-display mt-1 text-2xl sm:text-3xl font-bold text-egg-50">
              {likedSongs.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`rounded-2xl p-4 text-left transition ${
              activeTab === "history"
                ? "bg-ink-800/80 border border-ink-700"
                : "bg-ink-900/40 hover:bg-ink-800/40"
            }`}
          >
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
              History
            </p>
            <p className="font-display mt-1 text-2xl sm:text-3xl font-bold text-egg-50">
              {historySongs.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("uploads")}
            className={`rounded-2xl p-4 text-left transition ${
              activeTab === "uploads"
                ? "bg-ink-800/80 border border-ink-700"
                : "bg-ink-900/40 hover:bg-ink-800/40"
            }`}
          >
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
              Uploads
            </p>
            <p className="font-display mt-1 text-2xl sm:text-3xl font-bold text-egg-50">
              {uploadedSongs.length}
            </p>
          </button>
        </div>
      </section>

      {/* Tabs Navigation & Actions */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("liked")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "liked"
                  ? "bg-ink-800 text-egg-50 shadow-sm"
                  : "text-ink-400 hover:text-egg-50"
              }`}
            >
              ❤️ Liked Songs ({likedSongs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "history"
                  ? "bg-ink-800 text-egg-50 shadow-sm"
                  : "text-ink-400 hover:text-egg-50"
              }`}
            >
              🎧 History ({historySongs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("uploads")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "uploads"
                  ? "bg-ink-800 text-egg-50 shadow-sm"
                  : "text-ink-400 hover:text-egg-50"
              }`}
            >
              🎵 My Uploads ({uploadedSongs.length})
            </button>
          </div>

          {activeTab === "history" && historySongs.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={clearingHistory}
              className="text-xs text-blush-300 hover:text-blush-200 transition disabled:opacity-50"
            >
              {clearingHistory ? "Clearing…" : "Clear History"}
            </button>
          )}
        </div>

        {/* Tab Content */}
        {loading ? (
          <p className="text-sm text-ink-400 py-8 text-center">
            Loading your music library…
          </p>
        ) : (
          <div>
            {activeTab === "liked" && (
              <div>
                {likedSongs.length === 0 ? (
                  <div className="glass rounded-3xl p-10 text-center">
                    <p className="text-3xl mb-2">♡</p>
                    <h3 className="font-display text-xl text-egg-50">
                      No liked songs yet
                    </h3>
                    <p className="mt-1 text-sm text-ink-400">
                      Tap the like button on songs you love to save them here.
                    </p>
                    <Link
                      to="/browse"
                      className="btn-primary inline-block mt-5 px-5 py-2.5 text-sm font-semibold"
                    >
                      Browse Tracks
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {likedSongs.map((song) => (
                      <SongCard
                        key={song.songId ?? song.song_id ?? song.id}
                        song={song}
                        onPlay={(s) => onPlay(s, likedSongs)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                {historySongs.length === 0 ? (
                  <div className="glass rounded-3xl p-10 text-center">
                    <p className="text-3xl mb-2">🎧</p>
                    <h3 className="font-display text-xl text-egg-50">
                      No listening history
                    </h3>
                    <p className="mt-1 text-sm text-ink-400">
                      Tracks you listen to will appear here automatically.
                    </p>
                    <Link
                      to="/"
                      className="btn-primary inline-block mt-5 px-5 py-2.5 text-sm font-semibold"
                    >
                      Start Listening
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {historySongs.map((song) => (
                      <SongCard
                        key={song.songId ?? song.song_id ?? song.id}
                        song={song}
                        onPlay={(s) => onPlay(s, historySongs)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "uploads" && (
              <div>
                {uploadedSongs.length === 0 ? (
                  <div className="glass rounded-3xl p-10 text-center">
                    <p className="text-3xl mb-2">🎙️</p>
                    <h3 className="font-display text-xl text-egg-50">
                      You haven't uploaded any tracks yet
                    </h3>
                    <p className="mt-1 text-sm text-ink-400">
                      Share your music with the Musy community!
                    </p>
                    <Link
                      to="/upload"
                      className="btn-primary inline-block mt-5 px-5 py-2.5 text-sm font-semibold"
                    >
                      Upload First Song
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {uploadedSongs.map((song) => (
                      <SongCard
                        key={song.songId ?? song.song_id ?? song.id}
                        song={song}
                        onPlay={(s) => onPlay(s, uploadedSongs)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
