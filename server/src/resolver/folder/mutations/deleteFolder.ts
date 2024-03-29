import { Field, ID, InputType } from 'type-graphql'
import { Context } from '@/types'
import { Folder, ServerPermission, User, UserFolder } from '@/entity'
import {deleteImageFileSingle, logger} from "@/util";

@InputType()
export class DeleteFolderInput {
  @Field(() => ID)
  folderId: string
}

export async function deleteFolder(
  { em, userId, liveQueryStore }: Context,
  { folderId }: DeleteFolderInput
): Promise<boolean> {
  logger('deleteFolder')
  const user = await em.findOneOrFail(User, userId)
  const folder = await em.findOneOrFail(Folder, folderId, ['owner', 'server'])
  if (folder.isDeleted) throw new Error('error.folder.alreadyDeleted')
  if (folder.owner && folder.owner !== user)
    throw new Error('error.folder.notOwner')
  else if (folder.server)
    await user.checkServerPermission(
      em,
      folder.server.id,
      ServerPermission.ManageFolders
    )
  folder.isDeleted = true
  deleteImageFileSingle(folder.avatarUrl)
  if (folder.owner === user) {
    const userFolder = await em.findOne(UserFolder, { user, folder })
    em.remove(userFolder)
  }
  await em.persistAndFlush(folder)
  liveQueryStore.invalidate(`Folder:${folderId}`)
  return true
}
