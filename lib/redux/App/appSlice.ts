import { BREAKPOINTS } from "@constants/breakpoints";
import type { LevelInfo } from "../../types/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 디바이스 타입 정의
export type DeviceType = "mobile" | "tablet" | "desktop";

// 상태 인터페이스 정의
interface AppState {
  deviceType: DeviceType;
  levelTable: LevelInfo[];
}

// 초기 상태
const initialState: AppState = {
  deviceType: "desktop", // 기본값은 데스크탑
  levelTable: [],
};

// 브라우저 환경에서 현재 화면 크기에 따른 디바이스 타입 계산 함수
export const getDeviceTypeFromWidth = (width: number): DeviceType => {
  if (width < BREAKPOINTS.sm) return "mobile"; // sm 미만 (640px)
  if (width < BREAKPOINTS.lg) return "tablet"; // sm~lg 미만 (640px ~ 1024px)
  return "desktop"; // lg 이상 (1024px+)
};

// AppSlice 생성
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDeviceType: (state, action: PayloadAction<DeviceType>) => {
      state.deviceType = action.payload;
    },
    updateDeviceTypeFromWidth: (state, action: PayloadAction<number>) => {
      state.deviceType = getDeviceTypeFromWidth(action.payload);
    },
    setLevelTable: (state, action: PayloadAction<LevelInfo[]>) => {
      state.levelTable = action.payload;
    },

  },
});

// 액션 내보내기
export const { setDeviceType, updateDeviceTypeFromWidth, setLevelTable } = appSlice.actions;

// 리듀서 내보내기
export default appSlice.reducer; 