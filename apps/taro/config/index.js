const config = {
  projectName: 'wonderrealm',
  date: '2026-07-22',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      },
      cssModules: {
        enable: false
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  },
  pages: [
    'pages/index/index',
    'pages/world-select/index',
    'pages/game/index',
    'pages/poem/index',
    'pages/wedding/index'
  ],
  globalStyle: {
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '幻境漫游',
    navigationBarBackgroundColor: '#0a0e1a',
    backgroundColor: '#0a0e1a'
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
