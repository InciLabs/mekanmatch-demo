import express, { type Express } from "express";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Backend-only mode - no Vite setup needed
  log("Running in backend-only mode");
}

export function serveStatic(app: Express) {
  // Backend-only mode - no static serving needed
  log("Static serving disabled in backend-only mode");
}
