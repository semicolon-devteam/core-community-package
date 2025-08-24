import type { PostDetail } from '../../types/post';
interface PostState {
    editPost: PostDetail | null;
    isEditMode: boolean;
}
export declare const setEditMode: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<PostDetail, "post/setEditMode">, clearEditMode: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"post/clearEditMode">;
declare const _default: import("redux").Reducer<PostState>;
export default _default;
