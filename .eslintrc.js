const path = require('path')
module.exports = {
  // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  // 配置解析器支持的语法
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true,
    },
  },
  // 一个配置文件可以被基础配置中的已启用的规则继承。
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended', 
    'prettier/@typescript-eslint', 
    'plugin:prettier/recommended',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard'
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier'
  ],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    },
    'import/resolver': {
      alias: {
          map: [
              ['@', path.join(__dirname, ".")],
              ['@src', path.join(__dirname, "src")],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }
    },
  },
  // 自定义全局变量
  globals: {
    window: true,
    "@": true
  },
  rules: {
    'prettier/prettier': 1,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'eqeqeq': ['warn', 'always'],
    'prefer-const': ['error', {'destructuring': 'all', 'ignoreReadBeforeAssign': true}],
    '@typescript-eslint/explicit-function-return-type': 0, //都要定义return
    '@typescript-eslint/no-explicit-any': 0, // 参数类似为any的错误提示
    // '@typescript-eslint/no-unused-vars': 0, // 是否参数定义不使用
    '@typescript-eslint/interface-name-prefix': 0, // 接口名称前缀
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-triple-slash-reference': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/triple-slash-reference': ['error', { 'path': 'always', 'types': 'never', 'lib': 'never' }],
    '@typescript-eslint/explicit-module-boundary-types': 0, // 这个render需要返回值定义
    // React相关校验规则
    'react/jsx-indent': [2, 2], // 缩进 2
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'react/prop-types': 0, // prop 属性值的定义校验
    
  }
};
