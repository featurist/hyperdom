var hyperdom = require('../..');
var h = hyperdom.html;

var vdomToHtml = require('vdom-to-html');
var expect = require('chai').expect;
var hyperdomComponent = require('../../componentWidget');

describe('hyperdom', function() {

  describe('.html(), detached from a real DOM', function() {

    it('creates a virtual dom with event handlers', function() {
      var model = { counter: 0 };
      var vdom = h('.outer',
        h('.inner', {
          onclick: function() {
            model.counter++;
          }
        }),
        hyperdomComponent(function () {
          return h('.component');
        }),
        h.rawHtml('div', '<span>some raw HTML</span>')
      );
      var html = vdomToHtml(vdom);
      expect(html).to.equal('<div class="outer"><div class="inner"></div><div class="component"></div><div><span>some raw HTML</span></div></div>');
      vdom.children[0].properties.onclick();
      expect(model.counter).to.equal(1);
      vdom.children[0].properties.onclick();
      expect(model.counter).to.equal(2);
    });

  });

});
