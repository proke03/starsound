import { useCallback } from 'react'
import { usePinPostMutation, useUnpinPostMutation } from '@/graphql/hooks'

export const useTogglePostPin = post => {
  const [pin] = usePinPostMutation()
  const [unpin] = useUnpinPostMutation()

  return useCallback(() => {
    const input = { postId: post.id }
    if (post.isPinned) unpin({ variables: { input } }).then(() => {
      location.reload()
    })
    else pin({ variables: { input } }).then(() => {
      location.reload()
    })
  }, [post, pin, unpin])
}
