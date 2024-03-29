import { useStore } from '@/hooks/useStore'
import InboxHeader from '@/pages/inbox/InboxHeader'
import { useSetHomePage } from '@/hooks/useSetHomePage'
import Page from '@/components/ui/page/Page'
import PageView from '@/components/ui/page/PageView'
import { useRepliesQuery } from '@/graphql/hooks'
import { useCurrentUser } from '@/hooks/graphql/useCurrentUser'
import Reply from '@/components/reply/Reply'
import EndReached from '@/components/ui/EndReached'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next';

const label =
  'px-2 pb-2 text-11 text-tertiary uppercase tracking-widest font-semibold'

export default function InboxPage() {
  const { t } = useTranslation()
  const inboxPage = useStore(s => s.inboxPage)
  useSetHomePage(`inbox`)
  const [currentUser] = useCurrentUser()
  const { data, loading } = useRepliesQuery({
    skip: !currentUser,
    fetchPolicy: 'cache-and-network'
  })
  const replies = (data?.replies ?? []).filter(r => inboxPage === 'Unread' ? !r.isRead : true)
  return (
    <Page header={<InboxHeader />}>
      <Helmet>
        <title>{`(${replies.length}) Inbox – Starsound`}</title>
      </Helmet>

      <PageView>
        {inboxPage === 'Unread' && (
          <>
            <div className={label}>{t('inbox.tab.unread')} - {replies.length}</div>
          </>
        )}
        {inboxPage === 'All' && (
          <>
            <div className={label}>{t('inbox.tab.all')} - {replies.length}</div>
          </>
        )}

        {replies.length === 0 && (
          <EndReached>{t('inbox.noMessagesToRead')}</EndReached>
        )}

        <div className="space-y-1.5">
          {replies.map(reply => (
            !loading ? <Reply reply={reply} key={reply.id} /> : <></>
          ))}
        </div>
      </PageView>
    </Page>
  )
}
