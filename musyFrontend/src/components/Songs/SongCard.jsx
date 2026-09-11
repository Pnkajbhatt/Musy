function SongCard({ song, onPlay }) {
  const coverUrl = song.coverUrl ?? song.cover_url;
  const songUrl = song.songUrl ?? song.song_url;

  const handlePlay = () => {
    if (!songUrl) return;
    onPlay(song);
  };

  return (
    <article
      onClick={handlePlay}
      className="
        group
        flex max-w-xl gap-2
        rounded-2xl
        border border-zinc-100
        p-2
        shadow-sm
        transition-shadow
        hover:cursor-pointer
        hover:shadow-md 
        w-96
      "
    >
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-32 sm:w-32">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${song.title ?? "Song"} cover`}
            loading="lazy"
            className="
              h-full w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-2xl text-zinc-400">
            ♪
          </div>
        )}

        {/* Genre */}
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          {song.genre ?? "Music"}
        </span>

        {/* Play overlay */}
        <div
          className="
            absolute inset-0
            grid place-items-center
            bg-black/0
            transition
            duration-200
            group-hover:bg-black/20
          "
        >
          <div
            className="
              scale-75
              rounded-full
              bg-white
              p-3
              text-black
              opacity-0
              shadow-lg
              transition
              duration-200
              group-hover:scale-100
              group-hover:opacity-100
            "
          >
            ▶
          </div>
        </div>
      </div>

      {/* Song information */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">
          <h2 className="truncate font-semibold text-green-500">
            {song.title ?? "Untitled song"}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
            {song.description ?? "No description available."}
          </p>
        </div>

        {/* Metadata */}
        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
          <span>{song.streamCount ?? 0} plays</span>

          {song.createdAt && (
            <time dateTime={song.createdAt}>
              {new Date(song.createdAt).toLocaleDateString()}
            </time>
          )}
        </div>
      </div>
    </article>
  );
}

export default SongCard;
