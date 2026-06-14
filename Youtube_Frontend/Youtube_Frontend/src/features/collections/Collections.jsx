import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCollections, createCollection, deleteCollection } from './collectionsSlice'

export default function Collections() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.collections)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchCollections())
  }, [dispatch])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    const result = await dispatch(createCollection(name.trim()))
    setCreating(false)
    if (result.meta.requestStatus === 'fulfilled') {
      setName('')
    } else {
      alert(result.payload?.detail || result.payload?.name?.[0] || 'Failed to create collection')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this collection? This cannot be undone.')) {
      dispatch(deleteCollection(id))
    }
  }

  const totalVideos = items.reduce((sum, col) => sum + (col.video_count || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Collections
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">Organize and manage your video collections</p>
                </div>
              </div>
            </div>
            
            {status === 'succeeded' && items.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 shadow-md border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Collections</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{items.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 shadow-md border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Videos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalVideos}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Collection Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Create New Collection</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Group related videos together for easy access</p>
              </div>
              
              <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tutorials, Favorites, Watch Later..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Collection
                    </>
                  )}
                </button>
              </form>
            </div>
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
            <p className="mt-6 text-gray-500 dark:text-gray-400 font-medium">Loading your collections...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
            <button 
              onClick={() => dispatch(fetchCollections())}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No collections yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Create your first collection to start organizing your favorite videos
            </p>
            <button
              onClick={() => setName('') && document.querySelector('input')?.focus()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Collection
            </button>
          </div>
        )}

        {/* Collections Grid */}
        {status === 'succeeded' && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((collection) => (
              <div
                key={collection.id}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-[1px] bg-white dark:bg-gray-900 rounded-2xl transition-all duration-300"></div>
                
                <div className="relative p-5">
                  <Link to={`/collections/${collection.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                            {collection.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {collection.video_count} {collection.video_count === 1 ? 'video' : 'videos'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Public
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 text-red-500 hover:text-red-600"
                        title="Delete collection"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Preview of first few videos */}
                    {collection.video_count > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click to view all videos</p>
                        <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                          View Collection
                          <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}