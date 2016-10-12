if (typeof window === 'object') {
  console.log('\n\ncreated with \uD83D\uDE80 using https://github.com/featurist/plastiq\n\n\n');
}

var rendering = require('./rendering');

exports.html = rendering.html;
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;
exports.binding = rendering.binding;
exports.meta = rendering.html.meta;
exports.refreshify = rendering.html.refreshify;
exports.norefresh = rendering.html.norefresh;

exports.currentRender = function () {
  return exports._currentRender;
};
