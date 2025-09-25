export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'Feat', // 기능 추가
        'Fix', // 버그 수정
        'Hotfix', // 긴급 버그 수정
        'Design', // 디자인 변경
        'Style', // 스타일 변경
        'Refactor', // 코드 리팩토링
        'Comment', // 주석 추가 및 변경
        'Docs', // 문서 수정
        'Test', // 테스트 코드
        'Chore', // 빌드 업무 수정, 패키지 매니저 수정
        'Rename', // 파일 혹은 폴더명 수정
        'Remove', // 파일 삭제
      ],
    ],
    'type-case': [2, 'always', 'pascal-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
}
