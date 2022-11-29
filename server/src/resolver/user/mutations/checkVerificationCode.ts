import { Context } from '@/types'
import { Field, InputType } from 'type-graphql'
import { logger} from '@/util'
import { GraphQLEmailAddress } from 'graphql-scalars'
import { CacheManager } from '@/util'

@InputType()
export class CheckVerificationCodeInput {
  @Field(() => GraphQLEmailAddress, { nullable: true })
  email?: string

  @Field(() => String)
  verificationCode?: string
}

export async function checkVerificationCode(
  ctx: Context,
  { email, verificationCode }: CheckVerificationCodeInput
): Promise<boolean> {
  logger('checkVerificationCode')
  const { em, liveQueryStore } = ctx

  if (!email) throw new Error('Must provide email')

  if(verificationCode != CacheManager.Instance.get(email)) {
    throw new Error('error.register.codeNotMatch')
  }

  return true
}
