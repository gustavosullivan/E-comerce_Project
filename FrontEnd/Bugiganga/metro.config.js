const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Zustand ESM usa import.meta — forçar entrada CJS no Metro web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
