import { useState, useEffect } from "react";
import SongCard from "../Songs/SongCard";

function Home({ onPlay }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchSongs() {
      const response = await fetch("http://localhost:8080/api/songs");

      const data = await response.json();

      setSongs(Array.isArray(data) ? data : (data.data ?? []));
    }

    fetchSongs();
  }, []);

  return (
    <div className="flex gap-5 flex-wrap">
      {songs.map((song) => (
        <SongCard
          key={song.songId ?? song.song_id}
          song={song}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}

export default Home;
