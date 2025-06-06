import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import tsEslint from 'typescript-eslint'
import unicornPlugin from 'eslint-plugin-unicorn'
import securityPlugin from 'eslint-plugin-security'
import vitestPlugin from '@vitest/eslint-plugin'
import queryPlugin from '@tanstack/eslint-plugin-query'

export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tsEslint.configs.recommended,
  securityPlugin.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      unicorn: unicornPlugin,
      vitest: vitestPlugin,
      '@tanstack/query': queryPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    rules: {
      // camelcase 규칙을 비활성화합니다. (변수명에 카멜 케이스를 강제하지 않음)
      camelcase: 0,

      // 콤마 뒷부분의 규칙을 비활성화합니다.
      'comma-dangle': 0,

      // 함수가 항상 값을 반환하지 않아도 허용합니다.
      'consistent-return': 0,

      // 익명 함수에 이름을 강제하지 않습니다.
      'func-names': 0,

      // 전역에서 require를 허용합니다.
      'global-require': 0,

      // 파일당 클래스 수 제한을 비활성화합니다.
      'max-classes-per-file': 0,

      // await가 루프 안에서 사용되는 것을 허용합니다.
      'no-await-in-loop': 0,

      // case 문 안에서 변수를 선언할 수 있도록 허용합니다.
      'no-case-declarations': 0,

      // 콘솔 사용을 경고합니다.
      'no-console': 'warn',

      // continue 문 사용을 허용합니다.
      'no-continue': 0,

      // 빈 블록을 허용합니다.
      'no-empty': 0,

      // 빈 함수를 허용합니다.
      'no-empty-function': 0,

      // 함수의 인자를 수정하는 것을 허용합니다.
      'no-param-reassign': 0,

      // 중첩된 삼항 연산자를 허용합니다.
      'no-nested-ternary': 0,

      // 무의미한 catch 블록을 허용합니다.
      'no-useless-catch': 0,

      // 제한된 구문 사용을 허용합니다.
      'no-restricted-syntax': 0,

      // 증감 연산자(++) 사용을 허용합니다.
      'no-plusplus': 0,

      // 객체의 프로토타입 메서드를 사용해도 허용합니다.
      'no-prototype-builtins': 0,

      // 할당과 동시에 반환하는 것을 허용합니다.
      'no-return-assign': 0,

      // return-await 사용을 허용합니다.
      'no-return-await': 0,

      // 루프 내에서 함수를 정의하는 것을 허용합니다.
      'no-loop-func': 0,

      // 템플릿 리터럴에서 중괄호를 사용해도 허용합니다.
      'no-template-curly-in-string': 0,

      // 언더스코어로 시작하는 변수명을 금지합니다.
      'no-underscore-dangle': 0,

      // 불필요한 표현식을 허용합니다.
      'no-unused-expressions': 0,
      'no-unused-disable-directive': 0,

      // 미사용 변수에 대해 경고하지 않습니다.
      'no-unused-vars': 0,

      // 동일한 스코프 내에서 변수명을 덮어쓰는 것을 허용합니다.
      'no-shadow': 0,

      // 특정 전역 변수 사용을 허용합니다.
      'no-restricted-globals': 0,

      // 주석 전후에 공백을 강제하지 않습니다.
      'spaced-comment': 0,

      // 구조 분해 할당을 강제하지 않습니다.
      'prefer-destructuring': 0,

      // Cypress 관련 규칙을 비활성화하여 불필요한 경고를 막습니다.
      'cypress/no-assigning-return-values': 0,
      'cypress/no-unnecessary-waiting': 0,

      // import 관련 규칙을 비활성화하여 사이클 및 동적 import를 허용합니다.
      'import/no-cycle': 0,
      'import/no-dynamic-require': 0,
      'import/no-named-as-default': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-named-as-default-member': 0,
      'import/prefer-default-export': 0,
      'import/no-anonymous-default-export': 0,

      // 접근성 관련 규칙을 비활성화합니다.
      'jsx-a11y/alt-text': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/label-has-associated-control': 0,
      'jsx-a11y/no-autofocus': 0,
      'jsx-a11y/no-noninteractive-element-interactions': 0,
      'jsx-a11y/no-static-element-interactions': 0,

      // parseInt에 반드시 radix(진수)를 지정하지 않아도 됩니다.
      radix: 0,

      // Promise 관련 규칙들을 비활성화합니다.
      'promise/always-return': 0,
      'promise/catch-or-return': 0,
      'promise/no-nesting': 0,
      'promise/no-promise-in-callback': 0,
      'promise/valid-params': 0,

      // React 관련 규칙들을 비활성화합니다.
      'react/default-props-match-prop-types': 0,
      'react/destructuring-assignment': 0,
      'react/display-name': 0,
      'react-hooks/exhaustive-deps': 0, // Hook의 종속성 배열을 강제하지 않습니다.
      'react-hooks/rules-of-hooks': 0,
      'react/prefer-stateless-function': 0,
      'react/forbid-prop-types': 0,
      'react/require-default-props': 0,
      'react/no-array-index-key': 0,
      'react/no-this-in-sfc': 0,
      'react/no-unused-state': 0,
      'react/no-unused-prop-types': 0,
      'react/no-access-state-in-setstate': 0,
      'react/prop-types': 0,
      'react/static-property-placement': 0,
      'react/jsx-key': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-filename-extension': 0,
      'react/jsx-one-expression-per-line': 0,

      // 보안 관련 규칙을 비활성화합니다.
      'security/detect-non-literal-fs-filename': 0,
      'security/detect-non-literal-require': 0,
      'security/detect-object-injection': 0,
      'security/detect-possible-timing-attacks': 0,

      // 세미콜론 사용을 강제하지 않습니다.
      semi: 0,

      // React Refresh 플러그인 관련 규칙을 비활성화합니다.
      'react-refresh/only-export-components': 0,

      'turbo/no-undeclared-env-vars': 0,

      // TypeScript의 any 사용과 미사용 변수 경고를 비활성화합니다.
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-unsafe-function-type': 0,

      // 파일명을 케밥 케이스(kebab-case)로 강제합니다.
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
]
