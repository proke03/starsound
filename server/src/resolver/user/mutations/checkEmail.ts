import { Context } from '@/types'
import { Field, InputType } from 'type-graphql'
import { User } from '@/entity'
import { handleUnderscore, logger} from '@/util'
import { GraphQLEmailAddress } from 'graphql-scalars'
import { smtpTransport } from '@/config/email'
import { CacheManager } from '@/util'

const generateRandom = (min, max) => {
  return Math.floor(Math.random()*(max-min+1)) + min;
}

@InputType()
export class CheckEmailInput {
  @Field(() => GraphQLEmailAddress, { nullable: true })
  email?: string
}

export async function checkEmail(
  ctx: Context,
  { email }: CheckEmailInput
): Promise<boolean> {
  logger('checkEmail')
  const { em, liveQueryStore } = ctx

  if (!email) throw new Error('Must provide email')

  email = email.toLowerCase()
  const foundEmail = await em.findOne(User, {
    email: { $ilike: handleUnderscore(email) },
    isDeleted: false
  })
  if (foundEmail) throw new Error('error.login.emailInUse')

  const verificationCode = generateRandom(111111, 999999)
  const mailOptions = {
    from: {
      name: '별별소리',
      address: process.env.MAIL_SERVICE_USER,
    },
    to: email,
    subject: '별별소리 이메일 인증 코드',
    text: `인증 코드는 ${verificationCode} 입니다.`,
  }
  smtpTransport.sendMail(mailOptions, (error, responses) => {
    if(error) {
      console.log(error)
      return false
    }
    else {
      CacheManager.Instance.set(email, verificationCode)
      console.log(CacheManager.Instance.get(email))
      return true
    }
  })
  return true
}
