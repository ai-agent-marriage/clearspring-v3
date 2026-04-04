module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        wx: "readonly",
        App: "readonly",
        Page: "readonly",
        Component: "readonly",
        getApp: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
