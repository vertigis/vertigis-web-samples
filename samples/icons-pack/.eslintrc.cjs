module.exports = {
    extends: [require.resolve("@vertigis/web-sdk/config/.eslintrc")],
    parserOptions: {
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ["src/_support/**"],
    rules: {},
};
