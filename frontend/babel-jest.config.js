module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }], // Ensures compatibility with current Node version
      ['@babel/preset-react', { runtime: 'automatic' }],       // Enables JSX without needing to import React
      '@babel/preset-typescript',                              // Supports TS/TSX files
    ],
  };