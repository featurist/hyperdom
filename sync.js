var rendering = require('./rendering');
var bind = require('./binding');
var $ = require('jquery');

module.exports.get = function(options, url) {
  var binding = rendering.binding(options.binding);
  var model = binding.get();

  if (!model || model.url !== url) {
    if (model && model.request) {
      console.log('aborting', model.url);
      model.request.abort();
    }

    var request = $.get(url);

    request.then(function (response) {
      var latest = binding.get();

      if (latest.slowTimeout) {
        clearTimeout(latest.slowTimeout);
      }

      if (latest.url == url) {
        binding.set({
          url: url,
          value: response
        });
      } else {
        console.log('ignoring', url);
      }
    }, function (error) {
      var latest = binding.get();

      if (latest.slowTimeout) {
        clearTimeout(latest.slowTimeout);
      }

      if (latest.url == url) {
        binding.set({
          url: url,
          error: error.responseText
        });
      }
    });

    var slow = setTimeout(function () {
      if (binding.get().slowTimeout == slow) {
        binding.set({
          request: request,
          url: url,
          value: model && model.value,
          loading: true,
          slow: true
        });
      }
    }, 140);

    binding.set({
      request: request,
      url: url,
      value: model && model.value,
      loading: true,
      slowTimeout: slow
    });
  }
};
