import ctl from '@netlify/classnames-template-literals'
import { useMemo } from 'react'
import { useDropZone } from '@/hooks/useDropZone'
import {
  IconFileCode,
  IconFileImage,
  IconFileVideo
} from '@/components/ui/icons/Icons'
import { useTranslation } from 'react-i18next'

export default function PostDropZone({ channel, user, group, setFiles, forImages }) {
  const { t } = useTranslation()
  const [files, isDragging] = useDropZone()

  const name = useMemo(() => {
    if (channel) return `#${channel.name}`
    else if (user) return `@${user.username}`
    else if (group) return `${group.displayName}`
  }, [channel, user, group])

  return (
    <>
      <div className="relative">
        <input
          type="file"
          multiple
          id="input-file"
          className="hidden"
          accept={
            forImages? 
            "image/png, image/jpeg, image/webp, image/gif" 
            :
            "video/mp4, video/mpeg, video/x-msvideo, video/webm"
          }
          onChange={e => {
            setFiles(e.target.files)
          }}
        />
        <label
          htmlFor="input-file"
          className="pl-2 sm:pl-0 select-none cursor-pointer flex items-center justify-center text-base text-tertiary h-30 border border-dashed dark:border-gray-700 rounded-md transition dark:hover:bg-gray-775"
        >
          {t('post.create.imageDrop')}
        </label>
      </div>
    </>
  )
}
