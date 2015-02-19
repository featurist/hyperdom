# plastiq

Plastiq is a framework for building dynamic user interfaces in HTML.

It leverages a simple architecture for single page applications:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

Plastiq is hugely influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching. Why not React? Read the [philosophy and motivation](#philosophy-and-motivation).

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

# Features

## Rendering the View

The `render` function should take a model object and return a virtual DOM fragment. The render function **should not modify the model**, just return the view. It should not be relied upon to manipulate any state, this is because it can be called very frequently during user interaction, or very rarely if ever if the browser tab is not in focus.

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
      h('option.red', {value: 'red'}, 'red'),
      h('option.blue', {value: blue}, 'blue')
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
            onadd: function (element) {
              // element is the <div>component contents</div>
              // you may want to add jQuery plugins here

              // you can store state in `this`, and it will
              // be present in subsequent event handlers
              // in fact, the `this` is the same object
              // for each event handler, across all view refreshes
              this.someProperty = 'some value';

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
      h('button', {onclick: function () { model.counter++; return component; }}, 'refresh component')
    ),
    h('div',
      h('button', {onclick: function () { model.counter++; }}, 'refresh page')
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
          h('button', {onclick: function () { return model.makeSound('woof'); }}, 'bark')
        ];
      }
    },
    {
      name: 'Bobo',
      render: function (model) {
        return [
          h('h3', 'Lion ' + this.name),
          h('button', {onclick: function () { return model.makeSound('roar'); }}, 'roar')
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
        self.sound = undefined;
        render();
      }, 300);
    }
  }
});
```

Try it on [requirebin](http://requirebin.com/?gist=41d56a087b5f9fa7d062).

## Animations

An event handler can return a function that is passed a `render` function that can be called to request a re-render of the page when the model has been updated. This can be used to create animations that change the model and re-render the page.

Notice that the `render()` function only *requests* a re-render, which will happen at some point in the future but not immediately. Several calls to `render()` may only result in one actual render. See the `requestRender` option in [`plastiq.append`](#plastiqappend) below.

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

plastiq.append(document.body, render, { n: 0 });
```

Play on [requirebin](http://requirebin.com/?gist=641b92c81d69300a4277)

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

### Promises

If your model uses promises, your view can represent the different states of the promise: pending, fulfilled or rejected. This allows your view to render accordingly a loading spinner, the result, or indeed an error if one ocurrs.

```JavaScript
function render(model) {
  return h.promise(model.longRunningOperation, {
    pending: 'loading...',
    fulfilled: function (value) {
      return 'the value from the long-running operation is: ' + value;
    }
  });
}

plastiq.append(document.body, render, {
  longRunningOperation: new Promise(function (fulfill) {
    setTimeout(function () {
      fulfill('bananas');
    }, 1000);
  })
});
```

Play on [requirebin](http://requirebin.com/?gist=9cca2ce4ef8044b8592b)

### Animations

Another option is to use an animation. The animation is started as soon as the view HTML is displayed, then the model can refresh the page several times during the animation.

```JavaScript
function render(model) {
  return h('div',
    h.animation(model.animation.bind(model)),
    h('div', model.counter)
  );
}

plastiq.append(document.body, render, {
  animation: function (refresh) {
    var self = this;

    setTimeout(function () {
      self.counter++;
      refresh();
      setTimeout(function () {
        self.counter++;
        refresh();
        setTimeout(function () {
          self.counter++;
          refresh();
        }, 500);
      }, 500);
    }, 500);
  },

  counter: 0
});
```

Play on [requirebin](http://requirebin.com/?gist=15d9e47fe0f906a522b2)

# API

## Rending the Virtual DOM

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

#### Animations

If the event handler returns a function, then that function will be called with a `render` function that can be called to re-render the page when the model has been updated.

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
  * `function onadd(element)` - invoked after the component has been rendered for the first time, the `element` being the top-most DOM element in the component.
  * `function onupdate(previous, element)` - invoked after the component has been re-rendered, `previous` being the previous state of the component, `element` being the top-most DOM element in the component.
  * `function onremove(element)` - invoked after the component has been removed from the DOM, `element` being the top-most DOM element in the component.

    The event handlers are all invoked with the same `this`, within the lifetime of the component. This means you can store state between events.
* `vdomFragment` - the vdom fragment to render as the component.
* `renderFunction` - a function that returns a vdom fragment of the component. This allows the component to be returned from event handlers to be refreshed independently from the rest of the page.
* `component` - a component which can be returned from any render function. With the `renderFunction` argument, this can be returned from an event handler to refresh just this component.

## Attaching to the DOM

```JavaScript
plastiq.append(element, render, model, [options]);
plastiq.replace(element, render, model, [options]);
```

* `element` - any HTML element.
  * in the case of `plastiq.append` the view is attached via `element.appendChild(view)`
  * in the case of `plastiq.replace` the view is attached via `element.parentNode.replaceChild(view, element)`
* `render` - the render function, is called initially, then after each event handler. The `model` is passed as the first argument.
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

# Philosophy and Motivation

React introduced an amazing idea: re-render the page anew every time the model changes, but only apply the differences since the last render. This is not only very efficient, but also affords a very simple programming model for user interfaces. The user interface is created from a function that takes only the model as input.

However, React's implementation is somewhat more complicated than this simple idea. React's component model, with its many lifecycle events such as `componentDidMount` and `componentWillReceiveProps` adds to a confusing landscape of interactions between your application and the framework. Furthermore, each React component carries two kinds of state: `this.props` and `this.state`. Many people are confused as to where to store and update the model, in the `props` or in the `state`? If we have several components in the page, we have several different places to store state, how do we reconcile and synchronise them?

Other frameworks such as [mithril](http://lhorie.github.io/mithril/) and [mercury](https://github.com/Raynos/mercury) try to get back to a simpler framework, but require the model to use framework elements such as `m.prop()` and `hg.value()` to implement model binding on form elements.

Plastiq is much simpler again: there is no "component model", but components are easily created by extracting or creating new render functions. Application state is stored in a single, although deep, model. The model can easily be bound onto form inputs, and without forcing the framework into the model.
