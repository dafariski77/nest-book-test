## Description

### Use Case

- Members can borrow books with conditions
    - ✅  Members may not borrow more than 2 books
    - ✅  Borrowed books are not borrowed by other members
    - ✅  Member is currently not being penalized
- Member returns the book with conditions
    - ✅  The returned book is a book that the member has borrowed
    - ✅  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - ✅  Shows all existing books and quantities
    - ✅  Books that are being borrowed are not counted
- Member check
    - ✅  Shows all existing members
    - ✅  The number of books being borrowed by each member

### Result

You can check the api documentation on `{APP_URL}/docs`. The API endpoint are located at `{APP_URL}/api/v1/*`

### Techstack

Framework and library that I used:

- NestJS
- MySQL
- Prisma
- Zod
- Jest
- Swagger

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Running With Docker

Use Docker Compose to build and start the application:

```bash
docker-compose up --build
```

Once the services are up, the backend should be accessible at 
`http://localhost:8000`

If you need to apply database migrations, run:

```bash
docker-compose exec <service-name> yarn prisma migrate dev --schema=./src/infrastructure/prisma/schema.prisma
```

Seeding the data
```bash
docker-compose exec <service-name> yarn prisma db seed
```