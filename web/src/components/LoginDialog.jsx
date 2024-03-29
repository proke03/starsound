import { useLoginDialog } from '@/hooks/useLoginDialog'
import { useForm } from 'react-hook-form'
import { 
  useVerifyEmailMutation, 
  useCheckCodeMutation,
  useCreateAccountMutation,
  useLoginMutation,
  useFindPasswordMutation
} from '@/graphql/hooks'
import {
  IconEmail,
  IconSpinner,
  IconUser,
  IconUserToServerArrow,
  IconX
} from '@/components/ui/icons/Icons'
import { useState, useEffect } from 'react'
import { VectorLogo } from '@/components/ui/vectors'
import isEmail from 'validator/es/lib/isEmail'
import StyledDialog from '@/components/ui/dialog/StyledDialog'
import ShowPasswordButton from '@/components/ui/ShowPasswordButton'
import { useTranslation } from 'react-i18next'
import Tippy from '@tippyjs/react'
import toast from 'react-hot-toast'
import { policy } from '@/policy'
import { useStore } from '@/hooks/useStore'

const usernameRegex = /^[가-힣A-Za-z0-9-_]+$/gi

export default function LoginDialog() {
  const { t } = useTranslation()
  const [open, setOpen, isCreateAccount, setCreateAccount] = useLoginDialog()
  const setFindPasswordOpen = useStore(s => s.setFindPasswordDialog)
  const [showPassword, setShowPassword] = useState(false)
  const {
    handleSubmit,
    register,
    watch,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    shouldUnregister: true
  })
  const email = watch('email')
  const username = watch('username')
  const usernameOrEmail = watch('usernameOrEmail')
  const [emailSended, setEmailSended] = useState(false)
  const [checkVerifyEmail, { loading: checkVerifyEmailLoading }] =
    useVerifyEmailMutation()

  const [findPassword, {loading: findPasswordLoading}] = 
    useFindPasswordMutation()
  
  const verifyCode = watch('verifyCode')
  const [checkCode, { loading: checkCodeLoading }] =
    useCheckCodeMutation()
  const [emailVerified, setEmailVerified] = useState(false)

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const [createAccount, { loading: createAccountLoading }] =
    useCreateAccountMutation()
  const [login, { loading: loginLoading }] = useLoginMutation()
  const onSubmit = ({ usernameOrEmail, email, username, password }) => {
    if (isCreateAccount) {
      createAccount({
        variables: {
          input: {
            username,
            password,
            email: email.trim()
          }
        }
      }).then(
        ({
          data: {
            createAccount: { accessToken, user }
          }
        }) => {
          localStorage.setItem('token', accessToken)
          location.reload()
        }
      )
    } else {
      const input = isEmail(usernameOrEmail.trim())
        ? { email: usernameOrEmail.trim() }
        : { username: usernameOrEmail.trim() }
      login({ 
        variables: { 
          input: { 
            ...input, 
            password
          } 
        } 
      })
      .then(
        ({
          data: {
            login: { accessToken, user }
          }
        }) => {
          localStorage.setItem('token', accessToken)
          location.reload()
        }
      )
    }
  }

  const close = () => {
    setEmailSended(false)
    reset()
    setOpen(false)
  }

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if(isCreateAccount && !username) return;
    setTimeout(() => {
      const _disabled = !(isCreateAccount
        ? !!username &&
          username.length >= policy.user.nameMinLength &&
          username.length <= policy.user.nameMaxLength &&
          usernameRegex.test(username) &&
          (!email || (!!email && isEmail(email))) &&
          !!password &&
          password.length >= policy.user.passwordMinLength &&
          !!confirmPassword &&
          confirmPassword === password &&
          emailVerified
        : !!usernameOrEmail && !!password)
      setDisabled(_disabled)
    }, 100)

  }, [isCreateAccount, username, email, password, confirmPassword, usernameOrEmail, emailVerified])

  
  return (
    <StyledDialog
      close={close}
      open={open}
      onSubmit={handleSubmit(onSubmit)}
      buttons={
        <button
          type="submit"
          className={`form-button-submit`}
          disabled={disabled}
        >
          {(isCreateAccount && createAccountLoading) ||
          (!isCreateAccount && loginLoading) ? (
            <IconSpinner className="w-5 h-5" />
          ) : (
            <IconUserToServerArrow className="w-5 h-5" />
          )}
        </button>
      }
    >
      <div className="rounded-t-lg bg-gradient-to-r from-red-400 to-indigo-600 h-2" />
      <div className="px-5 pt-2 pb-9 text-left">
        <div className="pb-4 flex items-center">
          <div
            onClick={() => {
              if (isCreateAccount) {
                setCreateAccount(false)
                reset()
              }
            }}
            className={`text-sm cursor-pointer mr-3 py-3 border-b-2 inline-flex items-center justify-center px-3 ${
              isCreateAccount
                ? 'border-transparent text-secondary'
                : 'dark:border-gray-300 text-primary'
            }`}
          >
            {t('auth.login.label')}
          </div>

          <div
            onClick={() => {
              if (!isCreateAccount) {
                setCreateAccount(true)
                reset()
              }
            }}
            className={`text-sm cursor-pointer py-3 border-b-2 inline-flex items-center justify-center px-3 ${
              isCreateAccount
                ? 'dark:border-gray-300 text-primary'
                : 'border-transparent text-secondary'
            }`}
          >
            {t('auth.createAccount.label')}            
          </div>

          <div className="h-4 ml-auto">
            <VectorLogo className="-mt-2 -mr-20 h-12 text-secondary" />
            {/* <VectorLogo className="-mt-2 -mr-16 h-8 text-secondary" /> */}
          </div>
          <IconX
            className="ml-5 w-5 h-5 text-tertiary highlightable"
            onClick={() => close()}
          />
        </div>

        <div className="space-y-4">
          {isCreateAccount ? (
            <>
              <div>
                <div className="relative">
                  <input
                    id="username"
                    {...register('username', {
                      required: true,
                      pattern: usernameRegex,
                      maxLength: policy.user.nameMaxLength,
                      minLength: policy.user.nameMinLength,
                    })}
                    className={`form-input-icon`}
                    placeholder={t('auth.createAccount.name')}
                    minLength={policy.user.nameMinLength}
                    maxLength={policy.user.nameMaxLength}
                  />
                  <IconUser className={`form-input-icon-icon`} />
                </div>
                {errors.username?.type === 'minLength' && (
                  <div className={`form-error`}>
                    {t('auth.createAccount.userNameLength')}
                  </div>
                )}
                {errors.username?.type === 'pattern' && (
                  <div className={`form-error`}>
                    {t('auth.createAccount.usernameLimit')}
                  </div>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="email"
                    disabled={emailSended}
                    {...register('email', {
                      validate: {
                        email: value =>
                          !value || isEmail(value) || t('auth.createAccount.invalidEmail')
                      }
                    })}
                    className={`form-input-icon`}
                    placeholder={t('auth.createAccount.email')}
                    type="email"
                  />
                  <IconEmail className={`form-input-icon-icon`} />
                  {!emailSended &&
                    <Tippy
                      disabled={emailSended} 
                      content={t('auth.createAccount.verifyEmail')}
                    >
                      <div className={`form-show-password-button`}>
                        <IconUserToServerArrow
                          className="w-5 h-5"
                          onClick={() => {
                            if(emailSended) return;
                            if(!(!!email && isEmail(email))) {
                              toast.error(!email?
                                t('auth.createAccount.emailRequired')
                                :
                                t('auth.createAccount.invalidEmail')
                              )
                              return
                            }
                            if(!emailSended) {
                              checkVerifyEmail({
                                variables: {
                                  input: {
                                    email: email ?? null
                                  }
                                }
                              })
                              .then((res) => {
                                if(res.data.verifyEmail){
                                  setEmailSended(true)
                                }
                              })
                            }
                          }}
                        />
                      </div>
                    </Tippy>
                  }
                  {/* {
                    emailSended &&
                    {remainingTime}
                  } */}
                </div>
                {errors.email?.type === 'email' && (
                  <div className={`form-error`}>{errors.email.message}</div>
                )}
              </div>
            </>
          ) : (
            <input
              id="usernameOrEmail"
              {...register('usernameOrEmail', {
                shouldUnregister: true
              })}
              className={`form-input`}
              placeholder={t('auth.login.name')}
            />
          )}

          {isCreateAccount ? (
            <>
              {emailSended && !emailVerified &&
                <div>
                  <div className="relative">
                    <input
                      id="verifyCode"
                      {...register('verifyCode', {
                        required: true,
                        minLength: 6
                      })}
                      className={`form-input-password`}
                      placeholder={t('auth.createAccount.verifyCode')}
                      type={'text'}
                      minLength={6}
                    />
                    <Tippy content={t('auth.createAccount.checkCode')}>
                      <div className={`form-show-password-button`}>
                        <IconUserToServerArrow
                          className="w-5 h-5"
                          onClick={() => {
                            if(!(!!verifyCode && verifyCode.length === 6)) {
                              toast.error(!verifyCode?
                                t('auth.createAccount.codeRequired')
                                :
                                t('auth.createAccount.invalidCode')
                              )
                              return
                            }
                            checkCode({
                              variables: {
                                input: {
                                  email: email ?? null,
                                  verificationCode: verifyCode ?? null,
                                }
                              }
                            })
                            .then((res) => {
                              if(res.data.checkCode)
                                setEmailVerified(true)
                            })
                          }}
                        />
                      </div>
                    </Tippy>
                  </div>
                  {/* {errors.password?.type === 'minLength' && (
                    <div className={`form-error`}>
                      {t('auth.createAccount.passwordLimit')}
                    </div>
                  )} */}
                </div>
              }
              <div>
                <div className="relative">
                  <input
                    id="password"
                    {...register('password', {
                      required: true,
                      minLength: policy.user.passwordMinLength,
                    })}
                    className={`form-input-password`}
                    placeholder={t('auth.createAccount.password')}
                    type={showPassword ? 'text' : 'password'}
                    minLength={policy.user.passwordMinLength}
                  />
                  <ShowPasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </div>
                {errors.password?.type === 'minLength' && (
                  <div className={`form-error`}>
                    {t('auth.createAccount.passwordLimit')}
                  </div>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    {...register('confirmPassword', {
                      required: true,
                      validate: {
                        matchesPreviousPassword: value => {
                          const { password } = getValues()
                          return password === value || t('auth.createAccount.passwordMatch')
                        }
                      }
                    })}
                    className={`form-input-password`}
                    placeholder={t('auth.createAccount.passwordConfirm')}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <ShowPasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </div>
                {!!password &&
                  !!confirmPassword &&
                  password !== confirmPassword && (
                    <div className={`form-error`}>{t('auth.createAccount.passwordMatch')}</div>
                  )}
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <input
                  id="password"
                  {...register('password', { required: true, minLength: policy.user.passwordMinLength })}
                  minLength={policy.user.passwordMinLength}
                  className={`form-input`}
                  placeholder={t('auth.login.password')}
                  type={showPassword ? 'text' : 'password'}
                />
                <ShowPasswordButton
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>
              <button 
                type="button"
                className="text-base cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setFindPasswordOpen(true)
                  setOpen(false)
                }}
              >
                {t('auth.findPassword.label')}
              </button>
            </>
          )}
        </div>
      </div>
    </StyledDialog>
  )
}
