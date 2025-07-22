const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OGVhZjVjMTMwYTI4ZGQxZjNiMDc1ZjUyMWYzZTg5NCIsIm5iZiI6MTY5ODcwNzY0Ni45MzI5OTk4LCJzdWIiOiI2NTQwMzhiZTU3NTMwZTAwYzk0MzhkYTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.u9J9TZQC4r-U5q5CJNpiviYw77h00yUyGbtOvAEg8oM'

const fetchFromAPI = async (endpoint) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

export const movieAPI = {
  
  getPopular: (page = 1) => fetchFromAPI(`/movie/popular?page=${page}`),
  
  getNowPlaying: (page = 1) => fetchFromAPI(`/movie/now_playing?page=${page}`),
  
  getTopRated: (page = 1) => fetchFromAPI(`/movie/top_rated?page=${page}`),
  
  getUpcoming: (page = 1) => fetchFromAPI(`/movie/upcoming?page=${page}`),
  
  getMovieDetails: (movieId) => fetchFromAPI(`/movie/${movieId}?append_to_response=videos`),
  
  getMovieCredits: (movieId) => fetchFromAPI(`/movie/${movieId}/credits`),
  
  getSimilarMovies: (movieId) => fetchFromAPI(`/movie/${movieId}/similar`),
  
  searchMovies: (query) => fetchFromAPI(`/search/movie?query=${encodeURIComponent(query)}`)
}


export const getImageURL = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg' 
  return `https://image.tmdb.org/t/p/${size}${path}`
}
