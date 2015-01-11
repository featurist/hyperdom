var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var root = path.resolve(__dirname, '..', '..');
var temp = root + '/package-spec-temp/';
var packageJSON = require('../../package.json');

describe('package', function() {

  before(function() {
    fs.mkdirSync(temp);
    packageJSON.files.forEach(function(file) {
      fs.writeFileSync(temp + file, fs.readFileSync(file));
    });
  });

  after(function() {
    packageJSON.files.forEach(function(file) {
      fs.unlinkSync(temp + file);
    });
    fs.rmdirSync(temp);
  });

  it('returns a module', function() {
    var plastiq = require(temp + packageJSON.main);
    expect(plastiq.html).to.be.a('Function');
  });

});