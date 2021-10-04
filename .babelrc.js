module.exports = (api) => {
    api.cache.never();
    return {
      presets: [
        [
          '@babel/env',
          {
            debug: false,
            spec: true,
            loose: false,
            modules: false,
            targets: {
              node: 'current',
            },
          },
        ],
      ],
    };
  };
  