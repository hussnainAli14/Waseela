module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/api': './src/api',
          '@/assets': './src/assets',
          '@/components': './src/components',
          '@/hooks': './src/hooks',
          '@/navigation': './src/navigation',
          '@/screens': './src/screens',
          '@/store': './src/store',
          '@/theme': './src/theme',
          '@/utils': './src/utils',
        },
      },
    ],
  ],
};
