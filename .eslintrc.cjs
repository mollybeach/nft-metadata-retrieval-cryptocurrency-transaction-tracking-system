module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,  // Add Node.js environment support
    jest: true,  // Add Jest support to avoid undefined errors
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',  // Use "module" for ES6 imports/exports
  },
  settings: {
    react: { version: '18.2' },
  },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': 'warn',  // Add warning for unused variables
    'no-console': 'off',  // Allow console statements for debugging
  },
};
