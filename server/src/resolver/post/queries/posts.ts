import {
  ArgsType,
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType
} from 'type-graphql'
import {
  Folder,
  FolderVisibility,
  Post,
  RelationshipStatus,
  Server,
  ServerUser,
  ServerUserStatus,
  User
} from '@/entity'
import { Max, Min } from 'class-validator'
import { Context } from '@/types'
import { QueryOrder } from '@mikro-orm/core'
import dayjs from 'dayjs'
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from 'graphql-scalars'
import {logger} from "@/util";
import { policy } from '@/policy'

@ArgsType()
export class PostsArgs {
  @Field(() => GraphQLNonNegativeInt, { defaultValue: policy.post.posts.defaultOffset })
  @Min(policy.post.posts.minOffset)
  offset: number = policy.post.posts.defaultOffset

  @Field(() => GraphQLPositiveInt, { defaultValue: policy.post.posts.defaultLimit })
  @Min(policy.post.posts.minLimit)
  @Max(policy.post.posts.maxLimit)
  limit: number = policy.post.posts.defaultLimit

  @Field(() => PostsSort, {
    defaultValue: 'Hot'
  })
  sort: PostsSort = PostsSort.Hot

  @Field(() => PostsTime, {
    defaultValue: 'All'
  })
  time: PostsTime = PostsTime.All

  @Field(() => PostsFeed, {
    defaultValue: 'Joined'
  })
  feed: PostsFeed = PostsFeed.Joined

  @Field(() => ID, {
    nullable: true
  })
  serverId?: string

  @Field(() => ID, {
    nullable: true
  })
  folderId?: string

  @Field({
    nullable: true
  })
  search?: string
}

export enum PostsFeed {
  Joined = 'Joined',
  Featured = 'Featured',
  All = 'All'
}

registerEnumType(PostsFeed, {
  name: 'PostsFeed'
})

export enum PostsSort {
  New = 'New',
  Top = 'Top',
  Hot = 'Hot',
  Added = 'Added'
}

registerEnumType(PostsSort, {
  name: 'PostsSort'
})

export enum PostsTime {
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
  All = 'All'
}

registerEnumType(PostsTime, {
  name: 'PostsTime'
})

@ObjectType()
export class PostsResponse {
  @Field()
  hasMore: boolean

  @Field(() => [Post])
  posts: Post[]
}

export async function posts(
  { em, userId }: Context,
  { offset, limit, sort, time, folderId, serverId, search, feed }: PostsArgs
): Promise<PostsResponse> {
  logger('posts')
  const user = userId ? await em.findOneOrFail(User, userId) : null
  let orderBy = {}
  if (sort === PostsSort.New) orderBy = { createdAt: QueryOrder.DESC }
  else if (sort === PostsSort.Hot) orderBy = { hotRank: QueryOrder.DESC }
  else if (sort === PostsSort.Top) orderBy = { voteCount: QueryOrder.DESC }

  let servers: Server[] = []
  let folder: Folder

  if (serverId) {
    servers = [await em.findOneOrFail(Server, { id: serverId, isDeleted: false })]
  } else if (folderId) {
    folder = await em.findOneOrFail(Folder, folderId, ['owner'])
    if (!sort || sort === PostsSort.Added)
      orderBy = { folderPosts: { addedAt: QueryOrder.DESC } }
    if (folder.visibility === FolderVisibility.Private && folder.owner !== user)
      throw new Error('error.folder.private')
    if (
      folder.visibility === FolderVisibility.Friends &&
      folder.owner !== user
    ) {
      const [myData] = await user.getFriendData(em, folder.owner.id)
      if (myData.status !== RelationshipStatus.Friends)
        throw new Error('error.folder.friends')
    }
  } else if (feed === PostsFeed.Joined) {
    if (user) {
      const serverJoins = await em.find(
        ServerUser,
        { user, status: ServerUserStatus.Joined },
        ['server']
      )
      servers = serverJoins.map(join => join.server).filter(server => !server.isDeleted)
    } else {
      servers = await em.find(Server, {isFeatured: true, isDeleted: false})
    }
  } else if (feed === PostsFeed.Featured) {
    servers = await em.find(Server, {isFeatured: true, isDeleted: false})
  } else if (feed === PostsFeed.All) {
    servers = await em.find(Server, {isDeleted: false})
  }

  const posts = await em.find(
    Post,
    {
      $and: [
        { isDeleted: false },
        !time || time === PostsTime.All || folder
          ? {}
          : {
              createdAt: {
                // @ts-ignore
                $gt: dayjs().subtract(1, time.toLowerCase()).toDate()
              }
            },
        servers.length ? { server: servers } : {},
        folder ? { folderPosts: { folder } } : {}
      ]
    },
    ['author', 'server'],
    orderBy,
    limit + 1,
    offset
  )
  const hasMore = posts.length > limit
  return {
    hasMore,
    posts: hasMore ? posts.slice(0, limit) : posts
  } as PostsResponse
}
