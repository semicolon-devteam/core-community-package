import { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/User';
import type { RootState } from '@redux/stores';
export interface LoginFormData {
    userId: string;
    password: string;
}
export interface JoinFormData extends LoginFormData {
    confirmPassword: string;
    nickname: string;
}
export interface UpdateFormData {
    password: string;
    confirmPassword: string;
    nickname: string;
}
export type JoinFormErrors = Partial<Record<keyof JoinFormData, string>>;
interface ValidationErrors {
    result: string;
}
export declare const update: import("@reduxjs/toolkit").AsyncThunk<User, UpdateFormData, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const join: import("@reduxjs/toolkit").AsyncThunk<User, JoinFormData, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const login: import("@reduxjs/toolkit").AsyncThunk<User, LoginFormData, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const autoLogin: import("@reduxjs/toolkit").AsyncThunk<User, void, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const logout: import("@reduxjs/toolkit").AsyncThunk<void, void, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const refreshMyInfo: import("@reduxjs/toolkit").AsyncThunk<User, void, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const checkAttendance: import("@reduxjs/toolkit").AsyncThunk<void, void, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const dotAttendance: import("@reduxjs/toolkit").AsyncThunk<void, void, {
    rejectValue: ValidationErrors;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
interface UserState {
    userInfo: User | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    error: string | null | undefined;
}
export declare const userSlice: import("@reduxjs/toolkit").Slice<import("immer").WritableDraft<UserState>, {
    setUserInfo: (state: import("immer").WritableDraft<UserState>, action: PayloadAction<User | null>) => void;
    clearUser: (state: import("immer").WritableDraft<UserState>) => void;
}, "user", "user", import("@reduxjs/toolkit").SliceSelectors<import("immer").WritableDraft<UserState>>>;
export declare const setUserInfo: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<User, "user/setUserInfo">, clearUser: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/clearUser">;
export declare const selectUserInfo: (state: RootState) => UserState;
declare const _default: import("redux").Reducer<import("immer").WritableDraft<UserState>>;
export default _default;
