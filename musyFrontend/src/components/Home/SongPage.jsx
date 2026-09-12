import { useState } from "react";
import apiFetch from "../../apiFetch";

function SongPage({ song, onBack }) {
  const [likeCount, setLikeCount] = useState(song.SongId);

  const handleLike = async () => {
    const songId = song?.SongId;

    if (songId == null) {
      console.error("Song ID is missing:", song);
      return;
    }

    try {
      const response = await apiFetch(`song/${songId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Like request failed:", response.status);
        return;
      }

      setLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to like song:", error);
    }
  };

  const handledisLike = async () => {
    const songId = song?.SongId;

    if (songId == null) {
      console.error("Song ID is missing:", song);
      return;
    }

    try {
      const response = await apiFetch(`song/${songId}/like`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Dislike request failed:", response.status);
        return;
      }

      setLikeCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to dislike song:", error);
    }
  };

  return (
    <section className="glass w-full max-w-4xl rounded-3xl p-6 sm:p-8">
      <button
        type="button"
        onClick={onBack}
        className="btn-ghost mb-6 px-3 py-2 text-sm"
      >
        Back
      </button>

      <div className="grid gap-8 sm:grid-cols-[16rem_1fr]">
        <div className="overflow-hidden rounded-3xl border border-ink-800">
          <img
            src={song.coverUrl ?? song.cover_url}
            alt={`${song.title ?? "Song"} cover`}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium tracking-wide text-mist-500">
            {song.genre ?? "Music"}
          </p>
          <h1 className="font-display mt-2 text-4xl text-egg-50">
            {song.title ?? "Untitled song"}
          </h1>
          <p className="mt-3 leading-7 text-ink-300">
            {song.description ?? "No description available."}
          </p>
          <p className="mt-4 text-sm text-mist-400">
            {song.streamCount ?? 0} plays · {likeCount}likes
          </p>
          <div className="my-4 flex w-fit gap-2">
            <button
              className="btn-primary cursor-pointer px-4 py-2 text-sm"
              onClick={handleLike}
            >
              Like
            </button>
            <button
              className="btn-ghost cursor-pointer px-4 py-2 text-sm"
              onClick={handledisLike}
            >
              Dislike
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SongPage;
