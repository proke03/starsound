export const post = {
  label: '포스트',
  createPost: '포스트 작성',
  create: {
    title: '제목',
    linkUrl: '링크 주소',
    invalidUrl: '유효한 주소가 아닙니다',
    imageDrop: "이미지를 여기에 끌어다 놓거나 클릭하여 이미지를 선택하세요",
    submit: '작성',
    cancel: '취소'
  },
  type: {
    text: '글 포스트',
    text_short: '글',
    link: '링크 포스트',
    link_short: '링크',
    image: '이미지 포스트',
    image_short: '이미지',
    album: '이미지 앨범',
  },
  createComment: '댓글 작성',
  commentCount: '댓글: {{count}}',
  commentCount_plural: '댓글: {{count}}',
  participantCount: '참여자: {{count}}',
  participantCount_plural: '참여자: {{count}}',
  creator: '작성자',
  context: {
    pin: '포스트 고정',
    pinned: '포스트가 고정됐습니다!',
    unpin: '포스트 고정 해제',
    unpinned: '포스트 고정이 해제됐습니다!',
    removeFromFolder: '폴더에서 제거',
    addToUserFolder: '폴더에 추가',
    addToServerFolder: '행성 폴더 만들기',
    edit: '포스트 수정',
    delete: '포스트 삭제',
    deleted: '포스트가 삭제됐습니다!',
    copyLink: '링크 복사',
    sendToFriend: '친구에게 보내기',
    vote: '추천하기',
    unvote: '추천 취소',
    votePermission: '이 행성에서 댓글을 추천할 권한이 없습니다.',
  },
  hideParticipants: '참여자 숨기기',
  showParticipants: '참여자 보이기',
  pinnedTo: '{{server.name}}에 고정됐습니다',
  expand: '세부사항',
  collapse: '세부사항 숨기기',
  feed: {
    title: '피드',
    helmetTitle: '홈 – 별별소리',
    joinCreatePlanet: '플래닛에 가입하거나 만들어서 친구들과 소통하세요.',
    postComment: '댓글과 포스트를 작성하세요.',
    chat: '채팅',
    refresh: '새로고침',
    sort: {
      hot: 'Hot',
      top: 'Top',
      new: 'New'
    },
    time: {
      hour: '시간',
      day: '일간',
      week: '주간',
      month: '월간',
      year: '연간',
      all: '전체'
    },
    liveMode: {
      title: '라이브 모드',
      description: '피드에 자동으로 새로운 포스트가 추가됩니다.',
      comingSoon: '라이브 모드가 곧 출시됩니다!'
    },
    subscriptions: {
      show: '구독 보기',
      hide: '구독 숨기기',
      comingSoon: '행성 구독 기능이 곧 출시됩니다!'
    }
  },
  noMorePosts: '더 로딩할 포스트가 없습니다',
  noTitle: '제목이 없습니다',
  noDescription: '설명이 없습니다',
}
