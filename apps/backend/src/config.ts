import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5173,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.API_BASE_URL || 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5173/api',
}; 