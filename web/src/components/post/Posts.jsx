import { Virtuoso } from 'react-virtuoso'
import { usePosts } from '@/components/post/usePosts'
import Post from '@/components/post/Post'
import { IconSpinner } from '@/components/ui/icons/IconSpinner'
import { useCallback, useRef } from 'react'
import EndReached from '@/components/ui/EndReached'
import { useTranslation } from 'react-i18next'
import { usePinnedPostsQuery } from '@/graphql/hooks'

export default function Posts({ folderId, serverId, showServerName, header }) {
  const { t } = useTranslation();
  
  const virtuoso = useRef(null)

  const [posts, fetching, fetchMore, hasMore] = usePosts({ folderId, serverId })

  const postRenderer = useCallback(
    (postsList, index) => {
      const post = postsList[index]
      if (!post) return <div style={{ height: '1px' }} /> // returning null or zero height breaks the virtuoso
      return (
        <div className="md:px-4 pb-1.5 px-0">
          <Post post={post} showServerName={showServerName} index={index} />
        </div>
      )
    },
    [showServerName]
  )

  //FIXME: 400 error in main page. 각 페이지에 분리해야 하나?
  const { data: pinnedPosts, loading } = usePinnedPostsQuery({ 
    variables: {serverId: serverId},
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first', 
  })

  return (
    <>
      <Virtuoso
        className="scrollbar-custom dark:bg-gray-750 bg-gray-100"
        components={{
          Header: header ? () => 
          <>  
          {header}
          {
            pinnedPosts?.pinnedPosts?.length > 0 &&
              pinnedPosts.pinnedPosts.map((post, index) => {
                return (
                  <div className="md:px-4 pb-1.5 px-0">
                    <Post 
                      post={post} 
                      showServerName={showServerName} 
                      index={index}
                      showPin={true}
                    />
                  </div>
                )
            })
          }
          </> : null,
          Footer: () =>
            hasMore ? (
              <div className="flex items-center justify-center h-20">
                <IconSpinner />
              </div>
            ) : (
              <EndReached>{t('post.noMorePosts')}</EndReached>
            )
        }}
        endReached={() => {
          if (!fetching && hasMore) {
            fetchMore()
          }
        }}
        itemContent={i => postRenderer([...posts], i)}
        overscan={100}
        ref={virtuoso}
        style={{ overflowX: 'hidden' }}
        totalCount={posts?.length || 0}
      />
    </>
  )
}
