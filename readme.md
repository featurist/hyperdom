# plastiq

Plastiq is a framework for building dynamic user interfaces in HTML.

It leverages a simple architecture for single page applications:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

Plastiq is hugely influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching. Read the [philosophy and motivation](#philosophy-and-motivation).

# An Example

```JavaScript
var plastiq = require('plastiq');
var h = plastiq.html;
var bind = plastiq.bind;

function render(model) {
  return h('div',
    h('label', "what's your name?"), ' ',
    h('input', {type: 'text', model: bind(model, 'name')}),
    h('div', 'hi ', model.name)
  );
}

plastiq.attach(document.body, render, {name: ''});
```

Try it on [requirebin](http://requirebin.com/?gist=1980d666f79b4a78f035).

# Features

## Rendering the View

The **render** function should take a **model** and return a virtual DOM fragment:

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

## Responding to Events

Pass a function to any `on*` event handler.

When the event handler has completed the view is automatically re-rendered.

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

Use the `plastiq.bind` function, and the `model` attribute to bind the model to a form input. When the binding changes the view is automatically re-rendered.

```JavaScript
function render(model) {
  return h('div',
    h('label', "what's your name?"),
    h('input', {type: 'text', model: bind(model, 'name')}),
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
      model: bind(model, 'colour'),
      value: 'red'
    }),
    h('input.blue', {
      type: 'radio',
      name: 'colour',
      model: bind(model, 'colour'),
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
      {model: bind(model, 'colour')},
      h('option.red', {value: 'red'}, 'red'),
      h('option.blue', {value: blue}, 'blue')
    ),
    h('span', JSON.stringify(model.colour))
  );
}

plastiq.attach(document.body, render, { colour: blue });
```

## File Inputs

The file input is much like any other binding, except that the model is only ever written to, never read from. The file input can only be set by a user selecting a file.

```JavaScript
function render(model) {
  return h('div',
    h('input',
      {
        type: 'file',
        model: function (file) {
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

## Animations

An event handler can return a function that is passed a `render` function that can be called to re-render the page when the model has been updated. This can be used to create animations that change the model and re-render the page.

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
Play on [requirebin](http://requirebin.com/?gist=a51bffb7d591a1e0d2ca)
```

# API

## `plastiq.html`

```JavaScript
var vdomFragment = plastic.html(selector, [attributes], children, ...)
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

## Model Binding

Form input elements can be passed a `model` attribute, which is expected to be a function. The function will be invoked in two ways.

To get the current value of the model property:

```JavaScript
var modelValue = attributes.model();
```

* `modelValue` - the function should return the current value of the model property.

To set the new value of the model property:

```JavaScript
attributes.model(newModelValue);
```

* `newModelValue` - the new value from the form input element.

The `plastiq.bind` function can be used to create such a binding function:

```JavaScript
attributes.model = plastiq.bind(model, propertyName);
```

* `model` - the object
* `propertyName` - the name of the property

# Philosophy and Motivation

React introduced an amazing idea: re-render the page anew every time the model changes, but only apply the differences since the last render. This is not only very efficient, but also affords a very simple programming model for user interfaces. The user interface is created from a function that takes only the model as input.

However, React's implementation is somewhat more complicated than this simple idea. React's component model, with its many lifecycle events such as `componentDidMount` and `componentWillReceiveProps` adds to a confusing landscape of interactions between your application and the framework. Furthermore, each React component carries two kinds of state: `this.props` and `this.state`. Many people are confused as to where to store and update the model, in the `props` or in the `state`? If we have several components in the page, we have several different places to store state, how do we reconcile and synchronise them?

Other frameworks such as [mithril](http://lhorie.github.io/mithril/) and [mercury](https://github.com/Raynos/mercury) try to get back to a simpler framework, but require the model to use framework elements such as `m.prop()` and `hg.value()` to implement model binding on form elements.

Plastiq is much simpler again: there is no "component model", but components are easily created by extracting or creating new render functions. Application state is stored in a single, although deep, model. The model can easily be bound onto form inputs, and without forcing the framework into the model.
