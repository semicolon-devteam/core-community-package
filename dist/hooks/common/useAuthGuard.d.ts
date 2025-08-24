import type { AuthErrorType } from '@organisms/AuthErrorHandler';
export interface AuthGuardOptions {
    requiredLevel?: number;
    adminOnly?: boolean;
    boardPermissions?: {
        writeLevel?: number;
        readLevel?: number;
    };
    redirectOnError?: string;
    showToastOnError?: boolean;
}
export interface AuthGuardResult {
    isAuthenticated: boolean;
    hasPermission: boolean;
    isLoading: boolean;
    user: any;
    errorType: AuthErrorType | null;
    checkPermissionAsync: () => Promise<boolean>;
}
export declare const useAuthGuard: (options?: AuthGuardOptions) => AuthGuardResult;
export declare const useAdminGuard: (options?: Omit<AuthGuardOptions, "adminOnly">) => AuthGuardResult;
export declare const useLevelGuard: (requiredLevel: number, options?: Omit<AuthGuardOptions, "requiredLevel">) => AuthGuardResult;
export declare const useBoardWriteGuard: (writeLevel: number, options?: Omit<AuthGuardOptions, "boardPermissions">) => AuthGuardResult;
