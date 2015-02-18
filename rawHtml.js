var createElement = require('virtual-dom/create-element');
var rendering = require('./rendering');

function RawHtmlWidget(selector, options, html) {
  this.selector = selector;
  this.options = options;
  this.html = html;
}

RawHtmlWidget.prototype.type = 'Widget';

RawHtmlWidget.prototype.init = function () {
  var element = createElement(rendering.html(this.selector, this.options));
  element.innerHTML = this.html;
  return element;
};

RawHtmlWidget.prototype.update = function (previous, element) {
  if (this.html != previous.html) {
    element.parentNode.replaceChild(this.init(), element);
  }
};

RawHtmlWidget.prototype.destroy = function (element) {
};

module.exports = function (selector, options, html) {
  if (arguments.length == 2) {
    return new RawHtmlWidget(selector, undefined, options);
  } else {
    return new RawHtmlWidget(selector, options, html);
  }
};
