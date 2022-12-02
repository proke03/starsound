import { Field, ID, InputType, Publisher } from 'type-graphql'
import { Length } from 'class-validator'
import { Context } from '@/types'
import { Comment, CommentVote, Post, Reply, User, VoteType } from '@/entity'
import { handleText, logger } from '@/util'
import { ChangePayload, ChangeType } from '@/resolver/subscriptions'
import { policy } from '@/policy'

@InputType()
export class CreateCommentInput {
  @Field()
  @Length(policy.comment.minLength, policy.comment.maxLength, {
    message: `Text must be between ${policy.comment.minLength} and ${policy.comment.maxLength} characters`
  })
  text: string

  @Field(() => ID)
  postId: string

  @Field(() => ID, { nullable: true })
  parentCommentId?: string
}

export async function createComment(
  { em, userId }: Context,
  { text, postId, parentCommentId }: CreateCommentInput,
  notifyCommentChanged: Publisher<ChangePayload>,
  notifyReplyChanged: Publisher<ChangePayload>
): Promise<Comment> {
  logger('createComment')
  text = text.replace(/<[^/>][^>]*><\/[^>]+>/, '')
  if (!text) throw new Error('error.comment.empty')

  const post = await em.findOneOrFail(Post, postId, ['author'])
  const user = await em.findOneOrFail(User, userId)

  const parentComment = parentCommentId
    ? await em.findOneOrFail(Comment, parentCommentId, ['author'])
    : null

  if (parentComment && parentComment.isDeleted) throw new Error('Cannot reply to deleted comment')

  text = handleText(text)

  const comment = em.create(Comment, {
    text: text,
    parentComment,
    post,
    author: user,
    voteCount: 0
  })
  comment.voteType = VoteType.Up
  // const vote = em.create(CommentVote, { comment, user, type: VoteType.Up })
  post.commentCount++
  // await em.persistAndFlush([comment, post, vote])
  await em.persistAndFlush([comment, post])

  let reply: Reply
  if (parentComment) {
    if (parentComment.author !== user) {
      reply = em.create(Reply, {
        comment,
        user: parentComment.author
      })
    }
  } else {
    await em.populate(post, ['author'])
    if (post.author !== user) {
      reply = em.create(Reply, {
        comment,
        user: post.author
      })
    }
  }
  await notifyCommentChanged({ id: comment.id, type: ChangeType.Added })
  if (reply) {
    await em.persistAndFlush(reply)
    await notifyReplyChanged({ id: reply.id, type: ChangeType.Added })
  }
  return comment
}
