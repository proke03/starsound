import ExploreSidebar from '@/pages/explore/ExploreSidebar'
import ServerInfoCard from '@/components/server/ServerInfoCard'
import { useStore } from '@/hooks/useStore'
import Page from '@/components/ui/page/Page'
import PageView from '@/components/ui/page/PageView'
import { usePublicServersQuery } from '@/graphql/hooks'
import EndReached from '@/components/ui/EndReached'
import { Helmet } from 'react-helmet-async'
import Header from "@/components/ui/header/Header"
import {IconExplore} from "@/components/ui/icons/Icons"
import { useTranslation } from 'react-i18next'

export default function ExplorePage() {
  const { t } = useTranslation()

  const [exploreCategory, exploreSort] = useStore(s => [
    s.exploreCategory,
    s.exploreSort
  ])

  const { data, loading } = usePublicServersQuery({
    variables: {
      sort: exploreSort,
      category:
        exploreCategory && exploreCategory !== 'Featured'
          ? exploreCategory
          : null,
      featured: exploreCategory === 'Featured'
    },
    fetchPolicy: 'cache-and-network'
    //nextFetchPolicy: 'cache-first'
  })
  const servers = data?.publicServers ?? []

  return (
    <Page leftSidebar={<ExploreSidebar />} header={<Header title={t('explore.title')} icon={<IconExplore className="w-5 h-5" />} />}>
      <Helmet>
        <title>{t('explore.helmetTitle')}</title>
      </Helmet>
      <PageView>
        <div className="md:px-8 md:py-8 px-0 py-0">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
            {servers.map(server => (
              <ServerInfoCard server={server} key={server.id} />
            ))}
          </div>
          {!servers.length && !loading? <EndReached>{t('user.noMutualPlanets')}</EndReached> : <></>}
        </div>
      </PageView>
    </Page>
  )
}
