# Core application for Station

Under development, currently hosting documentation under `/docs`

### Seeding database

1. Make sure your database is created + up to date with migrations.

```bash
  npx prisma migrate dev
```

2. Run seed script.

```bash
npx prisma db seed
```
