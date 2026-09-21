import { useState, useEffect, useRef } from "react";
import { resolveMediaUrl } from "../../apiFetch";

function PlayBar({
  currentSong,
  isPlaying,
  setIsPlaying,
  onNextSong,
  onPreviousSong,
  onOpenSong,
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const songUrl = resolveMediaUrl(
    currentSong?.songUrl ?? currentSong?.song_url
  );
  const coverUrl = resolveMediaUrl(
    currentSong?.coverUrl ?? currentSong?.cover_url
  );

  // Handle playback state synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Playback error:", err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [songUrl, isPlaying]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!audioRef.current || !songUrl) return;
    setIsPlaying?.(!isPlaying);
  };

  const skipTime = (seconds, e) => {
    e?.stopPropagation();
    if (!audioRef.current) return;
    const newTime = Math.max(
      0,
      Math.min(duration || 0, audioRef.current.currentTime + seconds)
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolume = (e) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isMuted) {
      const restoreVol = volume || 0.5;
      audioRef.current.volume = restoreVol;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec < 0) return "0:00";
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="playbar-container fixed bottom-0 left-0 right-0 z-50 border-t border-ink-800/80 bg-ink-950/95 px-4 py-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:px-8"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      {/* Hidden audio element for clean reliable playback */}
      {songUrl && (
        <audio
          ref={audioRef}
          src={songUrl}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            if (onNextSong) {
              onNextSong();
            } else {
              setIsPlaying?.(false);
              setCurrentTime(0);
            }
          }}
          onPlay={() => setIsPlaying?.(true)}
          onPause={() => setIsPlaying?.(false)}
        />
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {!currentSong ? (
          <div className="flex w-full items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 border border-ink-800 text-mist-400">
                ♪
              </span>
              <div>
                <p className="font-display text-sm text-egg-50">
                  Nothing playing
                </p>
                <p className="text-xs text-ink-400">
                  Select any track to start listening
                </p>
              </div>
            </div>
            <div className="hidden text-xs text-ink-500 sm:block">
              Musy Player · Ready
            </div>
          </div>
        ) : (
          <>
            {/* Left: Song details */}
            <div
              onClick={() => onOpenSong?.()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpenSong?.();
              }}
              className="flex min-w-0 max-w-[220px] sm:max-w-[280px] cursor-pointer items-center gap-3 group rounded-xl p-1 transition hover:bg-ink-900/50"
              title="Click to view song details"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-ink-800 shadow-md">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={currentSong.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-ink-800 text-mist-400">
                    ♪
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] grid place-items-center">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {isPlaying && <span className="live-dot" />}
                  <h3 className="truncate font-display text-sm font-semibold text-egg-50 group-hover:text-white transition">
                    {currentSong.title ?? "Untitled song"}
                  </h3>
                </div>
                <p className="truncate text-xs text-mist-400">
                  {currentSong.genre ?? "Music"}
                  {currentSong.songLikes !== undefined && (
                    <span> · {currentSong.songLikes} likes</span>
                  )}
                </p>
              </div>
            </div>

            {/* Center: Playback Controls & Progress Bar */}
            <div className="flex flex-1 max-w-xl flex-col items-center justify-center gap-1">
              {/* Buttons row */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Previous Song button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviousSong?.();
                  }}
                  title="Previous song"
                  className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full text-ink-200 transition hover:bg-ink-800/80 hover:text-egg-50 active:scale-90"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Play / Pause button (Enlarged, White) */}
                <button
                  type="button"
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white text-ink-950 shadow-xl shadow-white/25 transition hover:scale-105 hover:bg-neutral-100 active:scale-95"
                >
                  {isPlaying ? (
                    <svg
                      className="h-6 w-6 sm:h-7 sm:w-7 fill-current text-ink-950"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1.5" />
                      <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 sm:h-7 sm:w-7 fill-current text-ink-950 translate-x-0.5"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                  )}
                </button>

                {/* Next Song button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNextSong?.();
                  }}
                  title="Next song"
                  className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full text-ink-200 transition hover:bg-ink-800/80 hover:text-egg-50 active:scale-90"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar & Timestamps (White Playbar) */}
              <div className="flex w-full items-center gap-2 sm:gap-3 text-[11px] font-mono text-ink-400">
                <span className="w-9 text-right">{formatTime(currentTime)}</span>
                <div className="relative flex flex-1 items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-800 accent-white hover:bg-ink-700 transition"
                    style={{
                      background: `linear-gradient(to right, #ffffff ${progressPercent}%, #2e3138 ${progressPercent}%)`,
                    }}
                  />
                </div>
                <span className="w-9 text-left">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Volume & Open Action */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                  className="p-1.5 text-ink-400 hover:text-egg-50 rounded-lg transition"
                >
                  {isMuted || volume === 0 ? (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                  className="h-1.5 w-16 sm:w-20 cursor-pointer appearance-none rounded-full bg-ink-800 accent-white"
                />
              </div>

              {/* View Track Page Button */}
              <button
                type="button"
                onClick={() => onOpenSong?.()}
                title="View full track page"
                className="rounded-xl border border-ink-800/80 bg-ink-900/80 px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:border-ink-700 hover:text-egg-50 transition"
              >
                Track details ↗
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayBar;
