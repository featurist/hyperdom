# plastiq

Plastiq is a framework for building dynamic user interfaces in HTML.

It leverages a simple architecture for single page applications:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

Plastiq is hugely influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching. Read the [philosophy and motivation](#philosophy-and-motivation).

# An Example

    var plastiq = require('plastiq');
    var h = plastiq.html;
    var bind = plastiq.bind;

    function render(model) {
      return h('div',
        h('label', "what's your name?"),
        h('input', {type: 'text', model: bind(model, 'name')}),
        h('span', 'hi ', model.name)
      );
    }

    plastiq.attach(document.body, render, {name: ''});

Try it on [requirebin](http://requirebin.com/?gist=1980d666f79b4a78f035).

# Features

## Rendering the View

The **render** function should take a **model** and return a virtual DOM fragment:

    function render(model) {
      return h('span', 'hi ', model.name);
    }

### Use Selectors

    h('span.name', 'hi ', model.name);

### Add HTML Attributes

    h('span', { style: { color: 'red' } }, 'name: ', model.name);

## Responding to Events

    function render(model) {
      return h('div', 
        h('ol',
          model.people.map(function (person) {
            return h('li', person.name);
          })
        ),
        h('button', {
          onclick: function () {
            model.people.push({name: 'somebody'});
          }
        }, 'Add Person')
      );
    }

    plastiq.attach(document.body, render, { people: [] });

When the event handler has completed the view is automatically re-rendered.

## Binding the Inputs

    function render(model) {
      return h('div',
        h('label', "what's your name?"),
        h('input', {type: 'text', model: bind(model, 'name')}),
        h('span', 'hi ', model.name)
      );
    }

    plastiq.attach(document.body, render, { name: '' });

When the binding changes the view is automatically re-rendered.

## Animations

An event handler can return a function that is passed a `render` function that can be called to re-render the page when the model has been updated. This can be used to create animations that change the model and re-render the page.

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
        }, 'Start')
        h('span', 'n = ', model.n)
      );
    }

    plastiq.attach(document.body, render, { n: 0 });

# API

## `plastiq.html`

    `var vdomFragment = plastic.html(selector, [attributes], children, ...)`

* `vdomFragment` - a virtual DOM fragment. This will be compared with the previous virtual DOM fragment, and the differences applied to the real DOM.
* `selector` - (almost) any selector, containing element names, classes and ids. E.g. `tag.class#id`
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `children` - any number of children, which can be arrays of children, strings, or other vdomFragments.

## Event Handlers

When event handlers have completed the entire page's virtual DOM is re-rendered. Of course only the differences will by applied to the real DOM.

### Promises

If the event handler returns a [Promise](https://promisesaplus.com/), then the view is re-rendered after the promise is fulfilled or rejected.

### Animations

If the event handler returns a function, then that function will be called with a `render` function that can be called to re-render the page when the model has been updated.

## Model Binding

Form input elements can be passed a `model` attribute, which is expected to be a function. The function will be invoked in two ways.

To get the current value of the model property:

    var modelValue = attributes.model();

* `modelValue` - the function should return the current value of the model property.

To set the new value of the model property:

    attributes.model(newModelValue);

* `newModelValue` - the new value from the form input element.

The `plastiq.bind` function can be used to create such a binding function:

    `attributes.model = plastiq.bind(model, propertyName)`

* `model` - the object
* `propertyName` - the name of the property

# Philosophy and Motivation

React introduced an amazing idea: re-render the page anew every time the model changes, but only apply the differences since the last render. This is not only very efficient, but also affords a very simple programming model for user interfaces. The user interface is created from a function that takes only the model as input.

However, React's implementation is somewhat more complicated than this simple idea. React's component model, with its many lifecycle events such as `componentDidMount` and `componentWillReceiveProps` adds to a confusing landscape of interactions between your application and the framework. Furthermore, each React component carries two kinds of state: `this.props` and `this.state`. Many people are confused as to where to store and update the model, in the `props` or in the `state`? If you have several components in the page, we have several different places to store state, how do we reconcile and synchronise them?

Other frameworks such as [mithril](http://lhorie.github.io/mithril/) and [mercury](https://github.com/Raynos/mercury) try to get back to a simpler framework, but require the model to use framework elements such as `m.prop()` and `hg.value()` to implement model binding on form elements.

Plastiq is much simpler again: there is no "component model", but components are easily created by extracting or creating new render functions. Application state is stored in a single, although deep, model. The model can easily be bound onto form inputs, and without forcing the framework into the model.
