import apiFetch from "../../apiFetch";

function SongPage({ song, onBack }) {
  const handleLike = () => {
    const songId = song.songId;
    apiFetch(`song/${songId}/like`, {
      method: "POST",
    });
  };
  const handledisLike = () => {
    const songId = song.songId;
    apiFetch(`/song/${songId}/like`, {
      method: "DELETE",
    });
  };
  return (
    <section className="w-full max-w-4xl rounded-2xl bg-white p-6 text-zinc-900 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
      >
        Back
      </button>

      <div className="grid gap-6 sm:grid-cols-[16rem_1fr]">
        <img
          src={song.coverUrl ?? song.cover_url}
          alt={`${song.title ?? "Song"} cover`}
          className="aspect-square w-full rounded-xl object-cover bg-zinc-100"
        />

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-emerald-600">
            {song.genre ?? "Music"}
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {song.title ?? "Untitled song"}
          </h1>
          <p className="mt-3 text-zinc-600">
            {song.description ?? "No description available."}
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            {song.streamCount ?? 0} plays
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            <p>{song.songLikes ?? 0} likes</p>
          </p>
          <div className="flex gap-2 w-fit my-2">
            <button
              className="border px-2 rounded-xl cursor-pointer"
              onClick={handleLike}
            >
              Like
            </button>
            <button
              className="border px-2 rounded-xl cursor-pointer "
              onClick={handledisLike}
            >
              Dislike
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SongPage;
