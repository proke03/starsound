import { nanoid } from 'nanoid'
import mime from 'mime'
import sharp, { ResizeOptions } from 'sharp'
import r2 from '@/config/s3.config'
import { FileUpload } from 'graphql-upload'
import got from 'got'
import FileType from 'file-type'
import { File, Image } from '@/entity'
import { Readable } from 'stream'
import { getImageName } from '../text'

const Bucket = process.env.R2_BUCKET
export const imageMimeTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp'
]

export const videoMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/x-msvideo',
  'video/webm'
]

const genKey = (ext: string) => `${nanoid()}.${ext}`

const initSharp = () => sharp({ pages: -1 }).webp({ quality: 80 })

// for messages
export const uploadFileOrImage = async (
  file: FileUpload
): Promise<File | Image> => {
  const { createReadStream, mimetype, filename } = await file
  const ext = mime.getExtension(mimetype)
  if (imageMimeTypes.includes(mimetype)) {
    return uploadImageFile(createReadStream, ext)
  } else {
    const stream = createReadStream()
    let size = 0
    stream.on('data', (data: Buffer) => {
      size += data.byteLength
    })

    return {
      url: await s3upload(ext, stream, mimetype, `${nanoid()}/${filename}`),
      mime: mimetype,
      filename,
      size
    } as File
  }
}

export const uploadImageUrl = async (linkUrl: string): Promise<Image> => {
  const createStream = () => got.stream(linkUrl)
  const fileType = await FileType.fromStream(createStream())
  if (!imageMimeTypes.includes(fileType.mime))
    throw new Error('error.upload.invalidMime')
  const ext = fileType.ext
  return uploadImageFile(createStream, ext)
}

// for posts
export const uploadImageFile = async (
  createStream: () => any,
  ext: string
): Promise<Image> => {
  const originalSharp = initSharp()
  const originalBody = createStream().pipe(originalSharp)
  const metadata = await originalSharp.metadata()
  const pages = metadata.pages
  const originalWidth = metadata.width
  let originalHeight = metadata.height
  if (metadata.pageHeight && pages) originalHeight = metadata.pageHeight

  const originalUrl = await s3upload(ext, originalBody, 'image/webp')

  const image = {
    originalUrl,
    originalWidth,
    originalHeight
  } as Image

  if (pages) {
    return {
      ...image,
      smallUrl: originalUrl,
      popupUrl: originalUrl
    } as Image
  } else {
    const fit = 'inside'
    const smallBody = createStream().pipe(
      initSharp().resize({
        fit,
        width: image.smallWidth,
        height: image.smallHeight
      })
    )
    const popupBody = createStream().pipe(
      initSharp().resize({
        fit,
        width: image.popupWidth,
        height: image.popupHeight
      })
    )
    return {
      ...image,
      smallUrl: await s3upload(ext, smallBody, 'image/webp'),
      popupUrl: await s3upload(ext, popupBody, 'image/webp')
    } as Image
  }
}

export const uploadImageFileSingle = async (
  file: FileUpload,
  resize: ResizeOptions | null = null,
  allowGif: boolean = false,
  imageUrl?: string
): Promise<string> => {
  if(!file) return
  const { createReadStream, mimetype } = await file
  if (!imageMimeTypes.includes(mimetype))
    throw new Error('error.upload.invalidMime')
  let body: Readable = createReadStream()
  const ext = mime.getExtension(mimetype)
  const s = initSharp()
  body = body.pipe(s)
  const { pages } = await s.metadata()
  if (resize && (!pages || !allowGif)) {
    s.resize(resize)
  }
  
  if(imageUrl){
    return s3upload(ext, body, 'image/webp', getImageName(imageUrl)) 
  }
  else {
    return s3upload(ext, body, 'image/webp')
  }
}

export const uploadVideoFileSingle = async (
  file: FileUpload,
  videoUrl?: string
): Promise<string> => {
  if(!file) return
  const { createReadStream, mimetype } = await file
  if (!videoMimeTypes.includes(mimetype))
    throw new Error('error.upload.invalidMime')
  let body: Readable = createReadStream()
  const ext = mime.getExtension(mimetype)
  
  if(videoUrl){
    return s3upload(ext, body, `video/${ext}`, getImageName(videoUrl)) 
  }
  else {
    return s3upload(ext, body, `video/${ext}`)
  }
}

const s3upload = (
  ext: string,
  body: Readable,
  contentType: string,
  customKey?: string
): Promise<string> => {
  const key = genKey(ext)
  const upload = r2.upload({
    Bucket,
    Key: customKey ? customKey : key,
    Body: body,
    ContentType: contentType,
    ACL: 'private',
    CacheControl: 'max-age=2592000'
  })

  try {
    return new Promise<string>((resolve, reject) => {
      upload.send(async err => {
        if (err) {
          reject(err)
        }

        resolve(
          // await r2.getSignedUrlPromise('getObject', { Bucket: process.env.R2_BUCKET, Key: `${customKey?? key}`, Expires: 3600 })
          `${process.env.R2_PUBLIC_URL}${customKey?? key}`
        )
      })
    })
  } catch (e) {
    throw e
  }
}