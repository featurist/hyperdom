var browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['browserify', 'mocha'],
    files: [
      'test/karma/promisePolyfill.js',
      'test/karma/**/*Spec.js'
    ],
    exclude: [
      '**/.*.sw?'
    ],
    preprocessors: {
      'test/**/*Spec.js': ['browserify']
    },
    browserify: {
      debug: false
    },
    reporters: ['dots', 'saucelabs'],
    port: 9877,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: Object.keys(browsers),
    customLaunchers: browsers,
    captureTimeout: 120000,
    singleRun: true,
    sauceLabs: {
      startConnect: !process.env.TRAVIS_JOB_NUMBER,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || (new Date().getTime())
    }
  });
}
