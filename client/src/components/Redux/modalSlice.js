import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modalOpen: false
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    closeModal: state => {
      state.modalOpen = false
    },
    openModal: state => {
        state.modalOpen = true
    }
  }
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
