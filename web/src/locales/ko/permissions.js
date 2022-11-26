import { ServerPermission } from '@/graphql/hooks'

export const permissions = {
  title: '권한',
  roles: '역할',
  name: '역할명',
  default: '기본',
  addRole: '역할 추가',
  createRole: '역할 생성',
  editRole: '역할 수정',
  deleteRole: '역할 삭제',
  save: '저장',
  saveChanges: '변경사항 저장',
  discard: '취소',
  discardChanges: '변경 사항 취소',
  notSaved: '변경 사항이 저장되지 않았습니다',
  continue: '계속하기',
  color: '색상',
  permissions: '권한',
  server: {
    // General
    [ServerPermission.ManageChannels]: {
      title: '채널 관리',
      description: '멤버에게 채널을 만들고 수정하고 삭제할 수 있는 권한을 부여해요.',
    },
    [ServerPermission.ManageServer]: {
      title: '역할 관리',
      description:
        '멤버에게 새 역할을 만들고 자신의 최고 역할보다 낮은 역할을 수정하고 삭제할 수 있는 권한을 부여해요. 또한 멤버에게 자신이 접근할 수 있는 개별 채널의 권한을 변경할 수 있는 권한을 부여해요.',
    },
    [ServerPermission.ManageServer]: {
      title: '행성 관리',
      description:
        "행성의 이름, 설명, 아이콘, 배너 이미지를 변경할 수 있습니다.",
    },

    // Channels
    [ServerPermission.SendMessages]: {
      title: '메시지 보내기',
      description: '채널에서 메시지를 보낼 수 있습니다.',
    },
    [ServerPermission.RestrictedChannels]: {
      title: '보기만 가능 채널에서 메시지 보내기',
      description:
        '보기만 가능 채널에서 메시지를 보낼 수 있습니다.',
    },
    [ServerPermission.PrivateChannels]: {
      title: '비공개 채널 이용',
      description:
        '비공개 채널의 메시지를 볼 수 있으며, 메시지를 보낼 수 있습니다.',
    },
    [ServerPermission.ManageMessages]: {
      title: '메시지 관리',
      description:
        '다른 멤버의 메시지를 고정/삭제할 수 있습니다.',
    },

    // Posts
    [ServerPermission.ManagePosts]: {
      title: '포스트 관리',
      description: '포스트를 고정/삭제할 수 있습니다.',
    },

    // Comments
    [ServerPermission.ManageComments]: {
      title: '댓글 관리',
      description: '댓글을 고정/삭제할 수 있습니다.',
    },

    // Folders
    [ServerPermission.ManageFolders]: {
      title: '폴더 관리',
      description: '폴더를 생성/수정/삭제할 수 있습니다.',
    },
    [ServerPermission.AddPostToFolder]: {
      title: '폴더에 포스트 추가',
      description: '포스트를 폴더에 추가/삭제할 수 있습니다.',
    },

    // Other
    [ServerPermission.DisplayRoleSeparately]: {
      title: '역할 개별 표시',
      description:
        '사용자 목록에 별도로 표시됩니다.',
    },
    [ServerPermission.Admin]: {
      title: '관리자',
      description: `모든 권한을 가집니다.`,
    },

    [ServerPermission.ManageUsers]: {
      title: '유저 관리',
      description: `유저를 차단/추방할 수 있습니다.`,
    }
  }
}
