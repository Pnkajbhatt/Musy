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
      className="song-card glass group flex w-full cursor-pointer gap-4 rounded-3xl p-3"
    >
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-ink-800 sm:h-32 sm:w-32">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${song.title ?? "Song"} cover`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-ink-800 text-2xl text-mist-400">
            ♪
          </div>
        )}

        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink-950/80 px-2 py-0.5 text-[10px] font-medium tracking-wide text-egg-100">
          {song.genre ?? "Music"}
        </span>

        <div className="absolute inset-0 grid place-items-center bg-ink-950/0 transition duration-200 group-hover:bg-ink-950/25">
          <div className="play-orb scale-75 rounded-full p-3 opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100">
            ▶
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex-1">
          <h2 className="font-display truncate text-lg text-egg-50">
            {song.title ?? "Untitled song"}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-300">
            {song.description ?? "No description available."}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-mist-400">
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
