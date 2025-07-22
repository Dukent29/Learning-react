import { Link } from 'react-router-dom'
import { useWishlist } from '../context/useWishlist'
import { getImageURL } from '../services/movieAPI'
import styles from '../styles/MovieRow.module.css'

const MovieRow = ({ title, movies }) => {
  const { addToWishlist, isInWishlist } = useWishlist()

  const handleAddToWishlist = (movie, e) => {
    e.preventDefault() 
    addToWishlist(movie)
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p>No movies available</p>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.movieRow}>
        {movies.slice(0, 10).map(movie => (
          <div key={movie.id} className={styles.movieCard}>
            <Link to={`/movie/${movie.id}`} className={styles.movieLink}>
              <img 
                src={getImageURL(movie.poster_path, 'w300')}
                alt={movie.title}
                className={styles.moviePoster}
                loading="lazy"
              />
              <div className={styles.movieOverlay}>
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <div className={styles.movieMeta}>
                    <span className={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}</span>
                    <span className={styles.year}>
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => handleAddToWishlist(movie, e)}
                    className={`${styles.wishlistBtn} ${isInWishlist(movie.id) ? styles.inWishlist : ''}`}
                    disabled={isInWishlist(movie.id)}
                  >
                    {isInWishlist(movie.id) ? '✓ In Wishlist' : '+ Add to Wishlist'}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieRow
