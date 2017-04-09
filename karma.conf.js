// Karma configuration
// Generated on Sat Dec 27 2014 08:06:04 GMT+0100 (CET)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/browser/**/*Spec.js'
    ],

    // list of files to exclude
    exclude: [
      '**/.*.sw?'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*Spec.js': ['browserify']
    },

    browserify: {
      debug: true
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
        timeout: 0
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
  'browserstack-ie9': {
    base: 'BrowserStack',
    browser: 'IE',
    browser_version: '9.0',
    os: 'Windows',
    os_version: '7',
    resolution: '1024x768'
  },
  'browserstack-ie10': {
    base: 'BrowserStack',
    browser: 'IE',
    browser_version: '10.0',
    os: 'Windows',
    os_version: '8',
    resolution: '1024x768'
  },
  'browserstack-ie11': {
    base: 'BrowserStack',
    browser: 'IE',
    browser_version: '11.0',
    os: 'Windows',
    os_version: '10',
    resolution: '1024x768'
  },
  'browserstack-edge': {
    base: 'BrowserStack',
    browser: 'Edge',
    browser_version: '13.0',
    os: 'Windows',
    os_version: '10',
    resolution: '1024x768'
  },
  'browserstack-firefox': {
    base: 'BrowserStack',
    browser: 'Firefox',
    browser_version: '47.0',
    os: 'Windows',
    os_version: '10',
    resolution: '1024x768'
  },
  'browserstack-safari': {
    base: 'BrowserStack',
    browser: 'Safari',
    browser_version: '9.1',
    os: 'OS X',
    os_version: 'El Capitan',
    resolution: '1024x768'
  },
  'browserstack-safari-ios': {
    base: 'BrowserStack',
    device: 'iPhone 6S',
    os: 'ios',
    os_version: '9.1'
  },
  'browserstack-chrome': {
    base: 'BrowserStack',
    browser: 'Chrome',
    browser_version: '52.0',
    os: 'Windows',
    os_version: '10',
    resolution: '1024x768'
  }
}
