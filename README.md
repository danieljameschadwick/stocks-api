# stocks-api

A miniature API to drive a stocks application.

## todo
- Implement GraphQL API using MySQL/PostgreSQL,
- Create further entities (stock holdings), and services (UserService),
- Investigate updating with partial entities (e.g. balance, userstock was unsetting IDs),
- Hash passwords on Users (bcrypt?), store JWTs for easier expiration (?), don't return hashed passwords on login, move auth to /api/v1/auth,
- Investigate best practices for used packages (namely Typescript, NodeJS and TypeORM) and implement (vague yet unknown actions),
- Implement early versioning for APIs.
