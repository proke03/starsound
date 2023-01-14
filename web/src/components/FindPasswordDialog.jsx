import { useLoginDialog } from '@/hooks/useLoginDialog'
import { useForm } from 'react-hook-form'
import { 
  useVerifyEmailMutation, 
  useCheckCodeMutation,
  useCreateAccountMutation,
  useLoginMutation,
  useFindPasswordMutation,
  useChangePasswordWithEmailMutation,
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

export default function FindPasswordDialog() {
  const { t } = useTranslation()
  const [findPasswordDialog, setFindPasswordDialog] = useStore(s => [s.findPasswordDialog, s.setFindPasswordDialog])
  const [findPassword, { loading }] = useFindPasswordMutation()
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
  const [emailSended, setEmailSended] = useState(false)
  
  const verificationCode = watch('verificationCode')
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  
  const newPassword = watch('newPassword')
  const newPasswordConfirm = watch('newPasswordConfirm')
  const [showPassword, setShowPassword] = useState(false)

  const [changePasswordWithEmail, { loading: changePasswordWithEmailLoading }] =
    useChangePasswordWithEmailMutation()

  const [checkVerifyEmail, { loading: checkVerifyEmailLoading }] =
    useVerifyEmailMutation()

  const [checkCode, { loading: checkCodeLoading }] =
    useCheckCodeMutation()

  const close = () => {
    reset()
    setFindPasswordDialog(false)
  }

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (isCodeVerified 
      && newPassword
      && newPasswordConfirm 
      && newPassword === newPasswordConfirm
      ) {
      setDisabled(false)
      return
    }
    setDisabled(true)
  }, [isCodeVerified, newPassword, newPasswordConfirm])

  const onSubmit = ({ email, verificationCode, newPassword }) => {
    if(disabled) return;

    changePasswordWithEmail({
      variables: {
        input: {
          email,
          password: newPassword
        }
      }
    }).then(() => {
      toast.success(t('user.settings.password.changeDone'))
      reset()
    })
  }
  
  return (
    <StyledDialog
      close={close}
      open={findPasswordDialog}
      onSubmit={handleSubmit(onSubmit)}
      buttons={
        <button
          type="submit"
          className={`form-button-submit`}
          disabled={disabled}
        >
          {loading ? (
            <IconSpinner className="w-5 h-5" />
          ) : (
            <IconUserToServerArrow className="w-5 h-5" />
          )}
        </button>
      }
    >
      <div className="rounded-t-lg bg-gradient-to-r from-red-400 to-indigo-600 h-2" />
      <div className="px-5 pt-2 pb-9 text-left">
        <div className="pt-2 pb-4 flex items-center">
          <span className="text-lg mr-3 py-3 inline-flex items-center justify-center px-3">비밀번호 찾기</span>
          <div className="h-4 ml-auto">
            <VectorLogo className="-mt-2 -mr-20 h-12 text-secondary" />
          </div>
          <IconX
            className="ml-5 w-5 h-5 text-tertiary highlightable"
            onClick={() => close()}
          />
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              id="email"
              {...register('email', {
                shouldUnregister: true
              })}
              className={`form-input`}
              placeholder={t('auth.email')}
            />
            <Tippy content={t('auth.findPassword.sendVerificationCode')}>
              <div className={`form-show-password-button`}>
                <IconUserToServerArrow
                  className="w-5 h-5"
                  disabled={emailSended}
                  onClick={() => {
                    if(emailSended) return;
                    if(!email) {
                      toast.error(t('auth.createAccount.invalidEmail'))
                      return
                    }
                    if(!isEmail(email)){
                      toast.error(t('auth.createAccount.emailRequired'))
                      return
                    }
                    findPassword({
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
                  }}
                />
              </div>
            </Tippy>
          </div>

          {
            isCodeVerified ? 
            (
              <>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    {...register('newPassword', { required: true })}
                    className={`form-input`}
                    placeholder={t('auth.findPassword.newPassword')}
                  />
                  <ShowPasswordButton
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPasswordConfirm"
                    {...register('newPasswordConfirm', { required: true })}
                    className={`form-input`}
                    placeholder={t('auth.findPassword.newPasswordConfirm')}
                  />
                </div>
              </>
            )
            :
            (
              <div className="relative">
                <input
                  id="verificationCode"
                  {...register('verificationCode', { required: true })}
                  className={`form-input`}
                  placeholder={t('auth.findPassword.verificationCode')}
                />
                <Tippy content={t('auth.createAccount.checkCode')}>
                  <div className={`form-show-password-button`}>
                    <IconUserToServerArrow
                      className="w-5 h-5"
                      onClick={() => {
                        console.log(verificationCode)
                        if(!verificationCode) {
                          toast.error(t('auth.createAccount.codeRequired'))
                          return
                        }
                        if(verificationCode.length !== 6) {
                          toast.error(t('auth.createAccount.invalidCode'))
                          return
                        }

                        checkCode({
                          variables: {
                            input: {
                              email: email ?? null,
                              verificationCode: verificationCode ?? null,
                            }
                          }
                        })
                        .then((res) => {
                          if(res.data.checkCode)
                            setIsCodeVerified(true)
                        })
                      }}
                    />
                  </div>
                </Tippy>
              </div>
            )
          }
        </div>
      </div>
    </StyledDialog>
  )
}
