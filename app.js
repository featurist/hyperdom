(function () {
  var h = plastiq.html;

  function startExamples() {
    var codeElements = Array.apply(undefined, document.querySelectorAll('pre code.language-JavaScript'));
    var demos = codeElements.filter(function (c) {
      return c.textContent.indexOf('plastiq.attach') > 0;
    });

    demos.forEach(function (code) {
      var pre = code.parentNode;

      var editorElement = document.createElement('div');
      editorElement.className = 'plastiq-editor';

      pre.parentNode.replaceChild(editorElement, pre);

      attachEditor(editorElement, code.textContent);
    });
  }

  startExamples();

  function aceify(textarea, mode) {
    var editor = ace.edit(textarea);
    editor.setTheme("ace/theme/molokai");
    editor.getSession().setMode("ace/mode/" + mode);
    editor.renderer.setShowGutter(false);
    return editor;
  }

  function renderAceEditor(options, text) {
    var binding = plastiq.binding(options.binding);
    return h.component(
      {
        onadd: function (element) {
          var self = this;
          this.binding = binding;
          this.text = binding.get();

          var editor = aceify(element, options.mode);
          this.document = editor.getSession().getDocument();
          this.document.setValue(this.text);

          this.document.on('change', function () {
            if (!self.settingValue) {
              self.text = self.document.getValue();
              self.binding.set(self.text);
            }
          });

          this.editor = editor;
        },
        onupdate: function (element) {
          this.binding = binding;
          var newText = binding.get();
          if (this.text != newText) {
            this.text = newText;
            this.settingValue = true;
            try {
              this.document.setValue(this.text);
            } finally {
              delete this.settingValue;
            }
          }
        }
      },
      h('pre')
    );
  }

  function attachEditor(element, source) {
    function parseSource(source) {
      var model;
      var render;

      var fakePlastiq = {
        attach: function (element, r, m) {
          model = m;
          render = r;
        },
        html: plastiq.html
      };

      function fakeRequire() {
        return fakePlastiq;
      }

      function parseExample(example) {
        var match = /^((.|\n)*plastiq\s*\.\s*attach\s*\(\s*[a-z_$.]+\s*,\s*[a-z_$.]+\s*,\s*)((.|\n)*)(\);)\s*$/.exec(example);

        if (match) {
          return {
            before: match[1],
            model: match[3],
            after: match[5]
          }
        }
      }

      var error;
      try {
        new Function('require', 'plastiq', 'h', source)(fakeRequire, fakePlastiq, fakePlastiq.html);
      } catch (e) {
        error = e;
      }

      var exampleComponents = parseExample(source);

      return {
        render: render,
        model: model,
        modelSource: exampleComponents.model,
        error: error,
        generate: function (model) {
          if (model && !error) {
            this.modelSource = prettify(this.model);
          }
          return exampleComponents.before + this.modelSource + exampleComponents.after;
        }
      };
    }

    function prettify(object) {
      return prettyprint.pretty(object, 2, undefined, true).trim();
    }

    function render(model) {
      return h('div',
        renderAceEditor(
          {
            binding: {
              get: function () {
                model.sourceText;
                function modelSourceSameAsModel() {
                  try {
                    return prettify(model.source.model) == prettify(new Function('return ' + model.source.modelSource + ';')());
                  } catch (e) {
                    return false;
                  }
                }

                if (modelSourceSameAsModel()) {
                  return model.source.generate();
                } else {
                  return model.source.generate(true);
                }
              },
              set: function (value) {
                model.sourceText = value;
                try {
                  model.source = parseSource(value);
                } catch (e) {
                  return h.norefresh;
                }
              }
            },
            mode: 'json'
          }
        ),
        model.source.error
          ? h('div.error', model.source.error.message)
          : h('div.render', model.source.render(model.source.model))
      );
    }

    var parsedSource = parseSource(source);
    plastiq.attach(element, render, {source: parsedSource, sourceText: parsedSource.generate(true)});
  }
})();
