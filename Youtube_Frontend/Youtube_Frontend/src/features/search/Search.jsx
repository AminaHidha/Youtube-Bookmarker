import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchVideos } from './searchSlice'
import { addBookmark } from '../bookmarks/bookmarksSlice'
import VideoCard from '../../components/VideoCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const { results, status, error } = useSelector((state) => state.search)
  const { token } = useSelector((state) => state.auth)
  const bookmarkItems = useSelector((state) => state.bookmarks.items)
  const bookmarkedIds = bookmarkItems.map((b) => b.video_id)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      dispatch(searchVideos(query.trim()))
    }
  }

  const handleBookmark = async (video) => {
    const result = await dispatch(addBookmark(video))
    if (result.meta.requestStatus === 'rejected') {
      alert(result.payload?.detail || 'Failed to bookmark video')
    }
  }

  const trendingSearches = ['React Tutorial', 'Tailwind CSS', 'JavaScript', 'Python', 'Machine Learning']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10 dark:from-red-500/5 dark:via-rose-500/5 dark:to-red-500/5 rounded-2xl p-8 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full blur-3xl"></div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-500/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
              Discover Amazing Content
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              Search millions of videos and save your favorites
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search YouTube videos..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200 shadow-md"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Trending Suggestions */}
            {!query && status !== 'succeeded' && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Trending searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {trendingSearches.map((trend) => (
                    <button
                      key={trend}
                      onClick={() => {
                        setQuery(trend)
                        dispatch(searchVideos(trend))
                      }}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-800 rounded-full animate-spin border-t-red-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium">Searching for "{query}"...</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This may take a few moments</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
            <button 
              onClick={() => query.trim() && dispatch(searchVideos(query.trim()))}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Results */}
        {status === 'succeeded' && results.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-12 text-center max-w-lg mx-auto">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't find any videos matching "{query}"
            </p>
            <button
              onClick={() => setQuery('')}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Try a different search
            </button>
          </div>
        )}

        {/* Results Grid */}
        {status === 'succeeded' && results.length > 0 && (
          <>
            <div className="mb-6 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{results.length}</span> results
                    <span className="mx-1">for</span>
                    <span className="font-semibold text-red-500 dark:text-red-400">"{query}"</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
                  <select className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs">
                    <option>Relevance</option>
                    <option>Latest</option>
                    <option>Most viewed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((video) => {
                const isBookmarked = bookmarkedIds.includes(video.video_id)
                return (
                  <VideoCard
                    key={video.video_id}
                    video={video}
                    actions={
                      token && (
                        <button
                          onClick={() => handleBookmark(video)}
                          disabled={isBookmarked}
                          className={`w-full py-2 text-xs font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                            isBookmarked
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md hover:shadow-lg hover:shadow-yellow-500/25 hover:from-yellow-500 hover:to-yellow-600'
                          }`}
                        >
                          {isBookmarked ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                              </svg>
                              Saved
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              Save to Bookmarks
                            </>
                          )}
                        </button>
                      )
                    }
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}