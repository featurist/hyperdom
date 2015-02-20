var plastiq = require('../..');
var jsdom = require('jsdom');
var expect = require('chai').expect;

describe('plastiq', function() {

  it('renders elements in a dom', function(done) {
    jsdom.env(
      '',
      [],
      function (errors, window) {
        var render = function(model) {
          return plastiq.html('p', 'hello');
        }
        function requestRender(render) {
          render();
        }

        plastiq.append(window.document.body, render, {}, {
          window: window,
          requestRender: requestRender
        });
        expect(window.document.body.childNodes[0].tagName).to.equal('P');
        done();
      }
    );
  });

});
