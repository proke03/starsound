import UserAvatar from '@/components/user/UserAvatar'
import { IconChannel, IconUsers } from '@/components/ui/icons/Icons'
import { useTranslation } from 'react-i18next'

export default function MessagesStart({ user, channel, group }) {
  const { t } = useTranslation()
  return (
    <div className={`px-4 py-5.5 flex items-end`}>
      <div>
        {!!user && (
          <>
            <UserAvatar user={user} size={20} />
            <div className="text-3xl font-semibold pt-4 text-primary">
              {user.username}
            </div>
            <div className="pt-2 text-tertiary select-none text-base">
              {/* This is the beginning of your direct message history with{' '}
              <span className="font-semibold">@{user.username}</span> */}
              {t('message.startDm', { username: user.username })}
            </div>
          </>
        )}

        {!!channel && (
          <>
            <div className="rounded-full flex items-center justify-center w-20 h-20 dark:bg-gray-700">
              <IconChannel className="w-2/3 h-2/3 text-primary" />
            </div>
            <div className="text-3xl font-semibold pt-4 text-primary">
              {t('channel.welcome.title', { channel: channel.name })}
            </div>
            <div className="pt-2 text-tertiary select-none text-base">
              {t('channel.welcome.description', { channel: channel.name})}
            </div>
          </>
        )}

        {!!group && (
          <>
            <div className="rounded-full flex items-center justify-center w-20 h-20 dark:bg-gray-700">
              <IconUsers className="w-2/3 h-2/3 text-primary" />
            </div>
            <div className="text-3xl font-semibold pt-4 text-primary">
              {group.name}
            </div>
            <div className="pt-2 text-tertiary select-none text-base">
              Welcome to the beginning of the{' '}
              <span className="font-semibold">{group.displayName}</span> group.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
