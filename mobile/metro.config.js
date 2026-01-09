const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

/**
 * Metro configuration for Expo Router with monorepo support
 * https://docs.expo.dev/guides/monorepos/
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(projectRoot);

// 1. Watch only the project root and shared directory
config.watchFolders = [
  projectRoot,
  path.resolve(monorepoRoot, "shared")
];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Exclude node_modules from other sub-projects to avoid "TreeFS" conflicts
// We exclude anything that looks like node_modules in other apps
config.resolver.blockList = [
  /.*\/backend\/node_modules\/.*/,
  /.*\/web\/node_modules\/.*/,
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
