import { useState, useEffect } from "react";
import './App.css';
import MovieCard from "./components/MovieCard";

const API_URL = "http://www.omdbapi.com?apikey=2627f4da";

function App() {
  const [movies, setMovies] = useState([]);
  const [suggestedMovie, setSuggestedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedMovies, setLikedMovies] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [genreFilter, setGenreFilter] = useState("All");

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    if (data.Search) {
      const fullMovies = await Promise.all(
        data.Search.map(async (movie) => {
          const res = await fetch(`${API_URL}&i=${movie.imdbID}`);
          const fullData = await res.json();
          return fullData;
        })
      );
      setMovies(fullMovies);
    } else {
      setMovies([]);
    }
  };

  // ✅ Correctly placed outside searchMovies
  const suggestRandomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSuggestedMovie(movies[randomIndex]);
    }
  };

  useEffect(() => {
    searchMovies("Batman");
  }, []);

  const toggleLike = (movie) => {
    setLikedMovies((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID)
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  };

  const sortedMovies = [...movies].sort((a, b) =>
    sortOrder === "newest"
      ? parseInt(b.Year) - parseInt(a.Year)
      : parseInt(a.Year) - parseInt(b.Year)
  );

  const filteredMovies = sortedMovies.filter((movie) =>
    genreFilter === "All"
      ? true
      : movie.Genre?.toLowerCase().includes(genreFilter.toLowerCase())
  );

  return (
    <div className="app">
      <h1>MovieFinder</h1>

      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src="https://img.icons8.com/ios7/600/search.png"
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      <button onClick={suggestRandomMovie}>Suggest Movie</button>

      {/* ✅ Suggested Movie Display */}
      {suggestedMovie && (
        <div className="suggested">
          <h2>Suggested Movie</h2>
          <MovieCard movie={suggestedMovie} />
        </div>
      )}

      {/* ✅ Filters */}
      <div className="filters">
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="All">All Genres</option>
          <option value="Action">Action</option>
          <option value="Romance">Romance</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* ✅ Filtered Movies */}
      {filteredMovies.length > 0 ? (
        <div className="container">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onLike={toggleLike}
              isLiked={likedMovies.some((m) => m.imdbID === movie.imdbID)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Movies Found</h2>
        </div>
      )}
    </div>
  );
}

export default App;
