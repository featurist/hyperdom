var plastiq = require('../..');
var stringify = require('virtual-dom-stringify');
var expect = require('chai').expect;

describe('plastiq', function() {

  describe('.html()', function() {

    it('creates a virtual dom with event handlers', function() {
      var h = plastiq.html;
      var model = { counter: 0 };
      var vdom = h('.outer',
        h('.inner', {
          onclick: function() {
            model.counter++;
          }
        })
      );
      var html = stringify(vdom);
      expect(html).to.equal('<div class="outer"><div class="inner"></div></div>');
      vdom.children[0].properties.onclick();
      expect(model.counter).to.equal(1);
      vdom.children[0].properties.onclick();
      expect(model.counter).to.equal(2);
    });

    it('creates a virtual dom with animations', function() {
      var h = plastiq.html;
      var animation = function (refresh) {
        refresh();
      }
      var vdom = h('.outer',
        h('.inner', h.animation(animation))
      );
      var html = stringify(vdom);
      expect(html).to.equal('<div class="outer"><div class="inner"></div></div>');
    });

  });

});
