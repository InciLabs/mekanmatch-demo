module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./app'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './app',
            '@components': './app/components',
            '@contexts': './app/contexts',
            '@services': './app/services',
            '@hooks': './app/hooks',
            '@utils': './app/utils',
          },
        },
      ],
    ],
  };
};
