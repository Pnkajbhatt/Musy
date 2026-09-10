function PlayBar({ currentSong }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 bg-green p-4">
      {!currentSong ? (
        <div>
          <p className="font-semibold">Nothing playing</p>
          <p className="text-sm text-green-300">
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

          <div className="min-w-0 shrink-0 max-w-[200px]">
            <h3 className="font-semibold truncate">
              {currentSong.title ?? "Untitled song"}
            </h3>
            <p className="text-sm text-zinc-500 truncate">
              {currentSong.genre ?? "Music"}
            </p>
          </div>

          <div className="flex-1 min-w-0">
            <audio
              controls
              src={currentSong.songUrl}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.code === "Space") {
                  e.preventDefault();
                  e.target.paused ? e.target.play() : e.target.pause();
                }
              }}
              className="w-full accent-emerald-500 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-md [&::-webkit-media-controls-enclosure]:bg-emerald-50 [&::-webkit-media-controls-panel]:bg-emerald-50 [&::-webkit-media-controls-timeline]:bg-emerald-200 [&::-webkit-media-controls-timeline]:border-emerald-500 [&::-webkit-media-controls-volume-slider]:bg-emerald-200"
            ></audio>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayBar;
