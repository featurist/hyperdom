// Karma configuration
// Generated on Sat Dec 27 2014 08:06:04 GMT+0100 (CET)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/browser/karma.index.ts'
    ],

    // list of files to exclude
    exclude: [
      '**/.*.sw?'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/browser/karma.index.ts': ['webpack']
    },

    webpack: {
      mode: 'development',
      optimization: {
        nodeEnv: false
      },
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.ts', '.tsx']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
              // karma does not fail on compilation errors - so get rid of typechecking to save few seconds.
              transpileOnly: true,
              compilerOptions: {
                noEmit: false,
                target: 'es5'
              }
            },
            exclude: process.cwd() + '/node_modules'
          }
        ]
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: process.env.BROWSERS ? ['dots'] : ['mocha'],

    electronOpts: {
      show: false
    },

    mochaReporter: {
      showDiff: true
    },

    client: {
      mocha: {
        timeout: process.env.CI ? 61000 : 2000
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    concurrency: process.env.BROWSERS === 'all' ? 2 : Infinity,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.BROWSERS === 'all' ? Object.keys(browsers) : ['Chrome'],

    browserStack: {
      username: process.env.BROWSERSTACK_USER,
      accessKey: process.env.BROWSERSTACK_PASSWORD
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    customLaunchers: browsers,

    browserNoActivityTimeout: 60000
  })
}

var browsers = {
  'browserstack-windows-firefox': {
    base: 'BrowserStack',
    browser: 'Firefox',
    os: 'Windows',
    os_version: '10',
    resolution: '1280x1024'
  },
  'browserstack-osx-firefox': {
    base: 'BrowserStack',
    browser: 'Firefox',
    os: 'OS X',
    os_version: 'Mojave',
    resolution: '1280x1024'
  },
  'browserstack-safari': {
    base: 'BrowserStack',
    browser: 'Safari',
    os: 'OS X',
    os_version: 'Mojave',
    resolution: '1280x1024'
  },
  'browserstack-windows-chrome': {
    base: 'BrowserStack',
    browser: 'Chrome',
    os: 'Windows',
    os_version: '10',
    resolution: '1280x1024'
  },
  'browserstack-osx-chrome': {
    base: 'BrowserStack',
    browser: 'Chrome',
    os: 'OS X',
    os_version: 'Mojave',
    resolution: '1280x1024'
  },
  'browserstack-ie11': {
    base: 'BrowserStack',
    browser: 'IE',
    os: 'Windows',
    os_version: '10',
    resolution: '1280x1024'
  },
  'browserstack-edge': {
    base: 'BrowserStack',
    browser: 'Edge',
    os: 'Windows',
    os_version: '10',
    resolution: '1280x1024'
  }
}
