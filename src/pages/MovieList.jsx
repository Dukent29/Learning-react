import { useState, useEffect } from 'react'
import { movieAPI } from '../services/movieAPI'
import MovieRow from '../components/MovieRow'
import SearchMovie from '../components/SearchMovie'
import styles from '../styles/MovieList.module.css'

const MovieList = () => {
  const [movieCategories, setMovieCategories] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
    upcoming: []
  })
  const [activeCategory, setActiveCategory] = useState('popular') 
  const [currentPage, setCurrentPage] = useState(1) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  
  const moviesPerPage = 20

  const categories = [
    { key: 'popular', label: '🔥 Popular', emoji: '🔥' },
    { key: 'nowPlaying', label: '🎭 Now Playing', emoji: '🎭' },
    { key: 'topRated', label: '⭐ Top Rated', emoji: '⭐' },
    { key: 'upcoming', label: '🎬 Upcoming', emoji: '🎬' }
  ]

  const getCurrentPageMovies = () => {
    const currentMovies = movieCategories[activeCategory] || []
    const startIndex = (currentPage - 1) * moviesPerPage
    const endIndex = startIndex + moviesPerPage
    return currentMovies.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const currentMovies = movieCategories[activeCategory] || []
    return Math.ceil(currentMovies.length / moviesPerPage)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    document.querySelector(`.${styles.activeSection}`)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }

  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey)
    setCurrentPage(1) 
  }

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true)
        setError(null)

        
        const fetchMultiplePages = async (apiFunction, maxPages = 3) => {
          const pagePromises = []
          for (let page = 1; page <= maxPages; page++) {
            pagePromises.push(apiFunction(page))
          }
          
          const responses = await Promise.all(pagePromises)
          return responses.reduce((allMovies, response) => {
            return [...allMovies, ...(response.results || [])]
          }, [])
        }

        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          fetchMultiplePages(movieAPI.getPopular, 3),
          fetchMultiplePages(movieAPI.getNowPlaying, 3),
          fetchMultiplePages(movieAPI.getTopRated, 3),
          fetchMultiplePages(movieAPI.getUpcoming, 3)
        ])

        setMovieCategories({
          popular,
          nowPlaying,
          topRated,
          upcoming
        })
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError('Failed to load movies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading movies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>🎬 Discover Amazing Movies</h1>
        <p>Explore the latest and greatest films from around the world</p>
      </div>

      <SearchMovie placeholder="Search for movies..." />

      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => handleCategoryChange(category.key)}
            className={`${styles.categoryTab} ${activeCategory === category.key ? styles.activeTab : ''}`}
          >
            <span className={styles.tabEmoji}>{category.emoji}</span>
            <span className={styles.tabLabel}>{category.label.replace(category.emoji + ' ', '')}</span>
          </button>
        ))}
      </div>

      
      <div className={styles.activeSection}>
        <div className={styles.sectionHeader}>
          <h2>{categories.find(cat => cat.key === activeCategory)?.label || 'Movies'}</h2>
          <div className={styles.paginationInfo}>
            Page {currentPage} of {getTotalPages()} 
            <span className={styles.totalMovies}>
              ({movieCategories[activeCategory]?.length || 0} movies total)
            </span>
          </div>
        </div>
        
        <MovieRow 
          title=""
          movies={getCurrentPageMovies()} 
        />

        {getTotalPages() > 1 && (
          <div className={styles.paginationControls}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${styles.paginationBtn} ${styles.prevBtn}`}
            >
              ← Précédent
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: getTotalPages() }, (_, index) => {
                const pageNum = index + 1
                const isCurrentPage = pageNum === currentPage
                const showPage = 
                  pageNum === 1 || 
                  pageNum === getTotalPages() || 
                  Math.abs(pageNum - currentPage) <= 2

                if (!showPage) {
                  if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                    return <span key={pageNum} className={styles.ellipsis}>...</span>
                  }
                  return null
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles.pageBtn} ${isCurrentPage ? styles.activePageBtn : ''}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
              className={`${styles.paginationBtn} ${styles.nextBtn}`}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      <div className={styles.allCategoriesToggle}>
        <h2>Browse All Categories</h2>
      </div>
      
      <div className={styles.movieSections}>
        <MovieRow 
          title="🔥 Popular" 
          movies={movieCategories.popular} 
        />
        <MovieRow 
          title="🎭 Now Playing" 
          movies={movieCategories.nowPlaying} 
        />
        <MovieRow 
          title="⭐ Top Rated" 
          movies={movieCategories.topRated} 
        />
        <MovieRow 
          title="🎬 Upcoming" 
          movies={movieCategories.upcoming} 
        />
      </div>
    </div>
  )
}

export default MovieList
