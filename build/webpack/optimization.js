module.exports = {
  splitChunks: {
    name: 'chunk',
    chunks: 'all',
    maxSize: 1000000,
  },
  minimize: !process.env.NODE_ENV === 'development',
};
