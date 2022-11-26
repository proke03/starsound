export const channel = {
  title: 'Channels',
  togglePrivate: 'Private Channel',
  hideUsers: 'Hide Users',
  showUsers: 'Show Users',
  create: {
    label: 'Create Channel',
    name: 'Channel Name',
    description: 'Channel Description',
    alreadyExists: 'Channel already exists',
  },
  edit: 'Edit Channel',
  delete: {
    label: 'Delete',
    confirm: 'Messages in this channel will be lost.',
  },
  type: {
    public: {
      label: 'Public',
      description: 'Anyone can view and send messages',
    },
    private: {
      label: 'Private',
      description: 'Only members with permission can view and send messages',
    },
    restricted: {
      label: 'Restricted',
      description: 'Anyone can view, but only members with permission can send messages',
    },
  },
  context: {
    markRead: 'Mark As Read',
    delete: 'Delete Channel',
    edit: 'Edit Channel',
    mute: 'Mute Channel'
  },
  welcome: {
    title: 'Welcome to #{{channel}}',
    description: 'This is the beginning of #{{channel}} channel.',
  },
  online: 'Online',
}
