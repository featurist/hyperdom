# plastiq [![npm version](https://badge.fury.io/js/plastiq.svg)](https://www.npmjs.com/package/plastiq) [![npm](https://img.shields.io/npm/dm/localeval.svg?style=flat-square)](https://www.npmjs.com/package/plastiq) [![Build Status](https://travis-ci.org/featurist/plastiq.svg?branch=master)](https://travis-ci.org/featurist/plastiq) [![Gitter chat](https://badges.gitter.im/featurist/plastiq.png)](https://gitter.im/featurist/plastiq)

A fast, feature rich and **simple** framework for building dynamic browser applications.

1. There is one **model** for the whole page, this model is stateful, object-oriented and free of framework elements.
2. There is a **render function** that renders the model into HTML every time the model changes, but only applies the differences from the last render to the DOM.

Of course, the **model** can be as simple or sophisticated as you need, and you can refactor the **render function** into **render functions** or polymorphic **render methods**, or whatever works best. It's just javascript, you know what you're doing.

Plastiq is influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching.

# An Example

```JavaScript
var plastiq = require('plastiq');
var h = plastiq.html;

function render(model) {
  return h('div',
    h('label', "what's your name?"), ' ',
    h('input', {type: 'text', binding: [model, 'name']}),
    h('div', 'hi ', model.name)
  );
}

plastiq.append(document.body, render, {name: ''});
```

Try it on [requirebin](http://requirebin.com/?gist=9890d270f676e9bb2681).

# install

## npm

    npm install plastiq

Use either with browserify:

    var plastiq = require('plastiq');

Or from HTML, first create a symlink:

    ln -s node_modules/plastiq/plastiq.js public/plastiq.js

Then

    <script src="plastiq.js"></script>

## cdn

[Plastiq on CDNJS](https://cdnjs.com/libraries/plastiq):

    <script src="https://cdnjs.cloudflare.com/ajax/libs/plastiq/<version>/plastiq.min.js"></script>

# size

* plastiq.js: 68K
* plastiq.min.js: 27K
* plastiq.min.js.gz: 9K

# sister projects

* [plastiq-ace-editor](https://github.com/featurist/plastiq-ace-editor)
* [plastiq-draggabilly](https://github.com/featurist/plastiq-draggabilly)
* [plastiq-medium-editor](https://github.com/featurist/plastiq-medium-editor)
* [plastiq-ckeditor](https://github.com/featurist/plastiq-ckeditor)
* [plastiq-jsxify](https://github.com/featurist/plastiq-jsxify)
* [plastiq-loader](https://github.com/featurist/plastiq-loader)
* [plastiq-router](https://github.com/featurist/plastiq-router)
* [plastiq-semantic-ui](https://github.com/featurist/plastiq-semantic-ui)
* [plastiq-sortable](https://github.com/featurist/plastiq-sortable)
* [plastiq-throttle](https://github.com/featurist/plastiq-throttle)
* [plastiq-zeroclipboard](https://github.com/featurist/plastiq-zeroclipboard)

# Features

## Rendering the View

The `render` function takes a model object and returns a virtual DOM fragment. The render function **should not modify the model**, just return the view. It should not be relied upon to manipulate any state, this is because it can be called very frequently during user interaction, or very rarely if ever if the browser tab is not in focus.

```JavaScript
function render(model) {
  return h('span', 'hi ', model.name);
}
```

### Use Selectors

Use `tagname`, with any number of `.class` and `#id`.

```JavaScript
h('div.class#id', 'hi ', model.name);
```

Spaces are taken to be small hierarchies of HTML elements, this will produce `<pre><code>...</code></pre>`:

```JavaScript
h('pre code', 'hi ', model.name);
```

### Add HTML Attributes

```JavaScript
h('span', { style: { color: 'red' } }, 'name: ', model.name);
```

[virtual-dom](https://github.com/Matt-Esch/virtual-dom) uses JavaScript names for HTML attributes like `className`, `htmlFor` and `tabIndex`. Plastiq supports these, but also allows regular HTML names so you can use `class`, `for` and `tabindex`. These are much more familiar to people and you don't have to learn anything new.

Non-standard HTML attribtes can be placed in the `attributes` key:

```JavaScript
h('span', {attributes: {'my-html-attribute': 'stuff'}}, 'name: ', model.name);
```

### Keys

Plastiq (or rather [virtual-dom](https://github.com/Matt-Esch/virtual-dom)) is not clever enough to be able to compare lists of elements. For example, say you render the following:

```js
h('ul',
  h('li', 'one'),
  h('li', 'two'),
  h('li', 'three')
)
```

And then, followed by:

```js
h('ul',
  h('li', 'zero'),
  h('li', 'one'),
  h('li', 'two'),
  h('li', 'three')
)
```

The lists will be compared like this, and lots of work will be done to change the DOM:

```html
<li>one</li>   => <li>zero</li>  (change)
<li>two</li>   => <li>one</li>   (change)
<li>three</li> => <li>two</li>   (change)
                  <li>three</li> (new)
```

If we put a unique `key` (String or Number) into the attributes, then we can avoid all that extra work, and just insert the `<li>zero</li>`.

```js
h('ul',
  h('li', {key: 'one'}, 'one'),
  h('li', {key: 'two'}, 'two'),
  h('li', {key: 'three'}, 'three'))
```

And:

```js
h('ul',
  h('li', {key: 'zero'}, 'zero'),
  h('li', {key: 'one'}, 'one'),
  h('li', {key: 'two'}, 'two'),
  h('li', {key: 'three'}, 'three'))
```

It will be compared like this, much faster:

```html
                  <li>zero</li>  (new)
<li>one</li>   => <li>one</li>
<li>two</li>   => <li>two</li>
<li>three</li> => <li>three</li>
```

Its not all about performance, there are other things that can be affected by this too, including CSS transitions when CSS classes or style is changed.

### Raw HTML

Insert raw unescaped HTML. Be careful! Make sure there's no chance of script injection.

```JavaScript
function render(model) {
  return h.rawHtml('div',
    {style: { color: 'red' } },
    'some dangerous <script>doTerribleThings()</script> HTML');
}
```

This can be useful for rendering HTML entities too. For example, to put `&nbsp;` in a table cell use `h.rawHtml('td', '&nbsp;')`.

### Classes

* an string, e.g. `'item selected'`.
* an array - the classes will be all the items space delimited, e.g. `['item', 'selected']`.
* an object - the classes will be all the keys with truthy values, space delimited, e.g. `{item: true, selected: item.selected}`.

```JavaScript
h('span', { class: { selected: model.selected } }, 'name: ', model.name);
```

### Data Attributes

```js
h('div', {'data-stuff': 'something'});
```

or

```js
h('div', {dataset: {stuff: 'something'}});
```

## Responding to Events

Pass a function to any `on*` event handler.

When the event handler has completed the view is automatically re-rendered.

If you return a promise, then the view is also re-rendered when the promise resolves.

```JavaScript
function render(model) {
  return h('div',
    h('ul',
      model.people.map(function (person) {
        return h('li', person.name);
      })
    ),
    h('button', {
      onclick: function () {
        model.people.push({name: 'Person ' + (model.people.length + 1)});
      }
    }, 'Add Person')
  );
}

plastiq.append(document.body, render, { people: [] });
```

Try it on [requirebin](http://requirebin.com/?gist=82bf7e63cbb4072b71f0)

## Window Events

You can attach event handlers to `window`, such as `window.onscroll` and `window.onresize`. Return a `h.window()` from your render function passing an object containing the event handlers to attach. When the window vdom is shown, the event handlers are added to `window`, when the window vdom is not shown, the event handlers are removed from `window`.

E.g. to add an `onresize` handler:

```JavaScript
function render() {
  return h('div',
    'width = ' + window.innerWidth + ', height = ' + window.innerHeight,
    h.window({ onresize: function () {console.log('resizing');} })
  );
}
```

Try it on [requirebin](http://requirebin.com/?gist=8790af706dbd09840093)

## Binding the Inputs

This applies to `textarea` and input types `text`, `url`, `date`, `email`, `color`, `range`, `checkbox`, `number`, and a few more obscure ones. Most of them.

The `binding` attribute can be used to bind an input to a model field. You can pass either an array `[model, 'fieldName']`, or an object `{get: function () { ... }, set: function (value) { ... }}`.

```JavaScript
function render(model) {
  return h('div',
    h('label', "what's your name?"), ' ',
    h('input', {type: 'text', binding: [model, 'name']}),
    h('div', 'hi ' + model.name)
  );
}

plastiq.append(document.body, render, { name: '' });
```

Try it on [requirebin](http://requirebin.com/?gist=9890d270f676e9bb2681).

## Radio Buttons

Bind the model to each radio button. The buttons can be bound to complex (non-string) values.

```JavaScript
var blue = { name: 'blue' };

function render(model) {
  return h('div',
    h('input.red', {
      type: 'radio',
      name: 'colour',
      binding: [model, 'colour'],
      value: 'red'
    }),
    h('input.blue', {
      type: 'radio',
      name: 'colour',
      binding: [model, 'colour'],
      value: blue
    }),
    ' ',
    h('code', JSON.stringify(model.colour))
  );
}

plastiq.append(document.body, render, { colour: blue });
```

Try it on [requirebin](http://requirebin.com/?gist=af4b00af80d6aea3d3fe).

## Select Dropdowns

Bind the model onto the `select` element. The `option`s can have complex (non-string) values.

```JavaScript
var blue = { name: 'blue' };

function render(model) {
  return h('div',
    h('select',
      {binding: [model, 'colour']},
      h('option', {value: 'red'}, 'red'),
      h('option', {value: blue}, 'blue')
    ),
    ' ',
    h('code', JSON.stringify(model.colour))
  );
}

plastiq.append(document.body, render, { colour: blue });
```

Try it on [requirebin](http://requirebin.com/?gist=0c9b0eeb62e9b1f2089b).

## File Inputs

The file input is much like any other binding, except that only the binding's `set` method ever called, never the `get` method - the file input can only be set by a user selecting a file.

```JavaScript
function render(model) {
  return h('div',
    h('input',
      {
        type: 'file',
        binding: {
          set: function (file) {
            return new Promise(function (result) {
              var reader = new FileReader();
              reader.readAsText(file);

              reader.onloadend = function () {
                model.filename = file.name;
                model.contents = reader.result;
                result();
              };
            });
          }
        }
      }
    ),
    h('h1', model.filename),
    h('pre', h('code', model.contents))
  );
}

plastiq.append(document.body, render, {
  filename: '(no file selected)',
  contents: ''
});
```

Try it on [requirebin](http://requirebin.com/?gist=f4cde0354263ba7cc56e).

## Components

Components can be used to track the life-time of some HTML. This is usually helpful if you want to
install jQuery plugins.

The `plastiq.html.component()` allows you to respond to when the HTML is added, updated and removed.

```JavaScript
function render(model) {
  return h('div',
    model.show
      ? h.component(
          {
            onbeforeadd: function () {
              // you can store state in `this`, and it will
              // be present in subsequent event handlers
              // in fact, the `this` is the same object
              // for each event handler, across all view refreshes
              this.someProperty = 'some value';
            },

            onadd: function (element) {
              // element is the <div>component contents</div>
              // you may want to add jQuery plugins here
              console.log('added: ', this.someProperty);
            },

            onupdate: function (element) {
              console.log('updated: ', this.someProperty);
            },

            onremove: function (element) {
              console.log('removed: ', this.someProperty);
            }
          },
          h('div', 'component contents')
        )
      : undefined,
    h('div',
      h('label',
        'show component ',
        h('input', {type: 'checkbox', binding: [model, 'show']})
      )
    ),
    h('div',
      h('button', {onclick: function () {}}, 'refresh')
    )
  );
}

plastiq.append(document.body, render, {});
```

Try it on [requirebin](http://requirebin.com/?gist=7c08489a84b0766651a9).

Components can also be used to render just parts of the page, usually for performance reasons.

```JavaScript
function render(model) {
  var component = h.component(function () {
    return h('div', 'component counter: ', model.counter);
  });
  
  return h('div',
    component,
    h('div', 'page counter: ', model.counter),
    h('div',
      h('button', {
        onclick: function () {
          model.counter++;
          return component;
        }
      }, 'refresh component')
    ),
    h('div',
      h('button', {
        onclick: function () {
          model.counter++;
        }
      }, 'refresh page')
    )
  );
}

plastiq.append(document.body, render, {counter: 0});
```

Try it on [requirebin](http://requirebin.com/?gist=afb1a6123309267b2d5a).

## Controllers?

You won't find controllers or components in plastiq like you would in React's `React.createClass()` and AngularJS's `angular.directive()` and `angular.controller()`. This sounds like an omission, but in reality they're simply not needed. Plastiq works with render functions and model objects, the two primary building blocks of JavaScript, so it's refreshingly easy to structure and refactor your application.

Render functions contain event handlers, which act as **controllers** in other frameworks. Event handlers can either handle events inline, or delegate to methods on the model.

In the example below we have a `render` function and a `renderPerson` function. The `renderPerson` acts as a reusable component for rendering and handling interaction for each person.

```JavaScript
function render(model) {
  return h('div',
    h('h3', 'People'),
    h('ol',
      model.people.map(function (person) {
        return renderPerson(model, person);
      })
    ),
    h('button',
      {
        onclick: function () { model.addPerson(); }
      },
      'add')
  );
}

function renderPerson(model, person) {
  return h('li',
    h('input', {type: 'text', binding: [person, 'name']}),
    h('button',
      {
        onclick: function () { model.deletePerson(person); }
      },
      'delete')
  )
}

plastiq.append(document.body, render, {
  people: [
    {name: 'Åke'},
    {name: 'آمر'},
    {name: '正'}
  ],

  addPerson: function () {
    this.people.push({name: "somebody"});
  },

  deletePerson: function (person) {
    var i = this.people.indexOf(person);

    if (i >= 0) {
      this.people.splice(i, 1);
    }
  }
});
```

Try it on [requirebin](http://requirebin.com/?gist=9ff1ee7bdb2b57fccfb6).

The model too can contain render methods so you can take advantage of polymorphism. This might be useful, for example, if you want to render a list of different types of widgets. Each object in the list would have its own render function, rendering different HTML depending on the object.

Here we render different types of animal, each with it's own user interface. Each animal object has a `render` method to render it's own HTML and event handlers.

```JavaScript
function render(model) {
  return h('div',
    h('ul',
      model.animals.map(function (animal) {
        return h('li', animal.render(model));
      })
    ),
    h('h1', { style: { color: 'red' } }, model.sound? model.sound + '!': '')
  );
}

plastiq.append(document.body, render, {
  animals: [
    {
      name: 'Harry',
      render: function (model) {
        return [
          h('h3', 'Dog ' + this.name),
          h('button',
            {
              onclick: function () {
                return model.makeSound('woof');
              }
            },
            'bark'
          )
        ];
      }
    },
    {
      name: 'Bobo',
      render: function (model) {
        return [
          h('h3', 'Lion ' + this.name),
          h('button',
            {
              onclick: function () {
                return model.makeSound('roar');
              }
            },
            'roar'
          )
        ];
      }
    }
  ],
  makeSound: function (sound) {
    var self = this;
    return function (render) {
      self.sound = sound;
      render();

      setTimeout(function () {
        delete self.sound;
        render();
      }, 300);
    }
  }
});
```

Try it on [requirebin](http://requirebin.com/?gist=41d56a087b5f9fa7d062).

## Not Refreshing

By default the view will refresh after an event handler has run, however you can return `plastiq.html.norefresh` from an event handler to prevent this.

## Refreshing the view from the model

Sometimes you want to refresh the view at an arbitrary point, not just after a UI event. For this plastiq views can subscribe to events produced by the model.

### Refresh Function

You can refresh the view at any time by getting a **refresh** function. You can get this function from `plastiq.html.refresh`, and call it after the view has rendered, i.e. after an AJAX response.

**Note that just calling `plastiq.html.refresh()` will not work, please assign it to the model, or a local variable, then call it.**

```JavaScript
var refresh = plastiq.html.refresh;

// later

refresh();
```

This is because `plastiq.html.refresh` is only set during a render cycle. To call it, make sure you assign it to your model, or a local variable so you can call it later.

```JavaScript
function render(model) {
  model.refresh = h.refresh;

  return h('div',
    h('h1', 'my favourite color is'),
    model.color
      ? h('h2', model.color)
      : model.loading
        ? h('h2', 'loading...')
        : h('button', {
            onclick: function () {
              setTimeout(function () {
                model.color = 'red';
                model.refresh();
              }, 1000);
            }
          }, '?')
  );
}

plastiq.append(document.body, render, {});
```

```JavaScript
var refresh = plastiq.html.refresh;
refresh([component]);
```

* `refresh()` refreshes the whole UI for the attachment. (Other attached UIs aren't refreshed.)
* `refresh(component)` just refreshes the component. See [components](#components).

### Refreshify

Sometimes you have an event handler in another framework (e.g. jQuery) that modifies the model. You want to refresh the page after that event handler has executed. You can use `plastiq.html.refreshify(handler)` to return a new handler that refreshes the page after your event handler has run.

```js
var refreshHandler = h.refreshify(handler, [options]);
```

* `handler` - a function that handles some event, can return a promise.
* `options.refresh` - one of these values:
  * `true` - (the default) `refreshHandler` will refresh on return, and on promise fulfil if it returns a promise.
  * `false` - `refreshHandler` will be just `handler` so no refresh will happen if you call it.
  * `'promise'` - `refreshHandler` will only refresh if it returns a promise and only after the promise is fulfilled.
* `options.component` - only refresh this [component](#components)

### Binding

You can customise how bindings refresh the page by using `plastiq.html.binding()`.

```js
var binding = plastiq.html.binding(binding, options);
```

* `binding` - an array [model, 'property'], or a binding object {get(), set(value)}.
* `options` - options that are passed directly to [refreshify](#refreshify).

## Performance

Plastiq is usually very fast. It's based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) which has excellent performance, several times faster than React. See [these benchmarks](http://vdom-benchmark.github.io/vdom-benchmark/). However, if you have very large and interactive pages there are several strategies you can employ to speed things up.

* Consider only rendering a part of the page on certain events. For this, you can use a [component](#components) for the portion of the page you want to refresh, then return that component from the event handler.
* Consider using [key](#keys) attributes for large dynamic lists of elements. Key attributes allow the diffing engine to spot differences inside lists of elements in some cases massively reducing the amount of DOM changes between renders.
* For form inputs with bindings, especially text inputs that can refresh the page on each keypress, consider using `plastiq.html.binding()` to not refresh, or only refresh a component.
* Consider using a component with a `cacheKey`, to have finer control over when the component re-renders. You can reduce the total render time by not rendering portions of the page that don't change very often. When the `cacheKey` is changes from one render to the next, the component will be re-rendered. When it doesn't change, the component won't be re-rendered.
* Consider explicitly rendering a component when the model changes. You can set the `cacheKey` to something that never changes, such as just `true`, then use `plastiq.html.refresh(component)` to render it.

## Server-side Rendering

You can render plastiq components on the server-side using [vdom-to-html](https://github.com/nthtran/vdom-to-html):

```js
var h = require('plastiq').html;
var vdomToHtml = require('vdom-to-html');

var vdom = h('html',
  h('head',
    h('link', {rel: 'stylesheet', href: '/style.css'})
  ),
  h('body',
    h('h1', 'plastiq!')
  )
);

var html = vdomToHtml(vdom);
console.log(html);
```

Rendering will work with event handlers, components, etc.

The result, however, is plain static HTML without any event handlers or jQuery plugins attached. If you want to render plastiq views on the server and have them fully interactive in the browser, you'll need to re-attach the client-side plastiq view with the server-side rendered view. These rough steps should guide you:

1. Have the server render the HTML from a model with plastiq.
2. Have the server embed the model in the page, placing it into a global variable inside a `<script>` tag.
3. Have the client-side JS load that model and re-render the vdom _without_ event handlers, this should then be identical to the vdom produced by the server.
4. Have the client-side JS render the same model, but this time _with_ event handlers.
5. Compare the two DOMs, without and with event handlers, producing the changes necessary to insert the event handlers into the existing DOM.
6. Have hope.

# Common Errors

## Outside Render Cycle

> You cannot create virtual-dom event handlers outside a render function

This usually happens when you try to create virtual dom outside of a render function, which is ok, but if you try to add event handlers (`onclick` etc, or otherwise have attributes set to functions) then you'll see this error. This is because outside of the render cycle, there's no way for the event handlers to know which attachment to refresh - you could have several on a page at once.

Another cause of this error is if you have more than one instance of the plastiq module loaded. This can occur if you have an NPM listing like this:

```
my-app@1.0.0 /Users/bob/dev/my-app
├── plastiq@1.19.1
├── my-plastiq-component@1.0.0
│ ├── plastiq@1.19.1
```

With `my-plastiq-component` depending on another `plastiq`. Better to have `my-plastiq-component` have a `peerDependency` on plastiq, allowing it to use the `plastiq` under `my-app`.

## Refresh Outside Render Cycle

> Please assign plastiq.html.refresh during a render cycle if you want to use it in event handlers

This can occur if you use `plastiq.html.refresh`, or `h.refresh` outside of a render cycle, for example, in an event handler or after a `setTimeout`. This is easily fixed, take a look at [Refresh Function](#refresh-function).

# API

## Rendering the Virtual DOM

```JavaScript
var vdomFragment = plastiq.html(selector, [attributes], children, ...);
```

* `vdomFragment` - a virtual DOM fragment. This will be compared with the previous virtual DOM fragment, and the differences applied to the real DOM.
* `selector` - (almost) any selector, containing element names, classes and ids: `tag.class#id`, or small hierarchies `pre code`.
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `children` - any number of children, which can be arrays of children, strings, or other vdomFragments.

### The `binding` Attribute

Form input elements can be passed a `binding` attribute, which is expected to be either:

* An array with two items, the first being the model and second the field name, the third being an optional function called on the input when set, for example to convert a string into a number use `Number`.

  ```JavaScript
  [object, 'fieldName', convert]
  ```

* `object` - an object
* `fieldName` - the name of a field on `object`
* `convert` (optional) - a function called on the value when setting the model, i.e. `model.field = convert(value)`.

* An object with two methods, `get` and `set`, to get and set the new value, respectively.

  ```JavaScript
  {
    get: function () {
      return model.property;
    },
    set: function (value) {
      model.property = value;
    }
  }
  ```

### Event Handler `on*` Attributes

Event handlers follow the same semantics as normal HTML event handlers. They have the same names, e.g. `onclick`, `onchange`, `onmousedown` etc. They are passed an `Event` object as the first argument.

When event handlers complete, the entire page's virtual DOM is re-rendered. Of course only the differences will by applied to the real DOM.

#### Promises

If the event handler returns a [Promise](https://promisesaplus.com/), then the view is re-rendered after the promise is fulfilled or rejected.

## Raw HTML

**Careful of script injection attacks!** Make sure the HTML is trusted or free of `<script>` tags.

```JavaScript
var vdomFragment = plastiq.html.rawHtml(selector, [attributes], html);
```

* `selector` - (almost) any selector, containing element names, classes and ids. E.g. `tag.class#id`
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `html` - the element's inner HTML.

## Components

```JavaScript
var component = plastiq.html.component([eventHandlers], vdomFragment | renderFunction);
```

* `eventHandlers` - object containing:
  * `function onbeforeadd()` - invoked before the component is rendered for the first time, before `renderFunction`. This is a good place to setup state for the component.
  * `function onadd(element)` - invoked after the component has been rendered for the first time, the `element` being the top-most DOM element in the component.
  * `function onupdate(element)` - invoked after the component has been re-rendered, `element` being the top-most DOM element in the component.
  * `function onremove(element)` - invoked after the component has been removed from the DOM, `element` being the top-most DOM element in the component.
  * `detached` - a boolean indicating that the DOM element is moved during the `onadd` event. Defaults to `false`. Some jQuery components, especially dialogs, move the DOM element to another part of the DOM to aid in styling. If this is the case, use `detached: true` and plastiq will still be able to track it.
  * `cacheKey` - if truthy, the component will only update if it's different from the previous rendering of the component. If falsey, then the component will re-render normally with everything else.
  * any other fields you want to access from the handlers.

    The event handlers are all invoked with the same `this`, within the lifetime of the component. This means you can store state between events.
* `vdomFragment` - the vdom fragment to render as the component.
* `renderFunction` - a function that returns a vdom fragment of the component. This allows the component to be returned from event handlers to be refreshed independently from the rest of the page.
* `component` - a component which can be returned from any render function. With the `renderFunction` argument, this can be returned from an event handler to refresh just this component.

## Attaching to the DOM

```JavaScript
var attachment = plastiq.append(element, render, model, [options]);
var attachment = plastiq.append(element, modelWithRender, [options]);

var attachment = plastiq.replace(element, render, model, [options]);
var attachment = plastiq.replace(element, modelWithRender, [options]);
```

* `attachment` - the instance of the plastiq attachment, see below.
* `element` - any HTML element.
  * in the case of `plastiq.append` the view is added as a child via `element.appendChild(view)`
  * in the case of `plastiq.replace` the view replaces `element` via `element.parentNode.replaceChild(view, element)`
* `render` - the render function, called as `render(model)`, is called initially, then after each event handler. The `model` is passed as the first argument.
* `modelWithRender` - a model with a `.render()` method. This will be called as `model.render()` initially, and after each event handler.
* `model` - the model.
* `options`
  * `requestRender` - function that is passed a function that should be called when the rendering should take place. This is used to batch several render requests into one at the right time.

    For example, immediately:

    ```JavaScript
    function requestRender(render) {
      render();
    }
    ```
  
    Or on the next tick:
  
    ```JavaScript
    function requestRender(render) {
      setTimeout(render, 0);
    }
    ```
  
    Or on the next animation frame:
  
    ```JavaScript
    function requestRender(render) {
      requestAnimationFrame(render);
    }
    ```
  
    The default is `requestAnimationFrame`, falling back to `setTimeout`.
  
    For testing with [karma](http://karma-runner.github.io/) you should pass `setTimeout` because `requestAnimationFrame` is usually not called if the browser is out of focus for too long.

### Detach

```js
attachment.detach();
```

Detaches the rendering engine from the DOM. Note that this doesn't remove the DOM, just prevents any plastiq rendering events from modifying the DOM.

### Remove

```js
attachment.remove();
```

Destroys the DOM, running any `onremove` handlers found in components. This will remove the DOM element.
