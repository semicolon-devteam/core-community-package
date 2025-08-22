/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { AppDispatch, RootState } from "@redux/stores";
import userService from "@services/userService";
import { debounce, throttle } from "lodash";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import { geohashForLocation } from 'geofire-common';
// import Geocode from '@config/Geocode';
// import type { GeoLocation } from '@model/Shop';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = (lazyFn: any) => {
  return debounce(lazyFn, 200);
};

export const useThrottle = (lazyFn: (...args: unknown[]) => void) => {
  return throttle(lazyFn, 200);
};

export const useImageUpload = () => {
  const uploadPreviewImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    lazyFn?: ({
      file,
      result,
    }: {
      file: File;
      result: string | ArrayBuffer | null;
    }) => void
  ) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const { result } = reader;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        lazyFn && lazyFn({ file, result });
      };
      reader.readAsDataURL(file);
    }
  };

  return { uploadPreviewImage };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getRealtimeUser = async (): Promise<string> => {
  const res = await userService.getRealtimeUser();

  if (res.successOrNot === "N") {
    return "0";
  }
  return res.data || "0";
};

export { useDeviceType } from "./useDeviceType";
export { useGlobalLoader } from './useGlobalLoader';
export { useGlobalPopup } from './useGlobalPopup';
export { useNavigation } from './useNavigation';
export { usePermission } from './usePermission';
export { useRouterWithLoader } from './useRouterWithLoader';
export { useSafeGlobalLoader } from './useSafeGlobalLoader';

