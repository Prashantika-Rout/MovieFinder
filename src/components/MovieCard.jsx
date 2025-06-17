const MovieCard = ({ movie, onLike, isLiked }) => {
  const { imdbID, Year, Poster, Title, Type, Genre } = movie;

  return (
    <div className="movie" key={imdbID}>
      <div>
        <p>{Year}</p>
        <p>{Genre}</p>
      </div>
      <div>
        <img
          src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/400"}
          alt={Title}
        />
      </div>
      <div>
        <span>{Type}</span>
        <h3>{Title}</h3>
        <button onClick={() => onLike(movie)}>
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

