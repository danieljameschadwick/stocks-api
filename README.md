# stocks-api

A miniature API to drive a stocks application.

## todo
- Fix container injection with constructor injection (todo: fix with routing-controller with Inversify),
- Visibility across services/controllers/entities,
- Implement GraphQL API using MySQL/PostgreSQL,
- Investigate updating with partial entities - potential action: switch to MikroORM (?),
- Hash passwords on Users (bcrypt?), store JWTs for easier expiration (?), don't return hashed passwords on login, move auth to /api/v1/auth,
- Implement early versioning for APIs, and authentication.
