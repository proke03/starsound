import { useCallback, useEffect, useState } from 'react'
import { useDataUrl } from '@/hooks/useDataUrl'
import Dialog from '@/components/ui/dialog/Dialog'
import DialogTitle from '@/components/ui/dialog/DialogTitle'
import { IconSpinner } from '@/components/ui/icons/IconSpinner'
import ctl from '@netlify/classnames-template-literals'
import { useFileIcon } from '@/hooks/useFileIcon'
import { useTranslation } from 'react-i18next'

const cancelBtnClass = ctl(`
  text-sm
  text-primary
  h-10
  px-7
  hover:underline
  focus:outline-none
  select-none
  disabled:opacity-50
  disabled:no-underline
  disabled:cursor-not-allowed
`)

const uploadBtnClass = ctl(`
  text-sm
  // text-primary
  text-gray-900 
  dark:text-gray-100
  transition
  // bg-blue-500
  bg-green-600
  hover:bg-green-700
  // hover:bg-blue-600
  flex
  items-center
  justify-center
  rounded
  px-7
  h-10
  focus:outline-none
  select-none
  disabled:opacity-50
  disabled:cursor-not-allowed
`)

export default function MessageUploadDialog({
  createMessage,
  variables,
  file,
  setFileIndex,
  placeholder,
  multiple,
  cancelAll
}) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const imgSrc = useDataUrl(file)
  const [sending, setSending] = useState(false)

  const close = useCallback(() => {
    if (sending) return
    setFileIndex(prev => prev + 1)
  }, [setFileIndex, sending])

  const send = useCallback(() => {
    setSending(true)
    createMessage({
      variables: { input: { text: text ? text : null, file, ...variables } }
    }).then(() => {
      setSending(false)
      close()
    })
  }, [close, text, file, variables, createMessage])

  useEffect(() => setText(''), [file])

  const enterPressed = useCallback(
    e => {
      if (e.key === 'Enter' && !!file) {
        send()
      }
    },
    [send, file]
  )

  useEffect(() => {
    document.body.addEventListener('keydown', enterPressed)
    return () => {
      document.body.removeEventListener('keydown', enterPressed)
    }
  }, [enterPressed])

  const FileIcon = useFileIcon(file?.type)

  return (
    <Dialog close={close} isOpen={!!file}>
      <div className="text-left relative w-full rounded-xl bg-white dark:bg-gray-750 max-w-lg mx-auto">
        {/* <div className="absolute left-5 -top-20 flex w-46 h-40"> */}
        {/* <div className="absolute left-5 -top-20 flex w-46 h-40"> */}
        <div className="px-5 pt-5 flex w-46 h-40">
          {imgSrc && (
            <img
              alt=""
              src={imgSrc}
              // className="absolute max-w-full max-h-full bottom-0 left-0 rounded shadow-md object-cover"
              className="max-w-full max-h-full rounded shadow-md object-cover"
            />
          )}

          {!imgSrc && FileIcon && (
            // <FileIcon className="h-full w-full text-white absolute bottom-0 left-0 transform -translate-x-8" />
            <FileIcon className="w-full h-full rounded shadow-md object-cover" />
          )}
        </div>

        {/* <div className="px-5 pt-24 pb-5"> */}
        <div className="px-5 pt-5 pb-5">
          <DialogTitle className="truncate text-left text-xl text-primary font-semibold select-none">
            {file?.name ?? ''}
          </DialogTitle>

          <div className="text-tertiary text-13 pb-5 pt-0.5 select-none">
            {t('message.upload.to')}{' '}
            <span className="font-medium text-secondary">{placeholder}</span>
          </div>

          <label
            htmlFor="comment"
            className="block uppercase text-xs font-medium text-secondary pb-1.5"
          >
            {t('message.upload.comment')} <span className="text-tertiary">(Optional)</span>
          </label>
          <input
            className="h-10 rounded-lg dark:bg-gray-700 w-full focus:outline-none px-4 text-secondary text-base"
            id="comment"
            value={text}
            onChange={e => {
              const val = e.target.value
              setText(val)
            }}
          />
        </div>

        <div className="flex p-4 dark:bg-gray-775 rounded-b-xl">
          <div className="ml-auto" />
          {multiple && (
            <button
              className={cancelBtnClass}
              onClick={() => {
                cancelAll()
              }}
              disabled={sending}
            >
              {t('message.upload.cancelAll')}
            </button>
          )}

          <button className={cancelBtnClass} onClick={close} disabled={sending}>
            {t('message.upload.cancel')}
          </button>
          <button
            className={uploadBtnClass}
            disabled={!file || sending}
            onClick={send}
          >
            {t('message.upload.upload')}
            {sending && (
              <div className="ml-3">
                <IconSpinner />
              </div>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
