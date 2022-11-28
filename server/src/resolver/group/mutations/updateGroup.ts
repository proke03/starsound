import { Field, ID, InputType } from 'type-graphql'
import { Length } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { Context } from '@/types'
import { Group, User } from '@/entity'
import {logger, uploadImageFileSingle} from '@/util'
import { policy } from '@/policy'

@InputType()
export class UpdateGroupInput {
  @Field(() => ID)
  groupId: string

  @Field({ nullable: true })
  @Length(policy.group.nameMinLength, policy.group.nameMaxLength)
  name?: string

  @Field(() => GraphQLUpload, { nullable: true })
  avatarFile?: FileUpload
}

export async function updateGroup(
  { em, userId, liveQueryStore }: Context,
  { groupId, name, avatarFile }: UpdateGroupInput
): Promise<Group> {
  logger('updateGroup')
  const group = await em.findOneOrFail(Group, groupId, ['users'])
  if (group.users.contains(em.getReference(User, userId)))
    throw new Error('Not in group')
  em.assign(group, {
    name: name ?? group.name,
    avatarUrl: await uploadImageFileSingle(avatarFile, { width: policy.group.avatarWidth, height: policy.group.avatarHeight }, false, group.avatarUrl?? undefined)
  })
  await em.persistAndFlush(group)
  liveQueryStore.invalidate(`Group:${groupId}`)
  return group
}
