import { Field, ID, InputType, Publisher } from 'type-graphql'
import { ArrayMaxSize, IsUrl, Length, MaxLength } from 'class-validator'
import { Context } from '@/types'
import { ChangePayload, ChangeType } from '@/resolver/subscriptions'
import { Post, PostImage, Server, User } from '@/entity'
import { 
  handleText, 
  imageMimeTypes, 
  logger,
  scrapeMetadata,
  uploadImageFile,
} from '@/util'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import mime from 'mime'
@InputType()
class UpdatePostImagesInput {
  @Field(() => GraphQLUpload)
  file?: FileUpload

  @Field()
  originalUrl?: string

  @Field()
  originalWidth?: number

  @Field()
  originalHeight?: number

  @Field()
  popupUrl?: string

  @Field()
  popupWidth?: number

  @Field()
  popupHeight?: number

  @Field()
  smallUrl?: string

  @Field()
  smallWidth?: number

  @Field()
  smallHeight?: number

  @Field({ nullable: true })
  @MaxLength(180)
  caption?: string

  @Field({ nullable: true })
  @MaxLength(2000)
  @IsUrl()
  linkUrl?: string
}

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  postId: string

  @Field()
  @Length(1, 300, { message: 'Title must be no longer than 300 characters.' })
  title: string

  @Field({ nullable: true })
  @MaxLength(2000, { message: 'URL must be no longer than 2000 characters.' })
  @IsUrl()
  linkUrl?: string

  @Field()
  @Length(1, 100000)
  text: string

  @Field(() => [UpdatePostImagesInput], { nullable: true })
  @ArrayMaxSize(20, { message: 'Cannot upload more than 20 images' })
  images?: UpdatePostImagesInput[]
}

export async function updatePost(
  { em, userId }: Context,
  { 
    postId,
    title,
    linkUrl,
    text,
    images,
  }: UpdatePostInput,
  notifyPostChanged: Publisher<ChangePayload>
): Promise<Post> {
  logger('updatePost')
  console.log('updatePost', postId, title, linkUrl, text, images)
  const post = await em.findOneOrFail(Post, postId, ['author'])
  console.log('post', post)
  
  const server = await em.findOneOrFail(Server, post.server.id, { isDeleted: false })
  const user = await em.findOneOrFail(User, userId)
  await user.checkBannedFromServer(em, server.id)

  if (post.author !== em.getReference(User, userId))
    throw new Error('Must be post author to edit')

  post.title = title

  // post.text = handleText(text)
  if (text) {
    text = handleText(text)
    if (!text) text = null

    post.text = text
  }

  if(linkUrl){
    post.linkUrl = linkUrl
    post.linkMetadata = await scrapeMetadata(linkUrl)?? null
  }

  const postImages: PostImage[] = []
  
  if (images && images.length > 0) {
    for (const image of images) {
      if(image.file){
        const { createReadStream, mimetype } = await image.file
        const ext = mime.getExtension(mimetype)
        if (!imageMimeTypes.includes(mimetype))
          throw new Error('Files must be images')
        const i = await uploadImageFile(createReadStream, ext)
        postImages.push({
          image: i,
          linkUrl: image.linkUrl,
          caption: image.caption
        })
      }
      else{
        postImages.push({
          image: {
            originalUrl: image.originalUrl,
            originalWidth: image.originalWidth,
            originalHeight: image.originalHeight,
            popupUrl: image.popupUrl,
            popupWidth: image.popupWidth,
            popupHeight: image.popupHeight,
            smallUrl: image.smallUrl,
            smallWidth: image.smallWidth,
            smallHeight: image.smallHeight,
          },
          linkUrl: image.linkUrl,
          caption: image.caption
        })
      }
    }
  }
  post.images = postImages

  await em.persistAndFlush(post)
  await notifyPostChanged({ id: postId, type: ChangeType.Updated })
  return post
}
