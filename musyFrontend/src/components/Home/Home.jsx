import { useState, useEffect } from "react";
import SongCard from "../Songs/SongCard";

function Home() {
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
    <div>
      <h1>this is home</h1>
      {songs.map((song) => (
        <SongCard key={song.song_id} song={song} />
      ))}
    </div>
  );
}

export default Home;
