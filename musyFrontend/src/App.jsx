import Login from "./components/AuthComponents/Login";
import Register from "./components/AuthComponents/Register";
import Home from "./components/Home/Home";
import SomeUpload from "./components/Songs/SomeUpload";
import AllSongs from "./components/Songs/AllSongs";
import NavBar from "./components/navbar/NavBar";
import PlayBar from "./components/Songs/PlayBar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import SongPage from "./components/Home/SongPage";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [openedSong, setOpenedSong] = useState(null);
  const navigate = useNavigate();

  const handleOpenSong = () => {
    if (!currentSong) return;

    setOpenedSong(currentSong);
    navigate("/song");
  };

  const handleBack = () => {
    setOpenedSong(null);
    navigate("/");
  };

  return (
    <div className="app-shell min-h-screen text-ink-50">
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

      <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-7xl items-start justify-center px-4 py-8 pb-32 sm:px-8">
        <Routes>
          <Route path="/" element={<Home onPlay={setCurrentSong} />} />
          <Route
            path="/song"
            element={
              openedSong ? (
                <SongPage song={openedSong} onBack={handleBack} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/browse" element={<AllSongs />} />
          <Route path="/upload" element={<SomeUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PlayBar currentSong={currentSong} onOpenSong={handleOpenSong} />
    </div>
  );
}

export default App;
