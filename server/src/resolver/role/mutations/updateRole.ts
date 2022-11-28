import { Field, ID, InputType } from 'type-graphql'
import { IsHexColor, Length } from 'class-validator'
import { Role, ServerPermission, User } from '@/entity'
import { Context } from '@/types'
import { GraphQLHexColorCode } from 'graphql-scalars'
import {logger} from "@/util";
import { policy } from '@/policy'

@InputType()
export class UpdateRoleInput {
  @Field(() => ID)
  roleId: string

  @Field({ nullable: true })
  @Length(policy.role.nameMinLength, policy.role.nameMaxLength)
  name?: string

  @Field(() => GraphQLHexColorCode, { nullable: true })
  @IsHexColor()
  color?: string

  @Field(() => [ServerPermission], { nullable: true })
  permissions?: ServerPermission[]
}

export async function updateRole(
  { em, userId, liveQueryStore }: Context,
  { roleId, name, color, permissions }: UpdateRoleInput
): Promise<Role> {
  logger('updateRole')
  name = name.trim()
  const user = await em.findOneOrFail(User, userId)
  const role = await em.findOneOrFail(Role, roleId, ['server'])
  await user.checkServerPermission(
    em,
    role.server.id,
    ServerPermission.ManageServer
  )
  em.assign(role, {
    name: name ?? role.name,
    color,
    permissions: permissions ?? role.permissions
  })
  await em.persistAndFlush(role)
  liveQueryStore.invalidate(`Role:${roleId}`)
  return role
}
