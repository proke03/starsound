import { useCurrentUser } from '@/hooks/graphql/useCurrentUser'
import Dialog from '@/components/ui/dialog/Dialog'
import {
  IconCheck, 
  IconDelete, 
  IconEdit, 
  IconImage, 
  IconLogout, 
  IconSpinner, 
  IconX,
} from '@/components/ui/icons/Icons'
import UserAvatar from '@/components/user/UserAvatar'
import {
  useChangeUserAvatarMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
} from '@/graphql/hooks'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
import StyledDialog from "@/components/ui/dialog/StyledDialog";
import Tippy from "@tippyjs/react";
import ShowPasswordButton from "@/components/ui/ShowPasswordButton";
import ServerAvatar from "@/components/server/ServerAvatar";
import { useTranslation } from 'react-i18next'

export default function UserSettingsDialog({ open, setOpen }) {
  const { t } = useTranslation()
  const [user] = useCurrentUser()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })
  const password = watch('password')
  const currentPassword = watch('currentPassword')

  const [changePassword, { loading: changePasswordLoading }] =
    useChangePasswordMutation()

  const [changeAvatar] = useChangeUserAvatarMutation()
  const [disabled, setDisabled] = useState(false)
  const logout = () => {
    setDisabled(true)
    localStorage.removeItem('token')
    location.reload()
  }
  const close = () => {
    setOpen(false)
    setTimeout(() => reset(), 300)
  }

  const onSubmit = ({ password, currentPassword }) => {
    changePassword({
      variables: {
        input: {
          password,
          currentPassword
        }
      }
    }).then(() => {
      toast.success(t('user.settings.password.changeDone'))
      reset()
    })
  }

  return (
    <>
      <StyledDialog onSubmit={handleSubmit(onSubmit)} open={open} close={close} closeOnOverlayClick
        buttons={
          <>
            <button 
              disabled={disabled}
              onClick={() => logout()} 
              className="form-button-delete"
            >
              {t('settings.user.logout')}
              <IconLogout className="ml-2 w-5 h-5" />
              {disabled && (
                <IconSpinner className="w-5 h-5 text-primary ml-3" />
              )}
            </button>
            <button onClick={() => close()} className="form-button-submit">
              {t('settings.user.done')}
              <IconCheck className="ml-2 w-5 h-5" />
            </button>
          </>
        }
      >
        <DeleteAccountDialog
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
        />

        <div className="px-5 pt-5 pb-10">
          <div className="flex items-center font-semibold text-primary">
            <UserAvatar user={user} size={6} className="rounded-md mr-2" />
            {t('settings.user.title')}&nbsp;&nbsp;–&nbsp;&nbsp;
            <div className="truncate">{user.username}</div>
            <IconX
              className="h-5 w-5 highlightable ml-auto"
              onClick={() => close()}
            />
          </div>

          <div className="py-5 flex items-center">
            <UserAvatar user={user} size={20} />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              name="avatarFile"
              id="avatarFile"
              hidden
              onChange={e => {
                const avatarFile = e.target.files[0]
                if (!avatarFile) return
                changeAvatar({ variables: { input: { avatarFile } } })
              }}
            />
            <label htmlFor="avatarFile" className="h-9 transition hover:bg-gray-200 cursor-pointer flex items-center justify-center text-sm font-medium border rounded dark:border-gray-600 px-3 bg-gray-300 text-gray-800 ml-3">
              <IconImage className="w-5 h-5 mr-2" />
              {t('settings.user.uploadAvatar')}
            </label>
          </div>

          <div className="border dark:border-gray-750 rounded space-y-3 p-3">
            <div className="text-xs font-medium text-tertiary">{t('settings.user.changePassword')}</div>
            <div>
              <div className="relative">
                <input
                  className="form-input-password"
                  placeholder={t('user.newPassword')}
                  id="password"
                  {...register('password', {
                    minLength: 6,
                    required: true
                  })}
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                />
                <ShowPasswordButton setShowPassword={setShowPassword} showPassword={showPassword} />
              </div>
              {!!password && errors.password && (
                <div className="form-error">
                  {t('error.passwordLength')}
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  className="form-input-password"
                  placeholder={t('user.currentPassword')}
                  id="currentPassword"
                  {...register('currentPassword', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                />
                <ShowPasswordButton setShowPassword={setShowPassword} showPassword={showPassword} />
              </div>
            </div>

            <button
              disabled={
                changePasswordLoading ||
                !currentPassword ||
                !password ||
                password?.length < 6
              }
              className="form-button-submit ml-auto">
              {t('settings.user.changePassword')}
              {changePasswordLoading && <IconSpinner className="w-5 h-5 ml-2" />}
            </button>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="form-button-delete"
            >
              {t('settings.user.deleteAccount')}
              <IconDelete className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </StyledDialog>
    </>
  )
}

function DeleteAccountDialog({ deleteOpen, setDeleteOpen }) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [deleteAccount, { loading }] = useDeleteAccountMutation()
  const logout = () => {
    localStorage.removeItem('token')
    location.reload()
  }

  return (
    <Dialog isOpen={deleteOpen} close={() => setDeleteOpen(false)}>
      <div className="max-w-md w-full rounded-md bg-white dark:bg-gray-800 shadow-lg p-4">
        <div className="text-red-400 text-2xl font-semibold">
          {t('user.settings.deleteAccount')}
        </div>

        <div className="text-secondary pb-5 pt-3 text-base">
          {t('user.settings.confirmDelete')}
        </div>

        <div className="text-left">
          <label htmlFor="confirmPassword" className="label">
            {t('user.settings.password.title')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            className="textbox"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            className="form-button-cancel"
            type="button"
            onClick={() => setDeleteOpen(false)}
          >
            {t('user.settings.cancel')}
          </button>
          <button
            className="form-button-delete"
            type="button"
            disabled={!password || loading}
            onClick={() => {
              deleteAccount({ variables: { input: { password } } }).then(() => {
                logout()
              })
            }}
          >
            {t('user.settings.deleteAccount')}
            {loading && <IconSpinner className="w-5 h-5 text-primary ml-3" />}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
