module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  // 自定义规则选项配置对象
  // key:规则代号
  // value:规则说明
  // "off" or 0 - 关闭规则，什么都不做
  // "warn" or 1 - 将规则视为一个警告（不会影响退出码），警告不退出
  // "error" or 2 - 将规则视为一个错误 (退出码为1)，报错并退出
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
