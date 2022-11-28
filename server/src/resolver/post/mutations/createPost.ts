import { Field, ID, InputType, Publisher } from 'type-graphql'
import { ArrayMaxSize, Length, MaxLength, IsUrl } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { Context } from '@/types'
import {
  Post,
  PostImage,
  PostVote,
  Server,
  User,
  VoteType
} from '@/entity'
import {
  handleText,
  imageMimeTypes, logger,
  scrapeMetadata,
  uploadImageFile,
} from '@/util'
import { ChangePayload, ChangeType } from '@/resolver/subscriptions'
import mime from 'mime'
import { policy } from '@/policy'

@InputType()
export class CreatePostInput {
  @Field()
  @Length(
    policy.post.titleMinLength, 
    policy.post.titleMaxLength, 
    { message: 'Title must be no longer than 300 characters.' }
  )
  title: string

  @Field({ nullable: true })
  @MaxLength(policy.post.linkLength, { message: 'URL must be no longer than 2000 characters.' })
  @IsUrl()
  linkUrl?: string

  @Field({ nullable: true })
  @MaxLength(policy.post.textLength, {
    message: `Text max length is ${policy.post.textLength} characters`
  })
  text?: string

  @Field(() => ID)
  serverId: string

  @Field(() => [CreatePostImagesInput], { nullable: true })
  @ArrayMaxSize(
    policy.post.imagesLength, 
    { message: `Cannot upload more than ${policy.post.imagesLength} images` }
  )
  images?: CreatePostImagesInput[]
}

@InputType()
class CreatePostImagesInput {
  @Field(() => GraphQLUpload)
  file: FileUpload

  @Field({ nullable: true })
  @MaxLength(policy.post.captionLength)
  caption?: string

  @Field({ nullable: true })
  @MaxLength(policy.post.linkLength)
  @IsUrl()
  linkUrl?: string
}

//TODO: check invalid url
export async function createPost(
  { em, userId }: Context,
  { title, linkUrl, text, serverId, images }: CreatePostInput,
  notifyPostChanged: Publisher<ChangePayload>
): Promise<Post> {
  logger('createPost')
  // console.log('createPost', title, linkUrl, text, serverId, images, isURL(linkUrl))
  // if(linkUrl && !isURL(linkUrl)){
  //   throw new Error('Invalid URL!')
  // }

  if (text) {
    text = handleText(text)
    if (!text) text = null
  }

  const server = await em.findOneOrFail(Server, serverId, { isDeleted: false })
  const user = await em.findOneOrFail(User, userId)
  await user.checkBannedFromServer(em, server.id)

  const postImages: PostImage[] = []

  if (images && images.length > 0) {
    for (const image of images) {
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
  }

  const post = em.create(Post, {
    title,
    linkUrl,
    author: user,
    server,
    linkMetadata: linkUrl ? await scrapeMetadata(linkUrl) : null,
    images: postImages,
    text: text,
    voteCount: 1
  })
  post.voteType = VoteType.Up
  const vote = em.create(PostVote, { post, user, type: VoteType.Up })
  await em.persistAndFlush([post, vote])
  await notifyPostChanged({ id: post.id, type: ChangeType.Added })
  return post
}
