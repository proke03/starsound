import { EntityManager } from '@mikro-orm/postgresql'
import {
  Channel,
  Folder,
  Message,
  MessageType,
  Role,
  Server,
  ServerCategory,
  ServerFolder,
  ServerUser,
  User,
  UserFolder
} from '@/entity'
import { ReorderUtils } from '@/util'
import * as argon2 from 'argon2'

/**
 * @param em EntityManager
 * @description Seed the database with some data
 */
export async function seed(em: EntityManager) {
  let seedServer = await em.findOne(Server, { name: process.env.SEED_SERVER_NAME })
  if (!seedServer) {
    const seedUser = em.create(User, {
      username: process.env.SEED_USER_NAME,
      isAdmin: true,
      //FIXME: 교체
      // avatarUrl: process.env.SEED_USER_AVATAR_URL,
      passwordHash: await argon2.hash(
        process.env.SEED_USER_PASSWORD || 'password'
      )
    })

    seedServer = em.create(Server, {
      name: process.env.SEED_SERVER_NAME,
      displayName: process.env.SEED_SERVER_DISPLAYNAME,
      description: process.env.SEED_SERVER_DESCRIPTION,
      category: ServerCategory.Meta,
      // avatarUrl: process.env.SEED_SERVER_AVATAR_URL,
      // bannerUrl: process.env.SEED_SERVER_BANNER_URL,
      isFeatured: true,
      featuredPosition: ReorderUtils.FIRST_POSITION,
      owner: seedUser
    })
    const defaultRole = em.create(Role, {
      name: 'Default',
      server: seedServer,
      isDefault: true
    })
    const starsoundServerUser = em.create(ServerUser, {
      server: seedServer,
      user: seedUser,
      role: defaultRole
    })

    const generalChannel = em.create(Channel, {
      name: 'general',
      server: seedServer,
      isDefault: true
    })
    const initialMessage = em.create(Message, {
      channel: generalChannel,
      type: MessageType.Initial,
      author: seedUser
    })

    const announcementsFolder = em.create(Folder, {
      name: 'Announcements',
      server: seedServer
    })
    const announcementsServerFolder = em.create(ServerFolder, {
      server: seedServer,
      folder: announcementsFolder
    })

    const readLaterFolder = em.create(Folder, {
      name: 'Read Later',
      owner: seedUser
    })
    const favoritesFolder = em.create(Folder, {
      name: 'Favorites',
      owner: seedUser
    })
    const readLaterUserFolder = em.create(UserFolder, {
      user: seedUser,
      folder: readLaterFolder,
      position: ReorderUtils.positionAfter(ReorderUtils.FIRST_POSITION)
    })
    const favoritesUserFolder = em.create(UserFolder, {
      user: seedUser,
      folder: favoritesFolder
    })

    await em.persistAndFlush([
      seedUser,
      seedServer,
      generalChannel,
      initialMessage,
      defaultRole,
      announcementsFolder,
      announcementsServerFolder,
      starsoundServerUser,
      readLaterFolder,
      readLaterUserFolder,
      favoritesFolder,
      favoritesUserFolder
    ])
  }
}
