import { IconFolder } from '@/components/ui/icons/Icons'
import ShowFoldersButton from '@/components/ui/header/buttons/ShowFoldersButton'
import Header from '@/components/ui/header/Header'
import HeaderTab from '@/components/ui/header/HeaderTab'
import { useStore } from '@/hooks/useStore'
import { useTranslation } from 'react-i18next'

export default function FolderHeader({ folder }) {
  const { t } = useTranslation()
  return (
    <Header
      showDivider
      title={folder?.name}
      icon={<IconFolder className="w-5 h-5" />}
    >
      <div className="flex items-center space-x-4">
        <Tab page="Added">{t('folder.sort.added')}</Tab>
        <Tab page="Top">{t('folder.sort.top')}</Tab>
        <Tab page="New">{t('folder.sort.new')}</Tab>
      </div>
      <div className="ml-auto">
        <ShowFoldersButton />
      </div>
    </Header>
  )
}

function Tab({ page, children }) {
  const [folderSort, setFolderSort] = useStore(s => [
    s.folderSort,
    s.setFolderSort
  ])
  return (
    <HeaderTab
      page={page}
      currentPage={folderSort}
      setCurrentPage={setFolderSort}
    >
      {children}
    </HeaderTab>
  )
}
