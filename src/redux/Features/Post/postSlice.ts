import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PostDetail } from '@model/post';

interface PostState {
    editPost: PostDetail | null;
    isEditMode: boolean;
}

const initialState: PostState = {
    editPost: null,
    isEditMode: false,
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setEditMode: (state, action: PayloadAction<PostDetail>) => {
            state.editPost = action.payload;
            state.isEditMode = true;
        },
        clearEditMode: (state) => {
            state.editPost = null;
            state.isEditMode = false;
        },
    },
});

export const { setEditMode, clearEditMode } = postSlice.actions;
export default postSlice.reducer;
