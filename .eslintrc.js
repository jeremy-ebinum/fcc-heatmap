module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  rules: {
    "no-console": 0,
    "func-names": ["warn", "as-needed"],
    "max-len": [
      "warn",
      {
        code: 80,
        tabWidth: 2,
        comments: 80,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
  },
};
