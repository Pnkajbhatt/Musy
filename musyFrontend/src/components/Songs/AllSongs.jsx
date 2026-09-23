import { useState, useEffect } from "react";
import apiFetch from "../../apiFetch";
import SongCard from "../Songs/SongCard";
import { useSearchParams } from "react-router-dom";

function AllSongs({ onPlay }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSongs = async (q) => {
    try {
      setLoading(true);
      setError("");
      const endpoint = q ? `songs?title=${encodeURIComponent(q)}` : "songs";
      const response = await apiFetch(endpoint);
      if (!response.ok) throw new Error(`Search failed (${response.status})`);
      const data = await response.json();
      setSongs(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount or when URL query changes
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    fetchSongs(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setSearchParams(q ? { q } : {});
  };

  return (
    <section className="w-full">
      <div className="glass mb-6 w-full max-w-3xl rounded-3xl p-6 sm:p-8">
        <p className="kicker">Catalog</p>
        <h1 className="font-display mt-3 text-3xl text-egg-50">Find a track</h1>
        <p className="mt-2 mb-6 text-sm text-ink-300">
          Search by title, mood, or whatever you remember of it.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field mt-0" placeholder="Search songs"
          />
          <button type="submit" className="btn-primary shrink-0 px-5 py-3">
            Search
          </button>
        </form>
      </div>

      {loading && <p className="text-sm text-ink-400">Searching…</p>}
      {error && <p className="rounded-xl bg-blush-500/10 px-4 py-3 text-sm text-blush-200">{error}</p>}
      {!loading && !error && songs.length === 0 && (
        <p className="text-sm text-ink-400">No songs found.</p>
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
    </section>
  );
}

export default AllSongs;
