function SongCard({ song }) {
  return (
    <div>
      <h1 className="text-3xl">song card</h1>
      <p>{song.title}</p>
    </div>
  );
}

export default SongCard;
