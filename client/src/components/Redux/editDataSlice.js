import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  editData: String
}

const editDataSlice = createSlice({
  name: 'editData',
  initialState,
  reducers: {
    updateEditData: (state, action) => {
      state.editData = action.payload
    }
  }
})

export const { updateEditData } = editDataSlice.actions

export default editDataSlice.reducer