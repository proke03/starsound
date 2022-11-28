import { Field, ID, InputType } from 'type-graphql'
import { Length, MaxLength } from 'class-validator'
import { Server, ServerCategory, ServerPermission, User } from '@/entity'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { Context } from '@/types'
import {logger, uploadImageFileSingle} from '@/util'
import { policy } from '@/policy'

@InputType()
export class UpdateServerInput {
  @Field(() => ID)
  serverId: string

  @Field({ nullable: true })
  @Length(policy.server.displayNameMinLength, policy.server.displayNameMaxLength)
  displayName?: string

  @Field({ nullable: true })
  @MaxLength(policy.server.descriptionLength)
  description?: string

  @Field(() => ServerCategory, { nullable: true })
  category?: ServerCategory

  @Field(() => GraphQLUpload, { nullable: true })
  avatarFile?: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  bannerFile?: FileUpload

  @Field(() => ID, { nullable: true })
  ownerId?: string

  @Field(() => Boolean, { nullable: true })
  isDownvotesEnabled?: boolean
}

export async function updateServer(
  { em, userId, liveQueryStore }: Context,
  {
    serverId,
    displayName,
    description,
    category,
    avatarFile,
    bannerFile,
    ownerId,
    isDownvotesEnabled
  }: UpdateServerInput
): Promise<Server> {
  logger('updateServer')
  displayName = displayName.trim()
  description = description.trim()
  const user = await em.findOneOrFail(User, userId)
  const server = await em.findOneOrFail(Server, serverId, ['owner'])
  if (ownerId && server.owner !== user)
    throw new Error('Must be server owner to change owner')
  await user.checkServerPermission(em, serverId, ServerPermission.ManageServer)
  em.assign(server, {
    displayName: displayName ?? server.displayName,
    description: description ?? server.description,
    category: category ?? server.category,
    avatarUrl: await uploadImageFileSingle(avatarFile, { width: policy.server.avatarWidth, height: policy.server.avatarHeight }, false, server.avatarUrl?? undefined),
    bannerUrl: await uploadImageFileSingle(bannerFile, { width: policy.server.bannerWidth, height: policy.server.bannerHeight }, false, server.bannerUrl?? undefined),
    isDownvotesEnabled: isDownvotesEnabled ?? server.isDownvotesEnabled
  })
  await em.persistAndFlush(server)
  liveQueryStore.invalidate(`Server:${serverId}`)
  return server
}
