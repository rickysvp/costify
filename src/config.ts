/**
 * anytokn-costio Configuration
 * Centralized settings for both local development and production (Vercel)
 */

// Detect if running in production (Vercel) or development
// A more robust check: if hostname is not localhost/127.0.0.1, it's production
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const isProduction = !isLocal;

// Priority: 
// 1. Environment variable VITE_API_URL (if set)
// 2. '/api' for production (same domain)
// 3. 'http://localhost:3001/api' for local development
export const API_BASE = import.meta.env.VITE_API_URL || (isProduction 
  ? '/api' 
  : 'http://localhost:3001/api');

export const APP_CONFIG = {
  isProduction,
  VERSION: '1.2.2',
  API_BASE
};

export default APP_CONFIG;
