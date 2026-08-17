# ADR 003: Stripe Webhook Idempotency & Concurrency Stock Deduction

## Context
Payment gateways (like Stripe) operate on an "at-least-once" webhook delivery guarantee. If network lag causes Stripe not to receive an immediate `200 OK`, Stripe automatically retries webhook delivery multiple times.
Without deduplication:
1. An order could be processed multiple times.
2. Inventory stock could be decremented twice for a single payment.
3. Multiple confirmation emails or events could trigger duplicate side effects.

## Decision
1. Introduce a dedicated database model `ProcessedWebhookEvent` with a unique constraint on `eventId`.
2. Check incoming Stripe `event.id` prior to processing; if already present, immediately return `200 OK` with `{ duplicate: true }`.
3. Wrap event recording, order state mutation (`PROCESSING`), inventory stock decrement (`stock: { decrement: quantity }`), and cart deletion into an atomic `prisma.$transaction`.

## Consequences
### Positive
- Strict idempotent fulfillment: duplicate webhook deliveries cause zero side effects.
- Guaranteed stock count accuracy even under concurrent checkout traffic.
