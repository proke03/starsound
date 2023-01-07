# 별별소리

![logo](https://user-images.githubusercontent.com/19148682/203886499-ed612c11-9ad1-4c74-9963-eb287a87ba2d.png)

All-in-one chat and forums for communities.  
Demo: https://starsound.in  

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

- `VITE_API_DOMAIN` (domain server is running on i.e. `api.starsound.in`)

### Backend

#### Development

Start dev server with below environment variables:

```shell
# start development environment
docker-compose up -d

yarn run dev:server
```

#### Production
