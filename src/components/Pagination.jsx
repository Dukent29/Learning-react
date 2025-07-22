import styles from '../styles/Pagination.module.css'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = true,
  totalItems = 0 
}) => {
  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages = []
    
    for (let i = 1; i <= totalPages; i++) {
      const isCurrentPage = i === currentPage
      const showPage = 
        i === 1 || 
        i === totalPages || 
        Math.abs(i - currentPage) <= 2

      if (!showPage) {
        if (i === currentPage - 3 || i === currentPage + 3) {
          pages.push(
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              ...
            </span>
          )
        }
        continue
      }

      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.pageBtn} ${isCurrentPage ? styles.activePageBtn : ''}`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className={styles.paginationWrapper}>
      {showInfo && (
        <div className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
          {totalItems > 0 && (
            <span className={styles.totalItems}>
              ({totalItems} items total)
            </span>
          )}
        </div>
      )}
      
      <div className={styles.paginationControls}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.paginationBtn} ${styles.prevBtn}`}
        >
          ← Précé
        </button>

        <div className={styles.pageNumbers}>
          {renderPageNumbers()}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.paginationBtn} ${styles.nextBtn}`}
        >
          Suiv →
        </button>
      </div>
    </div>
  )
}

export default Pagination
