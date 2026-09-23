import { useState, useEffect } from "react";
import SongCard from "../Songs/SongCard";
import apiFetch from "../../apiFetch";

function Home({ onPlay }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        const response = await apiFetch("song");
        if (!response.ok) throw new Error(`Failed to load songs (${response.status})`);
        const data = await response.json();
        setSongs(Array.isArray(data) ? data : (data.data ?? []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  return (
    <div className="w-full">
      <header className="mb-8 max-w-2xl">
        <p className="kicker">Listening room</p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-egg-50 sm:text-5xl">
          Songs with a little more warmth.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-ink-300">
          A quiet library for the tracks you keep coming back to.
        </p>
      </header>

      {loading && (
        <p className="text-sm text-ink-400">Loading songs…</p>
      )}

      {error && (
        <p className="rounded-xl bg-blush-500/10 px-4 py-3 text-sm text-blush-200">{error}</p>
      )}

      {!loading && !error && songs.length === 0 && (
        <p className="text-sm text-ink-400">No songs found. Be the first to upload one!</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {songs.map((song) => (
          <SongCard
            key={song.songId ?? song.SongId ?? song.song_id ?? song.id}
            song={song}
            onPlay={(s) => onPlay(s, songs)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
