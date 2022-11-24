export const channel = {
  title: '채널',
  togglePrivate: '개인 채널',
  hideUsers: '유저 숨기기',
  showUsers: '유저 보기',
  create: {
    label: '채널 만들기',
    name: '채널 이름',
    description: '설명',
    alreadyExists: '이미 존재하는 채널입니다',
  },
  edit: '채널 수정',
  type: {
    public: {
      label: '공개',
      description: '모두가 볼 수 있고 메시지를 보낼 수 있습니다',
    },
    private: {
      label: '비공개',
      description: '권한이 있는 사람만 볼 수 있고 메시지를 보낼 수 있습니다',
    },
    restricted: {
      label: '보기만 가능',
      description: '모두가 볼 수 있지만 권한이 있는 사람만 메시지를 보낼 수 있습니다',
    },
  },
  context: {
    markRead: '읽음으로 표시',
    delete: '채널 삭제',
    edit: '채널 수정',
    mute: '채널 알림 끄기',
  },
  welcome: {
    title: '#{{channel}} 채널에 오신 것을 환영합니다',
    description: '#{{channel}} 채널의 시작입니다.',
  },
  online: '온라인',
}
