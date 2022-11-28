export const policy = {
  channel: {
    nameLength: 30,
    descriptionLength: 500,
  },
  comment: {
    minLength: 1,
    maxLength: 1000,
  },
  folder: {
    nameMinLength: 1,
    nameMaxLength: 30,
  },
  group: {
    maxMembers: 9,
    nameMinLength: 1,
    nameMaxLength: 30,
    avatarWidth: 256,
    avatarHeight: 256,
  },
  message: {
    minLength: 1,
    maxLength: 2000,
    defaultValue: 100,
    minLimit: 1,
    maxLimit: 100,
  },
  post: {
    titleMinLength: 1,
    titleMaxLength: 100,
    linkLength: 1000,
    textLength: 4000,
    imagesLength: 10,
    captionLength: 180,
    posts: {
      defaultOffset: 0,
      minOffset: 0,
      defaultLimit: 20,
      minLimit: 1,
      maxLimit: 100,
    },
  },
  role: {
    nameMinLength: 1,
    nameMaxLength: 30,
  },
  server: {
    nameMinLength: 3,
    nameMaxLength: 21,
    displayNameMinLength: 1,
    displayNameMaxLength: 30,
    descriptionLength: 500,
  },
}