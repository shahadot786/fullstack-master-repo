const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro Configuration for Tamagui
 * 
 * Metro is the JavaScript bundler for React Native.
 * This configuration is required for Tamagui to work properly.
 */

const config = getDefaultConfig(__dirname);

// Add Tamagui-specific configuration
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
