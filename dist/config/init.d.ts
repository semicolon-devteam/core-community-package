/**
 * @semicolon/community-core initialization
 *
 * This module provides package initialization functionality
 * to configure the core package for optimal usage.
 */
export interface CommunityPackageConfig {
    /** API base URL for backend services */
    apiUrl?: string;
    /** Supabase configuration */
    supabase?: {
        url?: string;
        anonKey?: string;
    };
    /** Default locale for formatting */
    locale?: string;
    /** Enable development mode features */
    development?: boolean;
}
/**
 * Initialize @semicolon/community-core package with configuration
 *
 * @example
 * ```typescript
 * import { initializeCommunityCore } from '@semicolon/community-core';
 *
 * initializeCommunityCore({
 *   apiUrl: process.env.REACT_APP_API_URL,
 *   supabase: {
 *     url: process.env.REACT_APP_SUPABASE_URL,
 *     anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
 *   },
 *   locale: 'ko-KR',
 *   development: process.env.NODE_ENV === 'development'
 * });
 * ```
 */
export declare function initializeCommunityCore(config: CommunityPackageConfig): void;
/**
 * Get current package configuration
 */
export declare function getPackageConfig(): Readonly<CommunityPackageConfig>;
/**
 * Get specific config value with fallback
 */
export declare function getConfigValue<T>(key: keyof CommunityPackageConfig, fallback?: T): T;
