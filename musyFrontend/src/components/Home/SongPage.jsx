import { useState, useEffect } from "react";
import apiFetch, { resolveMediaUrl } from "../../apiFetch";

function SongPage({ song, onBack, onPlay, isPlaying = false }) {
  // Normalize songId — backend may return songId or song_id
  const songId = song?.songId ?? song?.song_id ?? song?.id;
  const coverUrl = resolveMediaUrl(song?.coverUrl ?? song?.cover_url);
  const songUrl = resolveMediaUrl(song?.songUrl ?? song?.song_url);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  // Fetch like status and count on mount
  useEffect(() => {
    if (!songId) return;

    // Always fetch public like count
    apiFetch(`likes/${songId}/count`)
      .then((r) => r.ok ? r.json() : { count: 0 })
      .then((data) => setLikeCount(data.count ?? 0))
      .catch(() => {});

    // Fetch personal like status only if logged in
    if (isLoggedIn) {
      apiFetch(`likes/${songId}/status`)
        .then((r) => r.ok ? r.json() : { liked: false })
        .then((data) => setLiked(data.liked ?? false))
        .catch(() => {});
    }

    // Record this song play in history (fire and forget)
    if (isLoggedIn) {
      apiFetch(`history/${songId}`, { method: "POST" }).catch(() => {});
    }
  }, [songId, isLoggedIn]);

  const handleToggleLike = async () => {
    if (!isLoggedIn || !songId || likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        const res = await apiFetch(`likes/${songId}`, { method: "DELETE" });
        if (res.ok) { setLiked(false); setLikeCount((p) => Math.max(0, p - 1)); }
      } else {
        const res = await apiFetch(`likes/${songId}`, { method: "POST" });
        if (res.ok) { setLiked(true); setLikeCount((p) => p + 1); }
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <section className="glass w-full max-w-4xl rounded-3xl p-6 sm:p-8">
      <button type="button" onClick={onBack} className="btn-ghost mb-6 px-3 py-2 text-sm">
        ← Back
      </button>

      <div className="grid gap-8 sm:grid-cols-[16rem_1fr]">
        <div className="overflow-hidden rounded-3xl border border-ink-800">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`${song.title ?? "Song"} cover`}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center bg-ink-800 text-5xl text-mist-400">♪</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium tracking-wide text-mist-500">{song.genre ?? "Music"}</p>
          <h1 className="font-display mt-2 text-4xl text-egg-50">{song.title ?? "Untitled song"}</h1>
          <p className="mt-3 leading-7 text-ink-300">{song.description ?? "No description available."}</p>
          <p className="mt-4 text-sm text-mist-400">
            {song.streamCount ?? 0} plays · {likeCount} {likeCount === 1 ? "like" : "likes"}
          </p>

          <div className="my-5 flex flex-wrap items-center gap-3">

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={likeLoading}
                className={`px-5 py-2.5 text-sm rounded-xl font-semibold transition disabled:opacity-50 ${
                  liked ? "btn-ghost" : "bg-ink-800/80 hover:bg-ink-700 text-egg-100"
                }`}
              >
                {likeLoading ? "…" : liked ? "♥ Liked" : "♡ Like"}
              </button>
            ) : (
              <p className="text-sm text-ink-400">Log in to like this track.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SongPage;
