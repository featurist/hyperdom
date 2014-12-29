# plastiq

Plastiq is a framework for building dynamic user interfaces in HTML.

It leverages a simple architecture for single page applications:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

Plastiq is hugely influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching. Read the [philosophy and motivation](#philosophy-and-motivation).

# install

    npm install plastiq

Use either with browserify:

    var plastiq = require('plastiq');

Or from HTML, first create a symlink:

    ln -s node_modules/plastiq/plastiq.js public/plastiq.js

Then

    <script src="plastiq.js"></script>

# An Example

```JavaScript
var plastiq = require('plastiq');
var h = plastiq.html;
var bind = plastiq.bind;

function render(model) {
  return h('div',
    h('label', "what's your name?"), ' ',
    h('input', {type: 'text', binding: bind(model, 'name')}),
    h('div', 'hi ', model.name)
  );
}

plastiq.attach(document.body, render, {name: ''});
```

Try it on [requirebin](http://requirebin.com/?gist=1980d666f79b4a78f035).

# Features

## Rendering the View

The `render` function should take a model object and return a virtual DOM fragment. The render function **should not modify the model**, just return the view. It should not be relied upon to manipulate any state, this is because it can be called very frequently during user interaction, or very rarely if ever if the browser tab is not in focus.

```JavaScript
function render(model) {
  return h('span', 'hi ', model.name);
}
```

### Use Selectors

```JavaScript
h('span.name', 'hi ', model.name);
```

### Add HTML Attributes

```JavaScript
h('span', { style: { color: 'red' } }, 'name: ', model.name);
```

### Raw HTML

Insert raw unescaped HTML. Be careful! Make sure there's no chance of script injection.

```JavaScript
function render(model) {
  return h.rawHtml('div',
    {style: { color: 'red' } },
    'some dangerous <script>doTerribleThings()</script> HTML');
}
```

### Classes

* an string, e.g. `'item selected'`.
* an array - the classes will be all the items space delimited, e.g. `['item', 'selected']`.
* an object - the classes will be all the keys with truthy values, space delimited, e.g. `{item: true, selected: item.selected}`.

```JavaScript
h('span', { class: { selected: model.selected } }, 'name: ', model.name);
```

## Responding to Events

Pass a function to any `on*` event handler.

When the event handler has completed the view is automatically re-rendered.

If you return a promise, then the view is re-rendered when the promise resolves. You can also return a function to have more control over when rendering happens, see [animations](#animations).

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

plastiq.attach(document.body, render, { people: [] });
```

Play on [requirebin](http://requirebin.com/?gist=729964ebb9c31a2ec698)

## Binding the Inputs

This applies to `textarea` and input types `text`, `url`, `date`, `email`, `color`, `range`, `checkbox`, `number`, and a few more obscure ones. Most of them.

Use the `plastiq.bind` function, and the `binding` attribute to bind the model to a form input. When the binding changes the view is automatically re-rendered.

```JavaScript
function render(model) {
  return h('div',
    h('label', "what's your name?"),
    h('input', {type: 'text', binding: bind(model, 'name')}),
    h('div', 'hi ' + model.name)
  );
}

plastiq.attach(document.body, render, { name: '' });
```

Play on [requirebin](http://requirebin.com/?gist=2585872c1559007eef1f)

## Radio Buttons

Bind the model to each radio button. The buttons can be bound to complex (non-string) values.

```JavaScript
var blue = { name: 'blue' };

function render(model) {
  return h('div',
    h('input.red', {
      type: 'radio',
      name: 'colour',
      binding: bind(model, 'colour'),
      value: 'red'
    }),
    h('input.blue', {
      type: 'radio',
      name: 'colour',
      binding: bind(model, 'colour'),
      value: blue
    }),
    h('span', JSON.stringify(model.colour))
  );
}

plastiq.attach(document.body, render, { colour: blue });
```

## Select Dropdowns

Bind the model onto the `select` element. The `option`s can have complex (non-string) values.

```JavaScript
var blue = { name: 'blue' };

function render(model) {
  return h('div',
    h('select',
      {binding: bind(model, 'colour')},
      h('option.red', {value: 'red'}, 'red'),
      h('option.blue', {value: blue}, 'blue')
    ),
    h('span', JSON.stringify(model.colour))
  );
}

plastiq.attach(document.body, render, { colour: blue });
```

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

plastiq.attach(document.body, render, {
  filename: '(no file selected)',
  contents: ''
});
```

## Components and Controllers

Plastiq doesn't really have components like React or directives like AngularJS, nor does it have first class controllers. Instead the `render` functions can contain controller logic by responding to events and delegating to the model. The page can be broken down into reusable sections by extracting `render` functions that render different parts of the model. It's refreshingly simple, and reuses familar abstractions like functions and objects so all the usual refactoring techniques apply.

In the example below we have a `render` function and a `renderPerson` function. The `renderPerson` acts as a reusable component for rendering and handling interaction for each person.

```JavaScript
function render(model) {
  return h('div.content',
    h('h1', 'People'),
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
    h('input', {binding: bind(person, 'name')}),
    h('button',
      {
        onclick: function () { model.deletePerson(person); }
      },
      'delete')
  )
}

plastiq.attach(document.body, render, {
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

## Animations

An event handler can return a function that is passed a `render` function that can be called to request a re-render of the page when the model has been updated. This can be used to create animations that change the model and re-render the page.

Notice that the `render()` function only *requests* a re-render, which will happen at some point in the future but not immediately. Several calls to `render()` may only result in one actual render. See the `requestRender` option in [`plastiq.attach`](#plastiqattach) below.

```JavaScript
function render(model) {
  return h('div',
    h('button', {
      onclick: function () {
        return function (render) {
          setInterval(function () {
            model.n++;
            render();
          }, 100);
        };
      }
    }, 'Start'),
    h('div', 'n = ' + model.n)
  );
}

plastiq.attach(document.body, render, { n: 0 });
```

Play on [requirebin](http://requirebin.com/?gist=a51bffb7d591a1e0d2ca)

# API

## `plastiq.html`

```JavaScript
var vdomFragment = plastiq.html(selector, [attributes], children, ...);
```

* `vdomFragment` - a virtual DOM fragment. This will be compared with the previous virtual DOM fragment, and the differences applied to the real DOM.
* `selector` - (almost) any selector, containing element names, classes and ids. E.g. `tag.class#id`
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `children` - any number of children, which can be arrays of children, strings, or other vdomFragments.

## Event Handlers

Event handlers follow the same semantics as normal HTML event handlers. They have the same names, e.g. `onclick`, `onchange`, `onmousedown` etc. They are passed an `Event` object as the first argument.

When event handlers complete, the entire page's virtual DOM is re-rendered. Of course only the differences will by applied to the real DOM.

### Promises

If the event handler returns a [Promise](https://promisesaplus.com/), then the view is re-rendered after the promise is fulfilled or rejected.

### Animations

If the event handler returns a function, then that function will be called with a `render` function that can be called to re-render the page when the model has been updated.

## `plastiq.html.rawHtml`

Careful of script injection attacks! Make sure the HTML is trusted or free of `<script>` tags.

```JavaScript
var vdomFragment = plastiq.html.rawHtml(selector, [attributes], html);
```

* `selector` - (almost) any selector, containing element names, classes and ids. E.g. `tag.class#id`
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `html` - the element's inner HTML.

## `plastiq.bind`

Form input elements can be passed a `binding` attribute, which is expected to be an object with two methods: `get` to get the current binding value, and `set` to set it. For example:

    {
      get: function () {
        return model.property;
      },
      set: function (value) {
        model.property = value;
      }
    }

The `plastiq.bind` function is shorthand for this, creating a new binding for the model and property name:

```JavaScript
var binding = plastiq.bind(model, propertyName);
```

* `model` - the object
* `propertyName` - the name of the property

## `plastiq.attach`

```JavaScript
plastiq.attach(element, render, model, [options]);
```

* `element` - any HTML element. The view is attached via `element.appendChild(view)`
* `render` - the render function, is called initially, then after each event handler. The `model` is passed as the first argument.
* `model` - the model.
* `options`
  * `requestRender` - function that is passed a function that should be called when the rendering should take place. This is used to batch several render requests into one at the right time, for example, immediately:

  ```JavaScript
  function requestRender(fn) {
    fn();
  }
  ```

  Or on the next tick:

  ```JavaScript
  function requestRender(fn) {
    setTimeout(fn, 0);
  }
  ```

  Or on the next animation frame:

  ```JavaScript
  function requestRender(fn) {
    requestAnimationFrame(fn);
  }
  ```

  The default is `requestAnimationFrame`, falling back to `setTimeout`.

  For testing with [karma](http://karma-runner.github.io/) you should pass `setTimeout` because `requestAnimationFrame` is usually not called if the browser is out of focus for too long.

# Philosophy and Motivation

React introduced an amazing idea: re-render the page anew every time the model changes, but only apply the differences since the last render. This is not only very efficient, but also affords a very simple programming model for user interfaces. The user interface is created from a function that takes only the model as input.

However, React's implementation is somewhat more complicated than this simple idea. React's component model, with its many lifecycle events such as `componentDidMount` and `componentWillReceiveProps` adds to a confusing landscape of interactions between your application and the framework. Furthermore, each React component carries two kinds of state: `this.props` and `this.state`. Many people are confused as to where to store and update the model, in the `props` or in the `state`? If we have several components in the page, we have several different places to store state, how do we reconcile and synchronise them?

Other frameworks such as [mithril](http://lhorie.github.io/mithril/) and [mercury](https://github.com/Raynos/mercury) try to get back to a simpler framework, but require the model to use framework elements such as `m.prop()` and `hg.value()` to implement model binding on form elements.

Plastiq is much simpler again: there is no "component model", but components are easily created by extracting or creating new render functions. Application state is stored in a single, although deep, model. The model can easily be bound onto form inputs, and without forcing the framework into the model.
