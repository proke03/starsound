export const error = {
  entityNotFound: '{{replace}} 를 찾을 수 없습니다!',
  invalidUserAuth: "'USER' authorization can only be used on User entity",
  notLoggedIn: '로그인이 필요합니다.',
  fileSize: '파일 사이즈는 {{replace}}MB 이하여야 합니다.',
  channelPermissions:
    '(useChannelPermissions) channelPermissions and serverPermissions must have same length',
  folder: {
    deleted: '폴더를 삭제했습니다',
    notOwner: '해당 폴더를 소유하고 있지 않습니다',
    nameTooLong: '이름은 300자 이하여야 합니다',
    alreadyExists: '이미 존재하는 폴더 이름입니다',
    noPermission: '폴더를 수정할 권한이 없습니다',
    alreadyAdded: '이미 이 폴더에 추가되어 있습니다',
    cannotEdit: '나중에 보기/즐겨찾기 폴더는 수정할 수 없습니다',
    cannotDelete: '나중에 보기/즐겨찾기 폴더는 삭제할 수 없습니다',
    cannotCreate: '나중에 보기/즐겨찾기 폴더는 생성할 수 없습니다',
    notCollaborative: '협업 폴더가 아닙니다',
    notInFolder: '해당 포스트는 이 폴더에 없습니다',
    owner: '이 폴더의 소유자입니다',
    private: '비공개 폴더입니다',
    friends: `해당 폴더를 소유한 사용자의 친구만 볼 수 있습니다`,
  },
  message: {
    notAuthor: '해당 메시지의 작성자가 아닙니다',
    missingArgs: '채널, 그룹, 유저 중 하나의 ID를 입력해주세요',
    notSentInChannel: '채널에서 보낸 메시지가 아닙니다',
    empty: '메시지를 입력해주세요',
    textOrFile: '텍스트나 파일을 입력해주세요',
  },
  comment: {
    notAuthor: '당신은 이 댓글의 작성자가 아닙니다',
    empty: '댓글을 입력해주세요',
    alreadyDeleted: '댓글이 이미 삭제되었습니다',
    alreadyVoted: '당신은 이미 이 댓글에 투표했습니다',
  },
  post: {
    notAuthor: '당신은 이 포스트의 작성자가 아닙니다',
    alreadyVoted: '당신은 이미 이 포스트를 투표했습니다',
    alreadyPinned: '이미 고정된 포스트입니다',
    notPinned: '고정된 포스트가 아닙니다',
  },
  group: {
    maxSize: '그룹의 최대 인원은 10명입니다',
    notJoined: '그룹에 가입되어 있지 않습니다',
  },
  server: {
    notJoined: '이 행성에 가입되어 있지 않습니다',
    banned: '행성에서 추방되었습니다',
    alreadyJoined: '이미 가입한 행성입니다',
    missingPermission: '{{replace}} 권한이 없습니다.',
    notOwner: '행성의 소유자여야 합니다',
    inviteRequired: '행성에 가입하려면 초대가 필요합니다',
    inviteExpired: '행성 초대가 만료되었습니다',
  },
  channel: {
    missingPermission: 'Missing channel permission {{replace}}'
  },
  user: {
    blocking: '당신은 이 사용자를 차단했습니다',
    blocked: '이 사용자는 당신을 차단했습니다',
    friendRequestNotSent: '당신은 이 사용자에게 친구 요청을 보내지 않았습니다',
    friendRequestNotReceived:
      '당신은 이 사용자로부터 친구 요청을 받지 않았습니다',
    notFriends: '당신은 이 사용자와 친구가 아닙니다',
    alreadyBlocking: '당신은 이미 이 사용자를 차단했습니다',
    notBlocking: '당신은 이 사용자를 차단하지 않았습니다',
  },
  upload: {
    invalidMime: '이미지는 PNG나 JPEG 형식이어야 합니다',
  },
  register: {
    codeNotMatch: 'Code does not match',
  },
  login: {
    invalid: '로그인이 잘못되었습니다',
    invalidEmail: '이메일 주소가 잘못되었습니다',
    emailInUse: '이메일이 이미 사용중입니다',
    illegalName: `이름에 {{replace}}을(를) 사용할 수 없습니다`,
    nameLength: '이름은 2자에서 32자 사이여야 합니다',
    banned: '{{replace}} 가 차단되었습니다',
    wrongPassword: '비밀번호가 잘못되었습니다',
    usernameTaken: '이미 사용중인 사용자 이름입니다',
  },
  notif: {
    notYours: '당신의 알림이 아닙니다',
  },
  pageNotFound: {
    title: '존재하지 않는 페이지입니다.',
    returnHome: '홈으로 돌아가시겠습니까?',
  },
  passwordLength: '패스워드는 6자 이상이어야 합니다',
}
