import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Search from './features/search/Search'
import Bookmarks from './features/bookmarks/Bookmarks'
import Collections from './features/collections/Collections'
import CollectionDetail from './features/collections/CollectionDetail'
import SharedCollection from './features/collections/SharedCollection'
import ProtectedRoute from './components/ProtectedRoute'
import { fetchBookmarks } from './features/bookmarks/bookmarksSlice'

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchBookmarks())
    }
  }, [token, dispatch])

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Search />} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collections/:id" element={<ProtectedRoute><CollectionDetail /></ProtectedRoute>} />
          <Route path="/shared/:shareId" element={<SharedCollection />} />
        </Routes>
      </div>
    </div>
  )
}

export default App