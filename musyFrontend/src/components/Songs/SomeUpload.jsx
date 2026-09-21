import { useState } from "react";
import { Link } from "react-router-dom";
import apiFetch, { getCurrentUser } from "../../apiFetch";

function SomeUpload() {
  const currentUser = getCurrentUser();
  const isArtist =
    currentUser?.roles?.some((r) => r === "ROLE_ARTIST" || r === "ARTIST") ||
    localStorage.getItem("role") === "ROLE_ARTIST" ||
    localStorage.getItem("role") === "ARTIST";
  const isAdmin =
    currentUser?.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN") ||
    localStorage.getItem("role") === "ROLE_ADMIN" ||
    localStorage.getItem("role") === "ADMIN";

  const [songRequest, setSongRequest] = useState({
    title: "",
    description: "",
    genre: "",
  });
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState("");

  if (!isArtist) {
    return (
      <div className="glass w-full max-w-xl mx-auto overflow-hidden rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-800/80 text-3xl">
          🔒
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-egg-50">
            Artist Access Required
          </h2>
          <p className="mt-2 text-sm text-ink-300">
            Uploading music is restricted to verified artists only. Regular listeners and administrators cannot upload tracks.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {isAdmin ? (
            <Link
              to="/admin"
              className="rounded-xl border border-blush-800/80 bg-blush-950/70 px-5 py-2.5 text-sm font-semibold text-blush-300 hover:bg-blush-900/80 transition"
            >
              Go to Admin Panel
            </Link>
          ) : (
            <Link
              to="/apply-artist"
              className="btn-primary px-5 py-2.5 text-sm font-semibold"
            >
              Apply to Become an Artist
            </Link>
          )}
          <Link
            to="/"
            className="rounded-xl border border-ink-800 bg-ink-900/60 px-5 py-2.5 text-sm font-medium text-ink-300 hover:text-egg-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSongRequest((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setSongFile(event.target.files[0] ?? null);
  };

  const handleCoverChange = (event) => {
    setCoverFile(event.target.files[0] ?? null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (!songFile) {
        throw new Error("Please select a song file");
      }
      if (!coverFile) {
        throw new Error("Please select a cover image");
      }

      const formData = new FormData();
      formData.append(
        "songRequest",
        new Blob(
          [
            JSON.stringify({
              ...songRequest,
            }),
          ],
          { type: "application/json" },
        ),
      );
      formData.append("file", songFile);
      formData.append("cover", coverFile);

      const response = await apiFetch("song", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { message: responseText };
        }
      }
      if (!response.ok) {
        throw new Error(data.message || "Song upload failed");
      }

      setMessage("Song uploaded successfully");
      setSongRequest({
        title: "",
        description: "",

        genre: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass w-full max-w-4xl overflow-hidden rounded-3xl"
    >
      <div className="border-b border-mist-800/40 px-6 py-7 sm:px-10">
        <p className="kicker">Musy creator studio</p>
        <h1 className="font-display mt-3 text-3xl text-egg-50 sm:text-4xl">
          Share your sound
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-300">
          Add a track to your library with the details listeners need to find
          it.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-7 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <label className="block text-sm font-medium text-mist-200">
            Track title
            <input
              type="text"
              name="title"
              placeholder="e.g. Midnight Drive"
              value={songRequest.title}
              onChange={handleChange}
              className="field"
              required
            />
          </label>
          <label className="block text-sm font-medium text-mist-200">
            Description
            <textarea
              name="description"
              placeholder="Tell listeners about this track"
              value={songRequest.description}
              onChange={handleChange}
              className="field min-h-36 resize-y"
              required
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-mist-200">
              Genre
              <input
                type="text"
                name="genre"
                placeholder="e.g. Indie"
                value={songRequest.genre}
                onChange={handleChange}
                className="field"
                required
              />
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <label htmlFor="songFile" className="dropzone">
            <span className="text-3xl text-mist-500">♪</span>
            <span className="mt-2 text-sm font-semibold text-egg-50">
              {songFile ? songFile.name : "Choose audio track"}
            </span>
            <span className="mt-1 text-xs text-ink-400">MP3, WAV, or M4A</span>
          </label>
          <input
            type="file"
            id="songFile"
            accept="audio/*"
            onChange={handleFileChange}
            className="sr-only"
            required
          />
          <label htmlFor="coverFile" className="dropzone">
            <span className="text-3xl text-egg-300">▧</span>
            <span className="mt-2 text-sm font-semibold text-egg-50">
              {coverFile ? coverFile.name : "Choose cover image"}
            </span>
            <span className="mt-1 text-xs text-ink-400">
              JPG or PNG artwork
            </span>
          </label>
          <input
            type="file"
            id="coverFile"
            accept="image/*"
            onChange={handleCoverChange}
            className="sr-only"
            required
          />
          <button
            type="submit"
            className="btn-primary w-full px-5 py-3.5 text-sm"
          >
            Upload song
          </button>
          {message && (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${
                message.includes("successfully")
                  ? "bg-aqua-900 text-aqua-200"
                  : "bg-blush-500/10 text-blush-200"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

export default SomeUpload;
