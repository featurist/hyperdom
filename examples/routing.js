var plastiq = require('..');
var h = plastiq.html;
var router = require('../router');

var objects = [
  { name: 'one', id: 1 },
  { name: 'two', id: 2 },
  { name: 'three', id: 3 },
  { name: 'four', id: 4 }
];

function render(model) {
  return h('div',
    h('.header', 'Hi ', model.name),
    router(
      router.page('/', function () {
        return h('div',
          h('h1', 'root'),
          router.link('/objects', 'objects')
        );
      }),
      router.page('/objects', function () {
        return new Promise(function (result) {
          setTimeout(function () {
            result(objects);
          }, 300);
        });
      }, function (objects) {
        return h('div',
          h('h1', 'objects'),
          h('ul',
            objects.map(function (o) {
              return router.link('/objects/' + o.id, h('li', o.name));
            })
          )
        );
      }),
      router.page('/objects/:id', function (params) {
        return new Promise(function (result) {
          setTimeout(function () {
            result(objects.filter(function (o) { return o.id == Number(params.id); })[0]);
          }, 300);
        });
      },
      function (object) {
        return h('div',
          h('h1', 'object'),
          h('p', object.name)
        );
      })
    )
  );
}

plastiq.attach(document.body, render, {name: 'User'});
