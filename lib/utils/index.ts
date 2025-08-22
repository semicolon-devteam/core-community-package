/**
 * @semicolon/community-core utilities
 * 
 * Comprehensive utility functions for community platform development.
 * All utilities are pure functions and framework-agnostic.
 */

// =============================================================================
// ESSENTIAL UTILITIES - Most commonly used
// =============================================================================

// Number formatting (most frequently used)
export { formatNumberWithComma } from './numberUtil';

// Date and time utilities  
export { formatDate, timeAgo, DateUtil } from './dateUtil';

// Authentication and permissions
export { isAdmin } from './authUtil';

// =============================================================================
// SPECIALIZED UTILITIES - Domain-specific functionality
// =============================================================================

// Image processing and optimization
export {
    IMAGE_SIZE, generateImageSrcSet, normalizeImageSrc,
    optimizeImageSrc, supabaseImageLoader, transformSupabaseImageUrl, type ImageSizeKey
} from './imageUtil';

// Level and user progression
export { LevelUtil } from './levelUtil';

// String manipulation
export * from './stringUtil';

// URL and routing utilities
export * from './urlUtil';

// JWT token handling (advanced)
export * from './jwtUtil';

// Upload error handling
export * from './uploadErrorHandler';

// =============================================================================
// NAMESPACE EXPORTS - For organized imports
// =============================================================================

// Re-export everything as namespaced modules for advanced usage
export * as NumberUtils from './numberUtil';
export * as DateUtils from './dateUtil'; 
export * as AuthUtils from './authUtil';
export * as ImageUtils from './imageUtil';
export * as LevelUtils from './levelUtil';
export * as StringUtils from './stringUtil';
export * as UrlUtils from './urlUtil';
export * as JwtUtils from './jwtUtil';
