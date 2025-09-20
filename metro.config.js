const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases to Metro config
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(__dirname, 'app'),
    '@components': path.resolve(__dirname, 'app/components'),
    '@contexts': path.resolve(__dirname, 'app/contexts'),
    '@services': path.resolve(__dirname, 'app/services'),
    '@hooks': path.resolve(__dirname, 'app/hooks'),
    '@utils': path.resolve(__dirname, 'app/utils'),
  },
  // Add file extensions to resolve
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
};

// Add watch folders for Metro to watch
config.watchFolders = [
  ...config.watchFolders,
  path.resolve(__dirname, 'app'),
  path.resolve(__dirname, 'node_modules'),
];

module.exports = config;
