import { Link } from 'react-router-dom'
import { useWishlist } from '../context/useWishlist'
import styles from '../styles/Navigation.module.css'

const Navigation = () => {
  const { getWishlistCount } = useWishlist()
  const wishlistCount = getWishlistCount()

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🎬 Movie App
        </Link>
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navLink}>
              Movies
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className={styles.navLink}>
              Wishlist ({wishlistCount})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
