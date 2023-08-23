module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      files: [
        './src/api/**/*.js',
        './src/services/postgres/**/*.js',
        './src/services/storage/**/*.js',
      ],
      rules: {
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-console': 'off',
  },
};
