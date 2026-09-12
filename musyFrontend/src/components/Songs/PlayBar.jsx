function PlayBar({ currentSong, onOpenSong }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-800 bg-ink-950 px-4 py-3 sm:px-8"
      onClick={() => currentSong && onOpenSong?.()}
      role={currentSong ? "button" : undefined}
      tabIndex={currentSong ? 0 : undefined}
      onKeyDown={(event) => {
        if (currentSong && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpenSong?.();
        }
      }}
    >
      <div className="mx-auto max-w-7xl">
        {!currentSong ? (
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800 text-mist-400">
              ♪
            </span>
            <div>
              <p className="font-display text-egg-50">Nothing playing</p>
              <p className="text-sm text-ink-400">
                Choose a song to start listening
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <img
              src={currentSong.coverUrl ?? currentSong.cover_url}
              alt={currentSong.title}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 max-w-50 shrink-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="live-dot" />
                <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-400 uppercase">
                  Now playing
                </p>
              </div>
              <h3 className="font-display truncate text-egg-50">
                {currentSong.title ?? "Untitled song"}
              </h3>
              <p className="truncate text-sm text-mist-400">
                {currentSong.genre ?? "Music"} · {currentSong.songLikes ?? 0}{" "}
                likes
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <audio
                controls
                src={currentSong.songUrl ?? currentSong.song_url}
                onClick={(event) => event.stopPropagation()}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.code === "Space") {
                    e.preventDefault();
                    e.target.paused ? e.target.play() : e.target.pause();
                  }
                }}
                className="w-full rounded-md bg-transparent outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayBar;
