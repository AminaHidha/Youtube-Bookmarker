import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const fetchCollections = createAsyncThunk('collections/fetchCollections', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('collections/')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch collections')
  }
})

export const createCollection = createAsyncThunk('collections/createCollection', async (name, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('collections/', { name })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to create collection' })
  }
})

export const deleteCollection = createAsyncThunk('collections/deleteCollection', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`collections/${id}/`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to delete collection' })
  }
})

export const fetchCollectionDetail = createAsyncThunk('collections/fetchCollectionDetail', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`collections/${id}/`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to fetch collection' })
  }
})

export const addVideoToCollection = createAsyncThunk('collections/addVideoToCollection', async ({ collectionId, video }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(`collections/${collectionId}/videos/`, video)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to add video' })
  }
})

export const removeVideoFromCollection = createAsyncThunk('collections/removeVideoFromCollection', async ({ collectionId, videoId }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`collections/${collectionId}/videos/${videoId}/`)
    return videoId
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Failed to remove video' })
  }
})

export const fetchSharedCollection = createAsyncThunk('collections/fetchSharedCollection', async (shareId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`share/${shareId}/`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Collection not found' })
  }
})

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    items: [],
    current: null,
    sharedCollection: null,
    status: 'idle',
    detailStatus: 'idle',
    sharedStatus: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentCollection: (state) => {
      state.current = null
      state.detailStatus = 'idle'
    },
    clearSharedCollection: (state) => {
      state.sharedCollection = null
      state.sharedStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
      })
      .addCase(fetchCollectionDetail.pending, (state) => {
        state.detailStatus = 'loading'
      })
      .addCase(fetchCollectionDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.current = action.payload
      })
      .addCase(fetchCollectionDetail.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.error = action.payload
      })
      .addCase(addVideoToCollection.fulfilled, (state, action) => {
        if (state.current) {
          state.current.videos.unshift(action.payload)
          state.current.video_count = (state.current.video_count || 0) + 1
        }
      })
      .addCase(removeVideoFromCollection.fulfilled, (state, action) => {
        if (state.current) {
          state.current.videos = state.current.videos.filter((v) => v.id !== action.payload)
          state.current.video_count = Math.max((state.current.video_count || 1) - 1, 0)
        }
      })
      .addCase(fetchSharedCollection.pending, (state) => {
        state.sharedStatus = 'loading'
      })
      .addCase(fetchSharedCollection.fulfilled, (state, action) => {
        state.sharedStatus = 'succeeded'
        state.sharedCollection = action.payload
      })
      .addCase(fetchSharedCollection.rejected, (state, action) => {
        state.sharedStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearCurrentCollection, clearSharedCollection } = collectionsSlice.actions
export default collectionsSlice.reducer