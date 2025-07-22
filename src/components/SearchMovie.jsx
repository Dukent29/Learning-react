import { useState, useEffect, useRef } from 'react'
import { movieAPI, getImageURL } from '../services/movieAPI'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/useWishlist'
import styles from '../styles/SearchMovie.module.css'

const SearchMovie = ({ placeholder = "Search movies..." }) => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [popularMovies, setPopularMovies] = useState([]) // Add popular movies state
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { addToWishlist, isInWishlist } = useWishlist()
  const searchRef = useRef(null) // Add ref for the search container

  // Load popular movies when component mounts
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const response = await movieAPI.getPopular()
        setPopularMovies(response.results?.slice(0, 8) || [])
      } catch (error) {
        console.error('Error loading popular movies:', error)
      }
    }
    loadPopularMovies()
  }, [])

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounce search function - now triggers on any input
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length > 0) { // Changed from > 2 to > 0
        searchMovies(query)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300) // Reduced delay from 500ms to 300ms for faster response

    return () => clearTimeout(delayedSearch)
  }, [query])

  const searchMovies = async (searchQuery) => {
    try {
      setLoading(true)
      const response = await movieAPI.searchMovies(searchQuery)
      setSearchResults(response.results?.slice(0, 12) || []) // Increased from 8 to 12 results
      setShowResults(true)
    } catch (error) {
      console.error('Error searching movies:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (query.trim().length === 0 && popularMovies.length > 0) {
      // Show popular movies when input is focused but empty
      setSearchResults(popularMovies)
      setShowResults(true)
    } else if (searchResults.length > 0) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Let click outside handler manage closing
    // This prevents issues when clicking on search results
  }

  const handleAddToWishlist = (movie, e) => {
    e.preventDefault()
    e.stopPropagation()
    addToWishlist(movie)
  }

  const clearSearch = () => {
    setQuery('')
    // Show popular movies when search is cleared
    if (popularMovies.length > 0) {
      setSearchResults(popularMovies)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchBox}>
        <div className={styles.searchInput}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className={styles.input}
          />
          {query && (
            <button 
              onClick={clearSearch}
              className={styles.clearButton}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {showResults && (
          <div 
            className={styles.searchResults}
            onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking on results
          >
            {loading ? (
              <div className={styles.loadingSearch}>
                <div className={styles.searchSpinner}></div>
                <span>Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <span>
                    {query.trim().length > 0 
                      ? `Search Results (${searchResults.length})` 
                      : `Popular Movies (${searchResults.length})`
                    }
                  </span>
                </div>
                {searchResults.map(movie => (
                  <Link 
                    key={movie.id} 
                    to={`/movie/${movie.id}`}
                    className={styles.resultItem}
                    onClick={() => setShowResults(false)}
                  >
                    <img 
                      src={getImageURL(movie.poster_path, 'w92')}
                      alt={movie.title}
                      className={styles.resultPoster}
                      onError={(e) => {
                        e.target.src = '/placeholder-movie.jpg'
                      }}
                    />
                    <div className={styles.resultInfo}>
                      <h4 className={styles.resultTitle}>{movie.title}</h4>
                      <div className={styles.resultMeta}>
                        <span className={styles.resultYear}>
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                        </span>
                        <span className={styles.resultRating}>
                          ⭐ {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleAddToWishlist(movie, e)}
                      className={`${styles.resultWishlistBtn} ${isInWishlist(movie.id) ? styles.inWishlist : ''}`}
                      disabled={isInWishlist(movie.id)}
                      title={isInWishlist(movie.id) ? 'Already in wishlist' : 'Add to wishlist'}
                    >
                      {isInWishlist(movie.id) ? '✓' : '+'}
                    </button>
                  </Link>
                ))}
              </>
            ) : query.length > 0 ? ( // Changed from > 2 to > 0
              <div className={styles.noResults}>
                <span>No movies found for "{query}"</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchMovie
