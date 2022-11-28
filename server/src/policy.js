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

  },
  role: {
    nameMinLength: 1,
    nameMaxLength: 30,
  },
}