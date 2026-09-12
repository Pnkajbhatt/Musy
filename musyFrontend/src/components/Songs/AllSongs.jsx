function AllSongs() {
  return (
    <section className="glass w-full max-w-3xl rounded-3xl p-6 sm:p-8">
      <p className="kicker">Catalog</p>
      <h1 className="font-display mt-3 text-3xl text-egg-50">Find a track</h1>
      <p className="mt-2 mb-6 text-sm text-ink-300">
        Search by title, mood, or whatever you remember of it.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          name="searchbar"
          className="field mt-0"
          placeholder="Search songs"
        />
        <button type="submit" className="btn-primary shrink-0 px-5 py-3">
          Search
        </button>
      </div>
    </section>
  );
}

export default AllSongs;
