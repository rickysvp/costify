/**
 * anytokn-costio Configuration
 * Centralized settings for both local development and production (Vercel)
 */

// Detect if running in production (Vercel) or development
const isProduction = import.meta.env.PROD;

// In Vercel, the API is served from the same domain under /api
// In local development, the Vite dev server runs on 5173 and Express on 3001
export const API_BASE = isProduction 
  ? '/api' 
  : 'http://localhost:3001/api';

export const APP_CONFIG = {
  isProduction,
  VERSION: '1.2.2',
  API_BASE
};

export default APP_CONFIG;
