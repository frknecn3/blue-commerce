# ADR 001: Migration from NoSQL (Firebase) to Relational PostgreSQL + Prisma

## Context
E-commerce business logic is inherently relational:
- An `Order` contains multiple `OrderItem` records.
- Each `OrderItem` references a `Product` from a specific `Store` and `Category`.
- Users possess one `Cart`, a list of `Favorite` items, and historical `Order` records.

During initial prototyping with Firebase Firestore (NoSQL), several data integrity and consistency challenges arose:
1. Denormalized cart and product snapshots led to orphan references upon product deletion.
2. Lack of foreign key constraints meant referential integrity had to be managed imperatively at the application layer.
3. Multi-document transactions across collections were complex and costly.

## Decision
Migrate the entire persistence layer to **PostgreSQL** using **Prisma ORM**.

## Consequences
### Positive
- **Schema-Enforced Referential Integrity**: Cascade deletes and foreign keys (`onDelete: Cascade`, `@relation`) guarantee clean relational state.
- **ACID Transactions (`prisma.$transaction`)**: Atomic multi-step operations (such as Stripe webhook payment confirmation, inventory decrement, and cart clearance) succeed or fail together.
- **End-to-End TypeScript Safety**: Prisma generates strongly typed TypeScript models aligned with frontend payloads and Zod schemas.

### Negative / Trade-offs
- Requires migration management (`prisma db push` / `prisma migrate`).
- Requires connection pooling configuration (e.g. PgBouncer / Prisma Accelerate / Neon pooling) for serverless deployments.
