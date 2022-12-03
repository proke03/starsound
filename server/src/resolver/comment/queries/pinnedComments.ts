import { Comment, Post } from '@/entity'
import { QueryOrder } from '@mikro-orm/core'
import { Context } from '@/types'
import {logger} from "@/util";

export async function pinnedComments(
  { em }: Context,
  postId : string,
): Promise<Comment[]> {
  logger('pinnedComments')
  const post = await em.findOneOrFail(Post, postId)
  
  const comments = await em.find(
    Comment,
    { 
      $and: [
        { isPinned: true },
        { post: post },
      ],
    },
    {orderBy: { pinnedAt: QueryOrder.DESC }},
  )

  return comments
}
