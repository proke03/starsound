import { IconExplore, IconHome, IconSpinner } from '@/components/ui/icons/Icons'
import ServerAvatar from '@/components/server/ServerAvatar'
import { matchPath, useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ServerListItem from '@/components/server/list/ServerListItem'
import { useStore } from '@/hooks/useStore'
import { getOS } from '@/utils/getOS'
import ContextMenuTrigger from '@/components/ui/context/ContextMenuTrigger'
import { ContextMenuType } from '@/types/ContextMenuType'
import { useHasServerPermissions } from '@/hooks/useHasServerPermissions'
import {
  ServerPermission,
  usePublicServersQuery,
  ChannelType,
  useDeleteServerMutation
} from '@/graphql/hooks'
import { useCurrentUser } from '@/hooks/graphql/useCurrentUser'
import CreateServerButton from '@/components/server/create/CreateServerButton'
import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/dialog/Dialog'
import StyledDialog from '@/components/ui/dialog/StyledDialog'
import ShowPasswordButton from '@/components/ui/ShowPasswordButton'
import CountBadge from '@/components/ui/CountBadge'

export default function ServerList({ hide = false }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const homePage = useStore(s => s.homePage)
  // const homeActive = pathname !== '/explore' && !pathname.startsWith('/+')
  const homeActive = pathname !== '/explore' && !pathname.startsWith('/server')
  const exploreActive = pathname.startsWith('/explore')
  const isMac = getOS() === 'Mac OS' && window.electron
  const [currentUser] = useCurrentUser()

  const { data: publicServersData } = usePublicServersQuery({
    variables: { featured: true },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })
  const [servers, setServers] = useState(currentUser
    ? currentUser.servers
    : publicServersData?.publicServers ?? [])
  
  useEffect(() => {
    if(!publicServersData || !publicServersData.publicServers) return

    setServers(currentUser? currentUser.servers : publicServersData?.publicServers?? [])
  }, [currentUser])

  useEffect(() => {
    if(!currentUser || !currentUser.isAdmin) return
    if(!publicServersData || !publicServersData.publicServers) return
    const tempServers = []
    currentUser.servers.forEach(server => {
      let result = false
      publicServersData.publicServers.forEach(publicServer => {
        if(server.id === publicServer.id) {
          result = true
        }
      })
      const temp = Object.assign({}, server)
      temp.isFeatured = result
      tempServers.push(temp)
    })
    setServers(tempServers)
  }, [currentUser])

  return (
    <>
      <div
        className={`${
          hide ? 'hidden md:flex' : 'flex'
        } h-full flex-col items-center min-w-[4.5rem] w-18 bg-gray-300 dark:bg-gray-900 overflow-y-auto scrollbar-none`}
      >
        {isMac && <div className="h-5" />}
        <div className="h-full flex flex-col items-center w-full divide-y dark:divide-gray-800 divide-gray-200">
          <div className="space-y-2 flex flex-col items-center py-2">
            <ServerListItem
              name={t('home')}
              to={`${homePage ? `/${homePage}` : '/'}`}
              active={homeActive}
              className={`${
                homeActive
                  ? 'bg-blue-600'
                  : 'dark:bg-gray-800 bg-white hover:bg-blue-600 dark:hover:bg-blue-600'
              }`}
            >
              <IconHome
                className={`w-5 h-5 group-hover:text-white transition ${
                  homeActive ? 'text-white' : 'text-blue-500'
                }`}
              />
            </ServerListItem>

            <ServerListItem
              name={t('explore.title')}
              to="/explore"
              active={exploreActive}
              className={
                exploreActive
                  ? 'bg-green-600'
                  : 'dark:bg-gray-800 bg-white hover:bg-green-600 dark:hover:bg-green-600'
              }
            >
              <IconExplore
                className={`w-5 h-5 group-hover:text-white transition ${
                  exploreActive ? 'text-white' : 'text-green-500'
                }`}
              />
            </ServerListItem>

            {!!currentUser && <CreateServerButton />}
          </div>

          {!!servers && servers.length > 0 && (
            <div className="space-y-2 flex flex-col items-center py-2">
              {servers.map(server => (
                <ServerListServer server={server} key={server.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function ServerListServer({ server }) {
  const { pathname } = useLocation()
  const matched = matchPath(pathname, { path: '/planets/:server' })
  const serverName = matched?.params?.server?.substring(0)
  const serverPages = useStore(s => s.serverPages)
  const [canViewPrivateChannels] = useHasServerPermissions({
    server,
    permissions: [ServerPermission.PrivateChannels]
  })
  const channels = (server.channels ?? []).filter(channel =>
    channel.type === ChannelType.Private ? canViewPrivateChannels : true
  )
  const unread = !!channels.find(c => c.isUnread)
  const mentionCount =
    channels.length > 0
      ? channels.map(c => c.mentionCount).reduce((acc, cur) => acc + cur)
      : 0
  const active = serverName === server.name
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DeleteServerDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        server={server}
      />

      <ContextMenuTrigger
        className="h-12"
        data={{
          type: ContextMenuType.Server,
          server,
          openDelete: () => setDeleteOpen(true)
        }}
      >
        <ServerListItem
          to={`/planets/${server.name}${serverPages[server.name] ?? ''}`}
          name={server.displayName}
          active={active}
          unread={unread}
        >
          <ServerAvatar
            server={server}
            size={12}
            className={`bg-gray-200 h-12 w-12 dark:bg-gray-800 group-hover:rounded-2xl transition-all ${
              active ? 'rounded-2xl' : 'rounded-3xl'
            }`}
          />

          {!!mentionCount && (
            <div className="absolute -bottom-1 -right-1 rounded-full border-3 dark:border-gray-900">
              <CountBadge count={mentionCount} />
            </div>
          )}
        </ServerListItem>
      </ContextMenuTrigger>
    </>
  )
}

function DeleteServerDialog({ open, setOpen, server }) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [deleteServer, { loading }] = useDeleteServerMutation()
  const { push } = useHistory()

  return (
    <StyledDialog
      open={open}
      close={() => setOpen(false)}
      closeOnOverlayClick
      small
      buttons={
        <>
          <button
            className="form-button-cancel"
            type="button"
            onClick={() => setOpen(false)}
          >
            {t('server.list.cancel')}
          </button>
          <button
            className="form-button-delete"
            type="button"
            disabled={!password || loading}
            onClick={() => {
              deleteServer({
                variables: { input: { password, serverId: server.id } }
              }).then(() => {
                setOpen(false)
                push('/')
              })
            }}
          >
            {t('server.list.delete')}
            {loading && <IconSpinner className="w-5 h-5 text-primary ml-3" />}
          </button>
        </>
      }
    >
      <div className="max-w-md w-full rounded-md dark:bg-gray-800 shadow-lg px-5 pt-5 pb-10">
        <div className="text-red-400 text-lg font-semibold">
          {/* Delete {server.name} */}
          {t('server.list.deleteServer', { serverName: server.name })}
        </div>

        <div className="text-tertiary pb-3 pt-3 text-sm">
          {t('server.list.confirm')}
        </div>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            className="form-input-password"
            placeholder={t('auth.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
          />
          <ShowPasswordButton
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>
      </div>
    </StyledDialog>
  )
}
