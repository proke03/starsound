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

  @Field()
  isForEmailVerification?: boolean = true
}

export async function checkEmail(
  ctx: Context,
  { email, isForEmailVerification }: CheckEmailInput
): Promise<boolean> {
  logger('checkEmail')
  const { em, liveQueryStore } = ctx

  if (!email) throw new Error('Must provide email')

  email = email.toLowerCase()
  const foundEmail = await em.findOne(User, {
    email: { $ilike: handleUnderscore(email) },
    isDeleted: false
  })
  if (isForEmailVerification && foundEmail) throw new Error('error.login.emailInUse')
  if (!isForEmailVerification && !foundEmail) throw new Error('error.login.emailNotFound')

  const verificationCode = generateRandom(111111, 999999)
  const mailOptions = {
    from: {
      name: '별별소리',
      address: process.env.MAIL_SERVICE_USER,
    },
    to: email,
    subject: isForEmailVerification? '별별소리 이메일 인증 코드' : '별별소리 비밀번호 재설정 코드',
    text: `${isForEmailVerification? '인증' : '재설정'} 코드는 ${verificationCode} 입니다.`,
  }
  smtpTransport.sendMail(mailOptions, async (error, responses) => {
    if(error) {
      console.log(error)
      return false
    }
    else {
      // if(!isForEmailVerification) {
      //   const user = await em.findOneOrFail(User, email) as User
      //   if(!user) throw new Error('error.login.emailNotFound')
      //   CacheManager.Instance.set(email, user.id)
      // }
      CacheManager.Instance.set(email, verificationCode)
      console.log(CacheManager.Instance.get(email))
      return true
    }
  })
  return true
}
