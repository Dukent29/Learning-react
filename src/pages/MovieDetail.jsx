import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { movieAPI } from '../services/movieAPI'
import { useWishlist } from '../context/useWishlist'
import styles from '../styles/MovieDetail.module.css'

const MovieDetail = () => {
  const { id } = useParams()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trailerKey, setTrailerKey] = useState(null)

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [movieDetails, credits, similar] = await Promise.all([
          movieAPI.getMovieDetails(id),
          movieAPI.getMovieCredits(id),
          movieAPI.getSimilarMovies(id)
        ])

        setMovie(movieDetails)
        setCast(credits.cast?.slice(0, 10) || []) // Get first 10 cast members
        setSimilarMovies(similar.results?.slice(0, 6) || []) // Get first 6 similar movies

        if (movieDetails.videos?.results) {
          const trailer = movieDetails.videos.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          )
          setTrailerKey(trailer?.key)
        }

      } catch (err) {
        console.error('Error fetching movie details:', err)
        setError('Failed to load movie details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovieData()
    }
  }, [id])

  const handleWishlistToggle = () => {
    if (isInWishlist(movie.id)) {
      removeFromWishlist(movie.id)
    } else {
      addToWishlist(movie)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Movie not found'}</p>
          <Link to="/" className={styles.backButton}>
            Back to Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.posterSection}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className={styles.poster}
            />
          </div>
          
          <div className={styles.movieInfo}>
            <h1 className={styles.title}>{movie.title}</h1>
            
            <div className={styles.movieMeta}>
              <span className={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}/10</span>
              <span className={styles.releaseDate}>{formatDate(movie.release_date)}</span>
              {movie.runtime && <span className={styles.runtime}>{formatRuntime(movie.runtime)}</span>}
            </div>

            <div className={styles.genres}>
              {movie.genres?.map(genre => (
                <span key={genre.id} className={styles.genre}>
                  {genre.name}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              {trailerKey && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trailerButton}
                >
                  ▶️ Play Trailer
                </a>
              )}
              
              <button 
                onClick={handleWishlistToggle}
                className={`${styles.wishlistButton} ${isInWishlist(movie.id) ? styles.inWishlist : ''}`}
              >
                {isInWishlist(movie.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
            </div>

            <div className={styles.description}>
              <h3>Synopsis</h3>
              <p>{movie.overview || 'No description available.'}</p>
            </div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section className={styles.section}>
          <h2>Cast Principal</h2>
          <div className={styles.castGrid}>
            {cast.map(actor => (
              <div key={actor.id} className={styles.castCard}>
                <img 
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : '/api/placeholder/200/300'
                  }
                  alt={actor.name}
                  className={styles.actorPhoto}
                />
                <div className={styles.actorInfo}>
                  <h4>{actor.name}</h4>
                  <p>{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {similarMovies.length > 0 && (
        <section className={styles.section}>
          <h2>Films Similaires</h2>
          <div className={styles.similarGrid}>
            {similarMovies.map(similarMovie => (
              <Link 
                key={similarMovie.id} 
                to={`/movie/${similarMovie.id}`}
                className={styles.similarCard}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                  alt={similarMovie.title}
                  className={styles.similarPoster}
                />
                <div className={styles.similarInfo}>
                  <h4>{similarMovie.title}</h4>
                  <p>⭐ {similarMovie.vote_average?.toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.backSection}>
        <Link to="/" className={styles.backButton}>
          ← Back to Movies
        </Link>
      </div>
    </div>
  )
}

export default MovieDetail
