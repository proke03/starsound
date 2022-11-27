import Tippy from '@tippyjs/react'
import { IconHide, IconShow } from '@/components/ui/icons/Icons'
import { useTranslation } from 'react-i18next'

export default function ShowPasswordButton({ showPassword, setShowPassword }) {
  const { t } = useTranslation()
  return (
    <Tippy content={showPassword ? 
      t('auth.createAccount.hidePassword') 
      : 
      t('auth.createAccount.showPassword')
    }>
      <div className={`form-show-password-button`}>
        {showPassword ? (
          <IconHide
            onClick={() => setShowPassword(false)}
            className="w-5 h-5"
          />
        ) : (
          <IconShow onClick={() => setShowPassword(true)} className="w-5 h-5" />
        )}
      </div>
    </Tippy>
  )
}
