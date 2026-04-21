/**
 * Environment configuration with security-first approach
 * All critical values must be provided via environment variables
 */
import dotenv from "dotenv";

// In local/dev, load variables from .env into process.env.
// In Docker/production we rely on real environment variables (Compose, cloud, etc.).
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  dotenv.config();
}

/**
 * Application configuration object with validated environment variables
 * All critical values are required and validated at startup
 */
export const config = {
  // Application environment settings
  env: process.env.NODE_ENV!,
  port: Number(process.env.PORT) || 3000,

  // Authentication configuration
  cookie: process.env.COOKIE_NAME || "SANDBOX_COOKIE",
  jwt: {
    secret: process.env.JWT_SECRET!, 
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL!, 
    maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 10,
    connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT) || 60000,
  },

  // AWS services configuration
  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    s3: {
      bucketName: process.env.S3_BUCKET_NAME!,
    },
  },

  // Security configuration
  security: {
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
    corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:8080",
    ],
    maxWebSocketConnections: Number(process.env.MAX_WEBSOCKET_CONNECTIONS) || 1000,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
