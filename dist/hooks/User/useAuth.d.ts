import type { LoginFormData } from "@redux/Features/User/userSlice";
export declare const useAuth: () => {
    userState: unknown;
    isLoggedIn: any;
    user: any;
    error: any;
    loginWithLoader: (loginData: LoginFormData) => Promise<{
        success: boolean;
        user: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        user?: undefined;
    }>;
    logoutWithLoader: () => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    initializeAuth: () => Promise<{
        success: boolean;
        user: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        user?: undefined;
    }>;
    checkSession: () => Promise<{
        valid: boolean;
        reason: string;
        user?: undefined;
    } | {
        valid: boolean;
        user: any;
        reason?: undefined;
    }>;
    navigateWithAuth: (path: string, requiredLevel?: number, adminOnly?: boolean) => Promise<boolean>;
    isAdmin: () => boolean;
    isUser: () => any;
};
