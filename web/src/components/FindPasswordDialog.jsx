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

  const [emailSended, setEmailSended] = useState(false)
  const onSubmit = ({ usernameOrEmail, email, username, password }) => {
    const input = isEmail(usernameOrEmail)? { email: usernameOrEmail } : { username: usernameOrEmail }
    findPassword({
      variables: {
        input: {
          ...input,
        }
      }
    })
    .then(() => {
      setEmailSended(true)
    })
  }

  const close = () => {
    reset()
    setFindPasswordDialog(false)
  }

  const [disabled, setDisabled] = useState(true)
  
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
      <div className="space-y-4">
          <input
            id="usernameOrEmail"
            {...register('usernameOrEmail', {
              shouldUnregister: true
            })}
            className={`form-input`}
            placeholder={t('auth.login.name')}
          />

          <>
            <div className="relative">
              <input
                id="password"
                {...register('password', { required: true })}
                className={`form-input`}
                placeholder={t('auth.login.password')}
                // type={showPassword ? 'text' : 'password'}
              />
              <ShowPasswordButton
                // showPassword={showPassword}
                // setShowPassword={setShowPassword}
              />
            </div>
            <button 
              className="text-base cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => {
                // findPassword({
                //   variables: {
                //     input: {
                //       email: email ?? null,
                //     }
                //   }
                // }).then((res) => {
                //   if(res.data.verifyEmail){
                //     setEmailSended(true)
                //   }
                // })
              }}
            >
              비밀번호 찾기
            </button>
          </>
        </div>
      </div>
    </StyledDialog>
  )
}
