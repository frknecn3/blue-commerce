# ADR 002: Distributed Rate Limiting in Serverless Architecture

## Context
Standard in-memory rate limiting (using `Map` and `setInterval`) operates per Node.js process. In modern serverless deployments (such as Vercel Edge/Serverless Lambdas or multi-container clusters):
- Each incoming request can be routed to an isolated, ephemeral instance.
- In-memory state is not shared between instances, meaning attackers can bypass rate limits across distributed endpoints.
- Serverless instances spin down when idle, resetting local in-memory counters.

## Decision
Design and implement a **Hybrid Rate Limiter** (`HybridRateLimiter`):
1. When configured in production (`UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`), requests execute atomic sliding window increment operations (`INCR`, `EXPIRE`, `PTTL`) against a distributed Redis cluster via REST.
2. In local development or testing environments, it automatically falls back to an in-memory sliding window rate limiter with periodic cleanup.

## Consequences
### Positive
- Zero single-point-of-failure or bypass vulnerabilities in multi-region serverless deployments.
- Seamless zero-dependency local development workflow.
- High resilience: if Redis becomes temporarily unreachable, the fallback prevents complete application outage.
