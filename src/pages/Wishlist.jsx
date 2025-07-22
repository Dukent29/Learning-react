import { Link } from 'react-router-dom'
import { useWishlist } from '../context/useWishlist'
import SearchMovie from '../components/SearchMovie'
import styles from '../styles/Wishlist.module.css'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Wishlist ({wishlist.length})</h1>
        {wishlist.length > 0 && (
          <button 
            onClick={clearWishlist}
            className={styles.clearButton}
          >
            Clear All
          </button>
        )}
      </div>

      <SearchMovie placeholder="Search movies to add to wishlist..." />
      
      {wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Your wishlist is empty</p>
          <p>Add some movies from the main page!</p>
        </div>
      ) : (
        <div className={styles.movieGrid}>
          {wishlist.map(movie => (
            <div key={movie.id} className={styles.movieCard}>
              <Link to={`/movie/${movie.id}`} className={styles.movieLink}>
                <img 
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className={styles.moviePoster}
                />
                <div className={styles.movieInfo}>
                  <h3>{movie.title}</h3>
                  <p>⭐ {movie.vote_average?.toFixed(1)}</p>
                </div>
              </Link>
              <div className={styles.movieActions}>
                <button 
                  onClick={() => removeFromWishlist(movie.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
