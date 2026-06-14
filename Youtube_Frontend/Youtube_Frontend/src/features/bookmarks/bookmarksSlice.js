import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('bookmarks/')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch bookmarks')
  }
})

export const addBookmark = createAsyncThunk('bookmarks/addBookmark', async (video, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('bookmarks/', video)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to add bookmark' })
  }
})

export const removeBookmark = createAsyncThunk('bookmarks/removeBookmark', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`bookmarks/${id}/`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to remove bookmark' })
  }
})

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload)
      })
  },
})

export default bookmarksSlice.reducer