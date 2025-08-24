import type { LevelInfo } from "../../types/common";
export type DeviceType = "mobile" | "tablet" | "desktop";
interface AppState {
    deviceType: DeviceType;
    levelTable: LevelInfo[];
}
export declare const getDeviceTypeFromWidth: (width: number) => DeviceType;
export declare const setDeviceType: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<DeviceType, "app/setDeviceType">, updateDeviceTypeFromWidth: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, "app/updateDeviceTypeFromWidth">, setLevelTable: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<LevelInfo[], "app/setLevelTable">;
declare const _default: import("redux").Reducer<AppState>;
export default _default;
