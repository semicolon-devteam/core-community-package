import appSlice from "@redux/Features/App/appSlice";
import boardSlice from "@redux/Features/Board/boardSlice";
import modalSlice from "@redux/Features/Modal/modalSlice";
import popupSlice from "@redux/Features/Popup/popupSlice";
import postSlice from "@redux/Features/Post/postSlice";
import toastSlice from "@redux/Features/Toast/toastSlice";
import uiSlice from "@redux/Features/UI/uiSlice";
import userSlice from "@redux/Features/User/userSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  toastSlice,
  modalSlice,
  userSlice,
  uiSlice,
  postSlice,
  popup: popupSlice,
  app: appSlice,
  board: boardSlice,
});

export default rootReducer;
