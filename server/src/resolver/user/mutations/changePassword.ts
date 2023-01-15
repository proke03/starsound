import { Field, InputType } from 'type-graphql'
import { MinLength } from 'class-validator'
import { Context } from '@/types'
import { User } from '@/entity'
import * as argon2 from 'argon2'
import {CacheManager, logger} from "@/util";
import { policy } from '@/policy'

@InputType()
export class ChangePasswordInput {
  @Field()
  @MinLength(policy.user.passwordMinLength)
  password: string

  @Field({ nullable: true })
  currentPassword: string
}

@InputType()
export class ChangePasswordWithEmailInput {
  @Field()
  email: string

  @Field()
  @MinLength(policy.user.passwordMinLength)
  password: string
}

export async function changePassword(
  { em, userId }: Context,
  { password, currentPassword }: ChangePasswordInput
): Promise<User> {
  logger('changePassword')
  const user = await em.findOneOrFail(User, userId)
  const match = await argon2.verify(user.passwordHash, currentPassword)
  if (!match) throw new Error('error.login.wrongPassword')
  user.passwordHash = await argon2.hash(password)
  await em.persistAndFlush(user)
  return user
}

export async function changePasswordWithEmail(
  { em }: Context,
  { email, password }: ChangePasswordWithEmailInput
): Promise<User> {
  logger('changePasswordWithEmail')
  const user = await em.findOneOrFail(User, { email: email })
  if(!user) throw new Error('error.login.invalidEmail')
  user.passwordHash = await argon2.hash(password)
  await em.persistAndFlush(user)
  return user
}
