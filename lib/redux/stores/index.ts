import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appReducer from '../App/appSlice';
import boardReducer from '../Board/boardSlice';
import modalReducer from '../Modal/modalSlice';
import popupReducer from '../Popup/popupSlice';
import postReducer from '../Post/postSlice';
import toastReducer from '../Toast/toastSlice';
import uiReducer from '../UI/uiSlice';
import userReducer from '../User/userSlice';

const rootReducer = combineReducers({
  app: appReducer,
  board: boardReducer,
  modal: modalReducer,
  popup: popupReducer,
  post: postReducer,
  toast: toastReducer,
  ui: uiReducer,
  user: userReducer,
});

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
  });
}

// 타입
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];