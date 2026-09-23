import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import apiFetch, { getCurrentUser } from "./apiFetch";
import Login from "./components/AuthComponents/Login";
import Register from "./components/AuthComponents/Register";
import Home from "./components/Home/Home";
import SomeUpload from "./components/Songs/SomeUpload";
import AllSongs from "./components/Songs/AllSongs";
import ApplyArtist from "./components/Artist/ApplyArtist";
import PlayBar from "./components/Songs/PlayBar";
import NavBar from "./components/navbar/NavBar";
import SongPage from "./components/Home/SongPage";
import AdminPanel from "./components/AdminPanel";
import Profile from "./components/Profile/Profile";
import "./index.css";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [openedSong, setOpenedSong] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("song")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        if (list.length > 0) setPlaylist(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentSong) {
      const token = localStorage.getItem("token");
      const currentUser = getCurrentUser();
      const isAdmin =
        currentUser?.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN") ||
        localStorage.getItem("role") === "ROLE_ADMIN" ||
        localStorage.getItem("role") === "ADMIN";
      const songId =
        currentSong.songId ??
        currentSong.SongId ??
        currentSong.song_id ??
        currentSong.id;
      if (token && !isAdmin && songId) {
        apiFetch(`history/${songId}`, { method: "POST" }).catch(() => {});
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const handleLikeToggled = (e) => {
      const { songId, liked } = e.detail;
      setCurrentSong((prev) => {
        if (!prev) return prev;
        const prevId = String(
          prev.songId ?? prev.SongId ?? prev.song_id ?? prev.id
        );
        if (prevId === String(songId)) {
          return {
            ...prev,
            songLikes: Math.max(0, (prev.songLikes || 0) + (liked ? 1 : -1)),
          };
        }
        return prev;
      });
      setPlaylist((prev) =>
        prev.map((s) => {
          const sId = String(s.songId ?? s.SongId ?? s.song_id ?? s.id);
          if (sId === String(songId)) {
            return {
              ...s,
              songLikes: Math.max(0, (s.songLikes || 0) + (liked ? 1 : -1)),
            };
          }
          return s;
        })
      );
    };
    window.addEventListener("like-toggled", handleLikeToggled);
    return () => window.removeEventListener("like-toggled", handleLikeToggled);
  }, []);

  const handlePlaySong = (song, list = null) => {
    if (!song) return;
    if (list && list.length > 0) {
      setPlaylist(list);
    }
    const songId = song.songId ?? song.SongId ?? song.song_id ?? song.id;
    const currentId =
      currentSong?.songId ??
      currentSong?.SongId ??
      currentSong?.song_id ??
      currentSong?.id;

    if (currentId && currentId === songId) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleNextSong = () => {
    if (playlist.length === 0) return;
    const currentId =
      currentSong?.songId ??
      currentSong?.SongId ??
      currentSong?.song_id ??
      currentSong?.id;
    const currentIndex = playlist.findIndex(
      (s) => (s.songId ?? s.SongId ?? s.song_id ?? s.id) === currentId
    );
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePreviousSong = () => {
    if (playlist.length === 0) return;
    const currentId =
      currentSong?.songId ??
      currentSong?.SongId ??
      currentSong?.song_id ??
      currentSong?.id;
    const currentIndex = playlist.findIndex(
      (s) => (s.songId ?? s.SongId ?? s.song_id ?? s.id) === currentId
    );
    const prevIndex =
      currentIndex === -1
        ? 0
        : (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const handleOpenSong = (songToOpen) => {
    const target = songToOpen || currentSong;
    if (!target) return;
    setOpenedSong(target);
    navigate("/song");
  };

  const handleBack = () => {
    setOpenedSong(null);
    navigate("/");
  };

  return (
    <div className="app-shell flex min-h-screen flex-col text-ink-50">
      <div className="ambient-blob ambient-blob-twelve" aria-hidden="true" />

      <div className="ambient-blob ambient-blob-one" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-two" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-three" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-four" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-five" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-six" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-seven" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-eight" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-ten" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-eleven" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-nine" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-thirteen" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-fourteen " aria-hidden="true" />
      <div className="ambient-blob ambient-blob-fifteen " aria-hidden="true" />
      <NavBar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-start justify-center px-4 py-8 pb-40 sm:px-8">
        <Routes>
          <Route path="/" element={<Home onPlay={handlePlaySong} />} />
          <Route
            path="/song"
            element={
              openedSong ? (
                <SongPage
                  song={openedSong}
                  onBack={handleBack}
                  onPlay={handlePlaySong}
                  isPlaying={
                    isPlaying &&
                    (currentSong?.songId ?? currentSong?.SongId ?? currentSong?.id) ===
                      (openedSong?.songId ?? openedSong?.SongId ?? openedSong?.id)
                  }
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/browse" element={<AllSongs onPlay={handlePlaySong} />} />
          <Route path="/upload" element={<SomeUpload />} />
          <Route path="/profile" element={<Profile onPlay={handlePlaySong} />} />
          <Route path="/apply-artist" element={<ApplyArtist />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PlayBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNextSong={handleNextSong}
        onPreviousSong={handlePreviousSong}
        onOpenSong={() => handleOpenSong(currentSong)}
      />
    </div>
  );
}

export default App;
