import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import MovieList from './pages/MovieList'
import MovieDetail from './pages/MovieDetail'
import Wishlist from './pages/Wishlist'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
    </div>
  )
}

export default App