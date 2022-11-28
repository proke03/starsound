import { Field, ID, InputType } from 'type-graphql'
import { Length } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import {
  Folder,
  FolderVisibility,
  ServerPermission,
  User,
  UserFolder
} from '@/entity'
import { Context } from '@/types'
import {logger, uploadImageFileSingle} from '@/util'
import { policy } from '@/policy'

@InputType()
export class UpdateFolderInput {
  @Field(() => ID)
  folderId: string

  @Field({ nullable: true })
  @Length(policy.folder.nameMinLength, policy.folder.nameMaxLength)
  name?: string

  @Field(() => GraphQLUpload, { nullable: true })
  avatarFile?: FileUpload

  @Field({ nullable: true })
  isCollaborative?: boolean

  @Field(() => FolderVisibility, { nullable: true })
  visibility?: FolderVisibility
}

export async function updateFolder(
  { em, userId, liveQueryStore }: Context,
  { folderId, name, avatarFile, isCollaborative, visibility }: UpdateFolderInput
): Promise<Folder> {
  logger('updateFolder')
  const user = await em.findOneOrFail(User, userId)
  const folder = await em.findOneOrFail(Folder, folderId, ['owner', 'server'])

  if (folder.server) {
    if (isCollaborative || visibility)
      throw new Error(
        'Cannot change collaborative or visibility on server folders'
      )
    await user.checkServerPermission(
      em,
      folder.server.id,
      ServerPermission.ManageFolders
    )
  } else if (folder.owner) {
    if (folder.owner !== user)
      throw new Error('You must be the owner to edit this folder')
  }

  em.assign(folder, {
    name: name ?? folder.name,
    isCollaborative: isCollaborative ?? folder.isCollaborative,
    visibility: visibility ?? folder.visibility,
    avatarUrl: await uploadImageFileSingle(avatarFile, { width: 256, height: 256 }, false, folder.avatarUrl?? undefined)
  })

  await em.persistAndFlush(folder)
  liveQueryStore.invalidate(`Folder:${folderId}`)
  return folder
}
