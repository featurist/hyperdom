// expands the examples in readme.md into a directory of HTML files

var marked = require('marked');
var fs = require('fs');
var directory = './readme-examples';

fs.readFile('./readme.md', 'utf-8', function(err, markdown) {
  renderExamples(extractExamples(markdown));
  browserifyPlastiq();
});

function extractExamples(markdown) {
  var examples = [];
  var heading = 'untitled';
  var tokens = marked.lexer(markdown);
  for (var i = 0; i < tokens.length; ++i) {
    var token = tokens[i];
    if (token.type == 'code') {
      examples.push({ heading: heading, js: token.text });
    } else if (token.type == 'heading') {
      heading = token.text;
    }
  }
  return examples;
}

function renderExamples(examples) {
  try { fs.mkdirSync(directory); } catch (e) {}
  for (var i = 0; i < examples.length; ++i) {
    var example = examples[i];
    if (shouldRenderExample(example)) {
      var filename = example.heading.replace(" ", '-').toLowerCase() + '.html';
      fs.writeFileSync(directory + '/' + filename, renderExample(example.js));
    }
  }
}

function shouldRenderExample(example) {
  return example.js.indexOf('plastiq.attach') > -1 &&
         example.heading != 'An Example';
}

function renderExample(example) {
  var template = [
    '<html>',
    '<body>',
    '<script src="plastiq.js"></script>',
    '<script>',
    'var h = plastiq.html;',
    'var bind = plastiq.bind;',
    '',
    '{example}',
    '',
    '</script>',
    '</body>',
    '</html>'
  ].join("\n");
  return template.replace("{example}", example);
}

function browserifyPlastiq() {
  var browserify = require('browserify');
  var bundle = new browserify({ standalone: 'plastiq' });
  bundle.add('./index.js');
  bundle.bundle().pipe(fs.createWriteStream(directory + '/' + 'plastiq.js'));
}
