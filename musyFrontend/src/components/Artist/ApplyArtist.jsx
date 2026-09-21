import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiFetch, { getCurrentUser } from "../../apiFetch";

function ApplyArtist() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    artistName: "",
    genre: "Electronic",
    bio: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Fetch current application status
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    async function checkStatus() {
      setLoading(true);
      try {
        const res = await apiFetch("users/artist/status");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setApplication(json.data);
          }
        }
      } catch (err) {
        console.error("Error checking artist application:", err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.artistName.trim()) {
      setError("Please enter your Artist Name");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("artistName", formData.artistName.trim());
      data.append("genre", formData.genre);
      data.append("bio", formData.bio.trim());
      if (profileFile) {
        data.append("file", profileFile);
      }

      const res = await apiFetch("users/artist/apply", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.data) {
        setApplication(result.data);
        setSuccessMsg("Your application has been submitted successfully!");
      } else {
        setError(result.message || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-lg text-center py-16 px-6 glass rounded-3xl">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-ink-800 text-3xl">
          🎙️
        </div>
        <h2 className="font-display text-3xl text-egg-50">Join as an Artist</h2>
        <p className="mt-2 text-sm text-ink-300">
          Sign in or create an account to submit your artist verification application.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login" className="btn-primary px-6 py-2.5 text-sm">
            Log In
          </Link>
          <Link to="/register" className="btn-ghost px-6 py-2.5 text-sm">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const isApproved =
    application?.status === "APPROVED" ||
    currentUser?.roles?.includes("ROLE_ARTIST") ||
    currentUser?.roles?.includes("ARTIST");

  const isPending = application?.status === "PENDING";

  return (
    <div className="w-full max-w-2xl space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-aqua-800/60 bg-aqua-950/60 px-3 py-1 text-xs font-semibold text-aqua-300">
          <span>✨</span>
          <span>Musy Creator Hub</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-egg-50 tracking-tight">
          Apply to Become an Artist
        </h1>
        <p className="text-sm text-ink-300 max-w-md mx-auto">
          Share your sound with the world. Once verified by our team, you'll be able to publish music directly to Musy.
        </p>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-12 text-center text-sm text-ink-400">
          Checking your application status…
        </div>
      ) : isApproved ? (
        /* Approved Card */
        <div className="glass rounded-3xl p-8 text-center space-y-5 border border-aqua-500/30">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-aqua-500/20 text-3xl text-aqua-400">
            ✓
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-egg-50">
              You are a Verified Artist!
            </h2>
            <p className="mt-1 text-sm text-ink-300">
              Your artist profile is live. Start uploading your original tracks now.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/upload"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-lg shadow-aqua-500/20"
            >
              <span>+</span>
              <span>Upload New Track</span>
            </Link>
          </div>
        </div>
      ) : isPending ? (
        /* Pending Application Card */
        <div className="glass rounded-3xl p-8 space-y-6 border border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/20 text-2xl text-amber-400">
              ⏳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-egg-50">
                  Application Under Review
                </h2>
                <span className="rounded-full bg-amber-950/80 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 uppercase border border-amber-800/40">
                  Pending
                </span>
              </div>
              <p className="text-xs text-ink-300 mt-0.5">
                Our administrators are reviewing your submission.
              </p>
            </div>
          </div>

          {/* Submitted Details Box */}
          <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-400">Artist Name:</span>
              <span className="font-semibold text-egg-50">{application.artistName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-400">Primary Genre:</span>
              <span className="font-medium text-egg-50">{application.genre || "Not specified"}</span>
            </div>
            {application.bio && (
              <div className="pt-2 border-t border-ink-800/80 text-sm">
                <span className="text-ink-400 block mb-1 text-xs">Bio:</span>
                <p className="text-ink-200 text-xs italic">{application.bio}</p>
              </div>
            )}
            {application.imageUrl && (
              <div className="pt-2 border-t border-ink-800/80 flex items-center gap-3">
                <img
                  src={application.imageUrl}
                  alt={application.artistName}
                  className="h-12 w-12 rounded-xl object-cover border border-ink-700"
                />
                <span className="text-xs text-ink-400">Uploaded Profile Photo</span>
              </div>
            )}
          </div>

          <p className="text-xs text-ink-400 text-center">
            Applications are typically reviewed within 24 to 48 hours.
          </p>
        </div>
      ) : (
        /* Application Form */
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="rounded-2xl border border-blush-500/40 bg-blush-950/40 p-4 text-xs text-blush-300">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-2xl border border-aqua-500/40 bg-aqua-950/40 p-4 text-xs text-aqua-300">
              {successMsg}
            </div>
          )}

          {application?.status === "REJECTED" && (
            <div className="rounded-2xl border border-blush-800/60 bg-blush-950/40 p-4 text-xs text-blush-300">
              ⚠️ Your previous application was not approved. You can submit an updated profile below.
            </div>
          )}

          {/* Artist / Stage Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300">
              Artist / Stage Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luna Eclipse, RetroWave Beats"
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              className="w-full rounded-2xl border border-ink-700/80 bg-ink-900/80 px-4 py-3 text-sm text-egg-50 outline-none transition focus:border-aqua-400"
            />
          </div>

          {/* Primary Genre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300">
              Primary Genre *
            </label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full rounded-2xl border border-ink-700/80 bg-ink-900/80 px-4 py-3 text-sm text-egg-50 outline-none transition focus:border-aqua-400"
            >
              <option value="Electronic">Electronic / EDM</option>
              <option value="Hip Hop">Hip Hop / Rap</option>
              <option value="Lo-Fi">Lo-Fi / Chill</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock / Indie</option>
              <option value="R&B">R&B / Soul</option>
              <option value="Classical">Classical / Ambient</option>
              <option value="Jazz">Jazz / Blues</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300">
              Artist Bio / Tell Us About Your Music
            </label>
            <textarea
              rows={4}
              placeholder="Write a few sentences about your musical journey, influences, and what kind of music you create..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-2xl border border-ink-700/80 bg-ink-900/80 px-4 py-3 text-sm text-egg-50 outline-none transition focus:border-aqua-400"
            />
          </div>

          {/* Profile Photo / Artwork */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-300">
              Artist Profile Photo / Artwork (JPG or PNG)
            </label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-16 w-16 rounded-2xl object-cover border border-ink-700 shadow-md"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-ink-700 bg-ink-900/50 text-2xl text-ink-500">
                  📷
                </div>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="text-xs text-ink-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-ink-800 file:text-egg-50 hover:file:bg-ink-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg shadow-aqua-500/20 disabled:opacity-50"
            >
              {submitting ? "Submitting Application…" : "Submit Artist Application"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ApplyArtist;
