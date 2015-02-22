var plastiq = require('../..');
var h = plastiq.html;

var stringify = require('virtual-dom-stringify');
var expect = require('chai').expect;
var Promise = require('bluebird').Promise;

describe('plastiq', function() {

  describe('.html(), detached from a real DOM', function() {

    it('creates a virtual dom with event handlers', function() {
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
      var animation = function (refresh) {
        refresh();
      }
      var vdom = h('.outer',
        h('.inner', h.animation(animation))
      );
      var html = stringify(vdom);
      expect(html).to.equal('<div class="outer"><div class="inner"></div></div>');
    });

    it('creates a virtual dom with promises', function() {
      var p = new Promise(function (fulfill) {
        fulfill('value');
      });

      var vdom = h('.outer',
        h('.inner', h.promise({
          pending: 'hello',
          fulfilled: 'goodbye',
          rejected: 'oh noes'
        }))
      );
      var html = stringify(vdom);
      expect(html).to.equal('<div class="outer"><div class="inner"></div></div>');
    });

  });

});
