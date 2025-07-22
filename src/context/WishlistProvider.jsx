import { useState, useEffect } from 'react'
import { WishlistContext } from './WishlistContext'

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])


  useEffect(() => {
    const savedWishlist = localStorage.getItem('movieWishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error)
        setWishlist([])
      }
    }
  }, [])


  useEffect(() => {
    localStorage.setItem('movieWishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (movie) => {
    setWishlist(prevWishlist => {
      const existingMovie = prevWishlist.find(item => item.id === movie.id)
      if (existingMovie) {
        console.log('Movie already in wishlist')
        return prevWishlist
      }
      return [...prevWishlist, movie]
    })
  }

  const removeFromWishlist = (movieId) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(movie => movie.id !== movieId)
    )
  }

  const isInWishlist = (movieId) => {
    return wishlist.some(movie => movie.id === movieId)
  }

  const getWishlistCount = () => {
    return wishlist.length
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistProvider
