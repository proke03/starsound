# 별별소리

All-in-one chat and forums for communities.

## Tech Stack

### Frontend

- [React.js](https://reactjs.org/)
- [Electron](https://www.electronjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/guide/introduction.html)
- [Apollo GraphQL Client](https://github.com/apollographql/apollo-client)
- [GraphQL Code Generator](https://www.graphql-code-generator.com/)

### Backend

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Apollo Server Express](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-express)
- [graphql-ws](https://github.com/enisdenjo/graphql-ws)
- [GraphQL Live Query](https://github.com/n1ru4l/graphql-live-query)
- [TypeGraphQL](https://typegraphql.com/)
- [MikroORM](https://mikro-orm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Development Instructions

### Frontend

#### Development

Start dev server:

- `yarn run dev:web`

#### Production

Build frontend:

- `yarn run build:web`

Environment variables:

- `VITE_API_DOMAIN` (domain server is running on i.e. `api.335oh.com`)

### Backend

#### Development

Start dev server with below environment variables:

```shell
# start development environment
docker-compose up -d

yarn run dev:server
```

Environment variables:

- `DATABASE_URL` (defaults to `postgresql://postgres:password@localhost:5432` if left blank)
- `ACCESS_TOKEN_SECRET` (required, secret used for encrypting passwords)
- `REDIS_URL` (optional, in-memory will be used if not provided)

The following environment variables are related to S3 file uploads and are required for file uploads to work.

- `MEDIA_DOMAIN` (domain media is hosted on i.e. `media.335oh.com`)
- `BUCKET` (name of bucket)
- `AWS_S3_ENDPOINT` (endpoint bucket is hosted on i.e. `aws.335oh.com`)
- `AWS_S3_ACCESS_KEY_ID` (access key ID provided by AWS)
- `AWS_S3_SECRET_ACCESS_KEY` (secret access key provided by AWS)

#### Production
