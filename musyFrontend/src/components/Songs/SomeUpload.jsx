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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={songRequest.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={songRequest.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="userId"
        placeholder="User ID"
        value={songRequest.userId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="genre"
        placeholder="Genre"
        value={songRequest.genre}
        onChange={handleChange}
        required
      />
      <label htmlFor="songFile" className="upload-btn">
        Upload Song
      </label>
      <input
        type="file"
        id="songFile"
        accept="audio/*"
        onChange={handleFileChange}
        required
      />
      <label htmlFor="coverFile" className="upload-btn">
        Upload Cover Image
      </label>
      <input
        type="file"
        id="coverFile"
        accept="image/*"
        onChange={handleCoverChange}
        required
      />
      <button type="submit">Upload song</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default SomeUpload;
