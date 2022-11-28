import { Field, ID, InputType, Publisher } from 'type-graphql'
import { ArrayMaxSize, IsUrl, Length, MaxLength } from 'class-validator'
import { Context } from '@/types'
import { ChangePayload, ChangeType } from '@/resolver/subscriptions'
import { Image, Post, PostImage, Server, User } from '@/entity'
import { 
  handleText, 
  imageMimeTypes, 
  logger,
  scrapeMetadata,
  uploadImageFile,
} from '@/util'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import mime from 'mime'
import { policy } from '@/policy'

@InputType()
class UpdatePostImagesInput {
  @Field(() => GraphQLUpload, { nullable: true })
  file?: FileUpload

  @Field({ nullable: true })
  originalUrl?: string

  @Field({ nullable: true })
  originalWidth?: number

  @Field({ nullable: true })
  originalHeight?: number

  @Field({ nullable: true })
  popupUrl?: string

  @Field({ nullable: true })
  popupWidth?: number

  @Field({ nullable: true })
  popupHeight?: number

  @Field({ nullable: true })
  smallUrl?: string

  @Field({ nullable: true })
  smallWidth?: number

  @Field({ nullable: true })
  smallHeight?: number

  @Field({ nullable: true })
  @MaxLength(policy.post.captionLength)
  caption?: string

  @Field({ nullable: true })
  @MaxLength(policy.post.linkLength)
  @IsUrl()
  linkUrl?: string
}

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  postId: string

  @Field()
  @Length(
    policy.post.titleMinLength, 
    policy.post.titleMaxLength, 
    { message: `Title must be no longer than ${policy.post.titleMaxLength} characters.` }
  )
  title: string

  @Field({ nullable: true })
  @MaxLength(
    policy.post.linkLength, 
    { message: `URL must be no longer than ${policy.post.linkLength} characters.` }
  )
  @IsUrl()
  linkUrl?: string

  @Field({ nullable: true })
  @Field()
  @MaxLength(policy.post.textLength)
  text?: string

  @Field(() => [UpdatePostImagesInput], { nullable: true })
  @ArrayMaxSize(
    policy.post.imagesLength, 
    { message: `Cannot upload more than ${policy.post.imagesLength} images` }
  )
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
      console.log(image);
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
        post.images.forEach(_image => {
          if(_image.image.originalUrl === image.originalUrl){
            postImages.push({
              image: {
                originalUrl: image.originalUrl,
                originalWidth: _image.image.originalWidth,
                originalHeight: _image.image.originalHeight,
                popupUrl: image.popupUrl,
                smallUrl: image.smallUrl,
              } as Image,
              linkUrl: image.linkUrl,
              caption: image.caption
            })
          }
        })
      }
    }
  }
  post.images = postImages

  await em.persistAndFlush(post)
  await notifyPostChanged({ id: postId, type: ChangeType.Updated })
  return post
}
