# plastiq

Plastiq is based on a simple architecture for single page applications:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

This architecture is largely influenced by Facebook's [React](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching.

## Why?

React.js carried inside it an amazing idea: re-render the page anew every time the model changes, but only apply the differences since the last render. This is not only very efficient, but also affords a very simple programming model for user interfaces. The user interface is created from a function that takes only the model as input.

However, React's implementation is somewhat more complicated than this simple idea. React's component model, with its many lifecycle events such as `componentDidMount` and `componentWillReceiveProps` adds to a confusing landscape of interactions between your application and the framework. Furthermore, each React component carries two kinds of state: `this.props` and `this.state`. Many people are confused as to where to store and update the model, in the `props` or in the `state`? If you have several components in the page, we have several different places to store state, how do we reconcile and synchronise them?

Other frameworks such as [mithril](http://lhorie.github.io/mithril/) and [mercury](https://github.com/Raynos/mercury) try to get back to a simpler framework, but require the model to use framework elements such as `m.prop()` and `hg.value()` to implement model binding on form elements.

Plastiq is much simpler again: there is no "component model", but components are easily created by extracting or creating new render functions. Application state is stored in a single, although deep, model. The model can easily be bound onto form inputs, and without forcing the framework into the model.

# Example

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
