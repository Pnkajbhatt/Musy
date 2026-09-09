function AllSongs() {
  return (
    <div className="flex gap-2 px-4 justify-between align-middle ">
      <input
        type="text"
        name="searchbar"
        id=""
        className=" p-1 border  rounded-md "
        placeholder="searchSong"
      />
      <button
        type="submit"
        className=" p-1 rounded-md text-white  bg-green-600 hover:bg-green-500 hover:text-gray-200"
      >
        search
      </button>
    </div>
  );
}

export default AllSongs;
