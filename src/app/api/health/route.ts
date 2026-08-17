import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unhealthy";
  let dbLatencyMs = 0;

  try {
    const dbPingStart = Date.now();
    // Test PostgreSQL database connectivity with a lightweight ping
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbPingStart;
    dbStatus = "healthy";
  } catch (error) {
    dbStatus = "disconnected";
    console.error("[HealthCheck] Database connection error:", error);
  }

  const memoryUsage = process.memoryUsage();
  const memoryFormatted = {
    heapUsedMB: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
    heapTotalMB: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
    rssMB: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
  };

  const isOverallHealthy = dbStatus === "healthy";
  const totalDurationMs = Date.now() - startTime;

  const healthData = {
    status: isOverallHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: "0.1.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        provider: "PostgreSQL",
      },
    },
    system: {
      memory: memoryFormatted,
      responseTimeMs: totalDurationMs,
    },
  };

  return NextResponse.json(healthData, {
    status: isOverallHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
