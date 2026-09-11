function PlayBar({ currentSong, onOpenSong }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-200 bg-emerald-50 p-4"
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
      {!currentSong ? (
        <div>
          <p className="font-semibold">Nothing playing</p>
          <p className="text-sm text-emerald-700">
            Choose a song to start listening
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={currentSong.coverUrl ?? currentSong.cover_url}
            alt={currentSong.title}
            className="h-14 w-14 rounded-lg object-cover shrink-0"
          />

          <div className="min-w-0 max-w-50 shrink-0">
            <h3 className="font-semibold truncate">
              {currentSong.title ?? "Untitled song"}
            </h3>
            <p className="text-sm text-zinc-500 truncate">
              {currentSong.genre ?? "Music"}
            </p>
            <p>{currentSong.songLikes ?? 0} likes</p>
          </div>

          <div className="flex-1 min-w-0">
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
              className="w-full bg-transparent accent-emerald-500 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayBar;
