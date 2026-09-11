import Login from "./components/AuthComponents/Login";
import Register from "./components/AuthComponents/Register";
import Home from "./components/Home/Home";
import SomeUpload from "./components/Songs/SomeUpload";
import AllSongs from "./components/Songs/AllSongs";
import NavBar from "./components/navbar/NavBar";
import PlayBar from "./components/Songs/PlayBar";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { useState } from "react";

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <div className="min-h-screen bg-[#071412] text-slate-100">
      <NavBar />

      <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center justify-center px-4 py-8 pb-28 sm:px-8">
        <Routes>
          <Route path="/" element={<Home onPlay={setCurrentSong} />} />
          <Route path="/browse" element={<AllSongs />} />
          <Route path="/upload" element={<SomeUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PlayBar currentSong={currentSong} />
    </div>
  );
}

export default App;
