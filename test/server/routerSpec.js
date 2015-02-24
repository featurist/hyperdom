var plastiq = require('../..');
var h = plastiq.html;
var jsdom = require('jsdom');
var expect = require('chai').expect;
var stringify = require('virtual-dom-stringify');

describe('plastiq.html.router', function() {

  it('renders a virtual dom for the current location', function() {
    var pathname;
    var history = {
      location: function () {
        return { pathname: pathname };
      }
    }
    var router = h.router.with({ history: history });
    function html() {
      return stringify(
        h('.app',
          router(
            router.page('/one', function () { return h('.one', '1') }),
            router.page('/two', function () { return h('.two', '2') })
          )
        )
      );
    }
    pathname = '/one';
    expect(html()).to.equal('<div class="app"><div class="one">1</div></div>');
    pathname = '/two';
    expect(html()).to.equal('<div class="app"><div class="two">2</div></div>');
  });

});
