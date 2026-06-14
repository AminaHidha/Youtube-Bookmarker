import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const searchVideos = createAsyncThunk('search/searchVideos', async (query, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('search/', { params: { q: query } })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Search failed')
  }
})

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.results = action.payload
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.results = []
      })
  },
})

export default searchSlice.reducer