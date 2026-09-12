import { useState, useEffect } from "react";
import SongCard from "../Songs/SongCard";

function Home({ onPlay }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchSongs() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/songs`,
      );

      const data = await response.json();

      setSongs(Array.isArray(data) ? data : (data.data ?? []));
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {songs.map((song) => (
          <SongCard
            key={song.songId ?? song.song_id}
            song={song}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
