import {
  Post,
  Server,
} from '@/entity'
import { Context } from '@/types'
import { QueryOrder } from '@mikro-orm/core'
import {logger} from "@/util"

//TODO: 고민 필요. publicServers 따로 만든 거처럼 따로 만들었는데...
export async function pinnedPosts(
  { em }: Context, 
  serverId: string,
): Promise<Post[]> {
  logger('pinnedPosts')
  // const user = userId ? await em.findOneOrFail(User, userId) : null
  let orderBy = { pinnedAt: QueryOrder.DESC }

  let servers: Server[] = []
  // let folder: Folder

  if (serverId) {
    servers = [await em.findOneOrFail(Server, { id: serverId, isDeleted: false })]
  }

  const posts = await em.find(
    Post,
    {
      $and: [
        { isPinned: true },
        servers.length ? { server: servers } : {},
        // folder ? { folderPosts: { folder } } : {}
      ],
    },
    ['author', 'server'],
    orderBy
  )
  return posts as Post[]
}
