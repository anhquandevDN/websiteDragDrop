// Updated by trungquandev.com's author on May 13 2023
// Sample Eslint config for React project
module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,

    'no-console': 1,
    'no-lonely-if': 1,
    'no-unused-vars': 1, //tạo biến ra nhưng không dùng
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'], //có khoảng trống ở space-before-block
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2], //không được cách đầu dòng quá 2
    'semi': [1, 'never'], //không dùng ;
    'quotes': ['error', 'single'], //dùng ''
    'array-bracket-spacing': 1,
    'linebreak-style': 0, //hỗ trợ k báo lỗi với người dùng mac, ios, linux
    'no-unexpected-multiline': 'warn', //báo lỗi những dòng không ngờ tới
    'keyword-spacing': 1, //khoảng trống
    'comma-dangle': 1, //dư thừa
    'comma-spacing': 1,
    'arrow-spacing': 1
  }
}
