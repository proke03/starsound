import { lazy, Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import Routes from '@/pages/Routes'
import { ApolloProvider } from '@apollo/client/react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import TitleBar from '@/components/ui/electron/titlebar/TitleBar'
import { getOS } from '@/utils/getOS'
import { apolloClient } from '@/graphql/apolloClient'
import ContextMenuProvider from '@/providers/ContextMenuProvider'
import UserProvider from '@/providers/UserProvider'

export default function App() {
  const isMac = getOS() === 'Mac OS'
  const Router = window.electron ? HashRouter : BrowserRouter

  const ResponsiveToaster = lazy(() => import('@/components/ui/ResponsiveToaster'))
  const CustomDragLayer = lazy(() => import('@/components/ui/CustomDragLayer'))
  const LoginDialog = lazy(() => import('@/components/LoginDialog'))
  const FindPasswordDialog = lazy(() => import('@/components/FindPasswordDialog'))
  const UserDialog = lazy(() => import('@/components/user/UserDialog'))

  return (
    <ApolloProvider client={apolloClient}>
      <HelmetProvider>
        <Helmet>
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/logos/logo_icon.svg" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>별별소리</title>
        </Helmet>

        <UserProvider>
          <Router>
            <ContextMenuProvider>
              <DndProvider
                backend={TouchBackend}
                options={{ enableTouchEvents: false, enableMouseEvents: true }}
              >
                <Suspense fallback={<></>}><ResponsiveToaster /></Suspense>
                <Suspense fallback={<></>}><CustomDragLayer /></Suspense>
                <Suspense fallback={<></>}><LoginDialog /></Suspense>
                {window.electron && !isMac && <TitleBar />}
                <Suspense fallback={<></>}><FindPasswordDialog /></Suspense>
                <Suspense fallback={<></>}><UserDialog /></Suspense>
                <div
                  style={
                    window.electron
                      ? { height: isMac ? '100%' : 'calc(100% - 1.375rem)' }
                      : { height: '100%' }
                  }
                  className="flex"
                >
                  <Routes />
                </div>
              </DndProvider>
            </ContextMenuProvider>
          </Router>
        </UserProvider>
      </HelmetProvider>
    </ApolloProvider>
  )
}
