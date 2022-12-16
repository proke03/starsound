import Dialog from '@/components/ui/dialog/Dialog'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MessageVideoDialog({
  video,
  width,
  height,
  rounded = true
}) {
  const { t } = useTranslation()
  const [showImagePopup, setShowImagePopup] = useState(false)

  return (
    <div>
      <video
        // onClick={() => setShowImagePopup(true)}
        controls
        src={video.videoUrl}
        alt=""
        className={`h-[300px] ${rounded ? 'rounded' : ''} cursor-pointer max-w-full`}
      />

      <Dialog
        closeOnOverlayClick
        close={() => setShowImagePopup(false)}
        isOpen={showImagePopup}
      >
        <div className="mx-auto">
          <div className="text-left">
            <video
              onClick={e => e.stopPropagation()}
              src={video.videoUrl?? ''}
              alt=""
              // width={video.popupWidth}
              // height={video.popupHeight}
            />
            <div className="pt-1">
              <a
                // href={video.originalUrl}
                className="hover:underline cursor-pointer text-mid font-semibold text-13 focus:outline-none"
                target="_blank"
                rel="noreferrer noopener"
                onClick={e => e.stopPropagation()}
              >
                {t('message.openOriginal')}
              </a>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
