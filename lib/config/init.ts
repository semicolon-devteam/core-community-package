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

let globalConfig: CommunityPackageConfig = {};

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
export function initializeCommunityCore(config: CommunityPackageConfig): void {
  globalConfig = { ...globalConfig, ...config };
  
  if (config.development) {
    console.log('🚀 @semicolon/community-core initialized with config:', globalConfig);
  }
}

/**
 * Get current package configuration
 */
export function getPackageConfig(): Readonly<CommunityPackageConfig> {
  return Object.freeze({ ...globalConfig });
}

/**
 * Get specific config value with fallback
 */
export function getConfigValue<T>(key: keyof CommunityPackageConfig, fallback?: T): T {
  return (globalConfig[key] as T) ?? fallback;
}