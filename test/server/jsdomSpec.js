var hyperdom = require('../..');
var jsdom = require('jsdom');
var expect = require('chai').expect;

describe('hyperdom', function() {

  describe('.append()', function() {

    it('renders elements in jsdom', function(done) {
      jsdom.env(
        '',
        [],
        function (errors, window) {
          var render = function(model) {
            return hyperdom.html('p', 'hello');
          }
          function requestRender(render) {
            render();
          }

          hyperdom.append(window.document.body, render, {}, {
            window: window,
            document: window.document,
            requestRender: requestRender
          });
          expect(window.document.body.childNodes[0].tagName).to.equal('P');
          done();
        }
      );
    });

  });

});
