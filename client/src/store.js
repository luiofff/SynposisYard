import { configureStore } from '@reduxjs/toolkit'
import modalSlice from './components/Redux/modalSlice'
import updateEditData from "./components/Redux/editDataSlice"

export default configureStore({
  reducer: {
    modal: modalSlice,
    editData: updateEditData
  }
})