export declare const usePermission: () => {
    checkPermission: (requiredLevel?: number) => any;
    showAccessDeniedToast: () => void;
    userLevel: any;
    isAdmin: any;
    isLoggedIn: any;
    currentUser: any;
};
