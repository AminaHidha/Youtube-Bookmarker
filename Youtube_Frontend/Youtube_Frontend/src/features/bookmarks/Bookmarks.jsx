import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookmarks, removeBookmark } from './bookmarksSlice'
import { fetchCollections, addVideoToCollection } from '../collections/collectionsSlice'
import VideoCard from '../../components/VideoCard'

export default function Bookmarks() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.bookmarks)
  const { items: collections } = useSelector((state) => state.collections)
  const [selectedCollection, setSelectedCollection] = useState({})

  useEffect(() => {
    dispatch(fetchBookmarks())
    dispatch(fetchCollections())
  }, [dispatch])

  const handleAddToCollection = async (video) => {
    const collectionId = selectedCollection[video.id]
    if (!collectionId) {
      alert('Please select a collection first')
      return
    }
    const result = await dispatch(addVideoToCollection({
      collectionId,
      video: {
        video_id: video.video_id,
        title: video.title,
        thumbnail: video.thumbnail,
        channel_title: video.channel_title,
        published_at: video.published_at,
      },
    }))
    if (result.meta.requestStatus === 'fulfilled') {
      alert('Added to collection!')
    } else {
      alert(result.payload?.detail || 'Failed to add to collection')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Premium Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Bookmarks
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">Your saved videos collection</p>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            {status === 'succeeded' && items.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 shadow-md border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Videos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{items.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 shadow-md border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Collections</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{collections.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-800 rounded-full animate-spin border-t-red-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium">Loading your saved videos...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="backdrop-blur-sm bg-red-50/50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to Load Bookmarks</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => dispatch(fetchBookmarks())}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && items.length === 0 && (
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/5 to-rose-500/5 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your bookmark list is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start building your collection by saving videos you want to watch later
              </p>
              <a href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Videos
              </a>
            </div>
          </div>
        )}

        {/* Bookmarks Grid */}
        {status === 'succeeded' && items.length > 0 && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{items.length}</span> bookmarked videos
              </p>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  actions={
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex gap-2">
                        <select
                          value={selectedCollection[video.id] || ''}
                          onChange={(e) => setSelectedCollection({ ...selectedCollection, [video.id]: e.target.value })}
                          className="flex-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-red-300 dark:hover:border-red-700"
                        >
                          <option value="" className="text-gray-500">📁 Add to collection...</option>
                          {collections.map((c) => (
                            <option key={c.id} value={c.id} className="text-gray-700 dark:text-gray-300">📂 {c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddToCollection(video)}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                          + Add
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeBookmark(video.id))}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}