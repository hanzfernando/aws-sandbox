/**
 * Authentication utilities for JWT token management and cookie handling
 */
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { config } from "../../config/env.config";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie
 * @param id - User ID to encode in the token
 * @param res - Express response object for setting cookies
 * @returns The generated JWT token
 */
export const generateToken = (id: number, res: Response): string => {
  const token = jwt.sign({ id }, config.jwt.secret, { expiresIn: "7d" });

  res.cookie(config.cookie, token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: config.env !== "development" ? "none" : "strict",
    secure: config.env !== "development",
    path: "/",
  });

  return token;
};

/**
 * Extracts JWT token from Authorization header or cookies
 * Supports both Bearer token and cookie-based authentication
 * @param req - Express request object
 * @returns JWT token string or null if not found
 */
export const extractToken = (req: Request): string | null => {
  // Debug: inspect incoming headers and cookies to diagnose missing token issues
  const authHeader = req.headers.authorization;
  const rawCookieHeader = req.headers.cookie;
  const parsedCookieValue = req.cookies?.[config.cookie];

  if (authHeader?.startsWith("Bearer")) {
    return authHeader.split(" ")[1];
  }

  // If cookie-parser provided a value and it's not a placeholder, use it
  if (parsedCookieValue && !/\{\{.*\}\}/.test(parsedCookieValue)) {
    return parsedCookieValue;
  }

  // As a fallback, try to parse the raw Cookie header if cookie-parser failed or was bypassed
  if (rawCookieHeader) {
    const parts = rawCookieHeader.split(/;\s*/);
    // Prefer the LAST occurrence to avoid stale placeholders
    const matches = parts.filter(p => p.startsWith(`${config.cookie}=`));
    if (matches.length > 0) {
      const last = matches[matches.length - 1];
      const [, value] = last.split("=");
      if (value && !/\{\{.*\}\}/.test(value)) {
        return value;
      }
    }
  }

  return null;
};
