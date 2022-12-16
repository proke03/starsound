import {
  MemoryCacheAdapter,
  Options,
  ReflectMetadataProvider
} from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { CustomError } from '@/types/CustomError'
import { BaseEntity } from '@/entity/BaseEntity'
import {
  Channel,
  ChannelUser,
  Comment,
  CommentVote,
  File,
  Folder,
  FolderPost,
  FolderVisibility,
  Group,
  GroupUser,
  Image,
  LinkMetadata,
  Message,
  Post,
  PostImage,
  PostVideo,
  PostVote,
  Relationship,
  Reply,
  Role,
  Server,
  ServerFolder,
  ServerUser,
  User,
  UserFolder
} from '@/entity'
import { RedisCacheAdapter } from 'mikro-orm-cache-adapter-redis'
import Redis from 'ioredis'

export const mikroOrmConf = {
  highlighter: new SqlHighlighter(),
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [
    Channel,
    ChannelUser,
    Comment,
    CommentVote,
    Reply,
    Folder,
    FolderPost,
    FolderVisibility,
    ServerFolder,
    UserFolder,
    Group,
    GroupUser,
    Message,
    Post,
    PostImage,
    PostVideo,
    PostVote,
    Role,
    Server,
    ServerUser,
    Relationship,
    User,
    BaseEntity,
    File,
    Image,
    LinkMetadata
  ],
  type: 'postgresql',
  // clientUrl:
  //   process.env.DATABASE_URL ??
  //   'postgresql://postgres:password@localhost:5432/postgres',
  // host: process.env.MIKRO_ORM_HOST ?? 'localhost',
  // port: process.env.MIKRO_ORM_PORT ? parseInt(process.env.DB_PORT) : 5432,
  // user: process.env.MIKRO_ORM_USER ?? 'postgres',
  // password: process.env.MIKRO_ORM_PASSWORD ?? 'password',
  // dbName: process.env.MIKRO_ORM_DB ?? 'postgres',
  host: process.env.MIKRO_ORM_HOST,
  port: process.env.MIKRO_ORM_PORT,
  user: process.env.MIKRO_ORM_USER,
  password: process.env.MIKRO_ORM_PASSWORD,
  dbName: process.env.MIKRO_ORM_DB,

  debug: process.env.NODE_ENV !== 'production',
  forceUtcTimezone: true,
  findOneOrFailHandler: (entityName: string) => {
    return new CustomError('error.entityNotFound', entityName)
  },
  pool: {
    min: 10,
    max: 20,
    createTimeoutMillis: 3 * 1000,
    acquireTimeoutMillis: 30 * 1000,
    idleTimeoutMillis: 30 * 1000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false
  },
  driverOptions: process.env.NODE_ENV === 'production'
    // && process.env.SSL !== 'false'
    ?
    {
      connection: {
        ssl: false
      }
    }
    :
    {
      connectionString: process.env.DATABASE_URL,
      connection: { ssl: false }
    },
  resultCache: process.env.NODE_ENV === 'production' && process.env.REDIS_URL
    ? {
      adapter: RedisCacheAdapter,
      options: {
        client: new Redis(process.env.REDIS_URL)
      }
    }
    : { adapter: MemoryCacheAdapter },
  migrations: {
    disableForeignKeys: false
  }
} as unknown as Options<PostgreSqlDriver>
