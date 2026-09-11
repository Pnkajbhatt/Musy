import { useState } from "react";
import apiFetch from "../../apiFetch";

function SomeUpload() {
  const [songRequest, setSongRequest] = useState({
    title: "",
    description: "",
    userId: "",
    genre: "",
  });
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState("");

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
              userId: Number(songRequest.userId),
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
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl overflow-hidden rounded-3xl border border-emerald-900/70 bg-[#10221e] shadow-2xl shadow-black/30"
    >
      <div className="border-b border-emerald-900/70 px-6 py-7 sm:px-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
          Musy creator studio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Share your sound
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Add a track to your library with the details listeners need to find
          it.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-7 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            Track title
            <input
              type="text"
              name="title"
              placeholder="e.g. Midnight Drive"
              value={songRequest.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Description
            <textarea
              name="description"
              placeholder="Tell listeners about this track"
              value={songRequest.description}
              onChange={handleChange}
              className="mt-2 min-h-36 w-full resize-y rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              User ID
              <input
                type="number"
                name="userId"
                placeholder="Your user ID"
                value={songRequest.userId}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Genre
              <input
                type="text"
                name="genre"
                placeholder="e.g. Indie"
                value={songRequest.genre}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-emerald-900 bg-[#0a1815] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <label
            htmlFor="songFile"
            className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-700 bg-emerald-950/30 px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-950/60"
          >
            <span className="text-3xl text-emerald-400">♪</span>
            <span className="mt-2 text-sm font-semibold text-white">
              Choose audio track
            </span>
            <span className="mt-1 text-xs text-slate-500">
              MP3, WAV, or M4A
            </span>
          </label>
          <input
            type="file"
            id="songFile"
            accept="audio/*"
            onChange={handleFileChange}
            className="sr-only"
            required
          />
          <label
            htmlFor="coverFile"
            className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-700 bg-emerald-950/30 px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-950/60"
          >
            <span className="text-3xl text-emerald-400">▧</span>
            <span className="mt-2 text-sm font-semibold text-white">
              Choose cover image
            </span>
            <span className="mt-1 text-xs text-slate-500">
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
            className="w-full rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-[#071412] transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#10221e]"
          >
            Upload song
          </button>
          {message && (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${message.includes("successfully") ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}
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
