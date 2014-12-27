# plastiq

* belle, simple et efficace

Plastiq is based on two primary programming ideas:

1. There is one model for the whole page, this model is stateful, object-oriented and free of framework elements.
2. The view is re-rendered fresh each time the model changes, but only the differences are applied to the DOM.

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
