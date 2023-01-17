import { useLayoutEffect, useState } from 'react'
import ctl from '@netlify/classnames-template-literals'
import Editor from '@/components/ui/editor/Editor'
import { IconSpinner } from '@/components/ui/icons/Icons'
import { useTranslation } from 'react-i18next'
import {
  CommentsDocument,
  CurrentUserDocument,
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from '@/graphql/hooks'

const commentBtnClass = ctl(`
  text-base
  text-primary
  disabled:opacity-50
  dark:disabled:bg-gray-600
  bg-green-600
  rounded
  px-3
  h-8
  flex
  items-center
  disabled:cursor-not-allowed
  focus:outline-none
`)

const cancelBtnClass = ctl(`
  text-base
  text-tertiary
  focus:outline-none
  px-2
  h-8
  flex
  items-center
`)

export default function CommentEditor({ postId, parentCommentId, setOpen, target }) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [createComment, { loading }] = useCreateCommentMutation({
    update(cache, { data: { createComment } }) {
      const data = cache.readQuery({
        query: CommentsDocument,
        variables: { postId }
      })
      cache.writeQuery({
        query: CommentsDocument,
        variables: { postId },
        data: {
          comments: [createComment, ...data.comments]
        }
      })
    }
  })

  const [updateComment, { loading: updateLoading }] = useUpdateCommentMutation()

  return (
    <div className="w-full break-words overflow-hidden">
      <Editor text={text} setText={setText} target={target}/>
      <div className="flex justify-end space-x-3 items-center pt-3">
        <button
          className={cancelBtnClass}
          onClick={() => {
            setOpen(false)
            setText('')
          }}
        >
          {t('comment.create.cancel')}
        </button>
        <button
          className={commentBtnClass}
          disabled={!text || loading}
          onClick={() => {
            if(!target){
              createComment({
                variables: { input: { postId, text, parentCommentId } }
              }).then(() => {
                setOpen(false)
                setText('')
              })
            }
            else{
              updateComment({
                variables: { input: { commentId: target.id, text } }
              }).then(() => {
                setOpen(false)
                setText('')
              })
            }
          }}
        >
          {t('comment.create.submit')}
          {loading && <IconSpinner className="w-5 h-5 text-primary ml-3" />}
        </button>
      </div>
    </div>
  )
}
