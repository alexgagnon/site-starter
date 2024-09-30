module.exports = {
  plugins: [
    'removeDimensions',
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,

          // these cause issues with sprite maps
          cleanupIds: false,
          removeHiddenElems: false
        },
      },
    },
  ],
};
