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
    <div className="min-h-screen bg-[#071412] text-slate-100">
      <NavBar />

      <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center justify-center px-4 py-8 pb-28 sm:px-8">
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
