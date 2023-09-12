module.exports = {
  chainWebpack: (config) => {
    // Enable JSX in the Vue loader
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          compatConfig: {
            MODE: 2, // enable Vue 3 runtime
          },
          // Enable JSX
          jsx: true,
        };
        return options;
      });
  },
  transpileDependencies: ["@vue/babel-plugin-jsx"],
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
};
