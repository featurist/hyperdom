(function () {
  var h = plastiq.html;

  function startExamples() {
    var codeElements = Array.apply(undefined, document.querySelectorAll('pre code.language-JavaScript'));
    var demos = codeElements.filter(function (c) {
      return c.textContent.indexOf('plastiq.append') > 0;
    });

    demos.forEach(function (code) {
      attachEditor(code.parentNode, code.textContent);
    });
  }

  $.get('https://wzrd.in/standalone/prote@latest', function(data) {
    var module = {
      exports: {}
    };

    new Function('module', 'exports', data)(module, module.exports);
    console.log(module.exports);
  });

  startExamples();

  function aceify(textarea, options) {
    var editor = ace.edit(textarea);
    if (options.theme) {
      editor.setTheme("ace/theme/" + options.theme);
    }
    if (options.mode) {
      editor.getSession().setMode("ace/mode/" + options.mode);
    }
    editor.setDisplayIndentGuides(false);
    editor.$blockScrolling = Infinity;
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    editor.setOptions({
          maxLines: Infinity
    });
    return editor;
  }

  function renderAceEditor(options, text) {
    var binding = plastiq.binding(options.binding);
    return h.component(
      {
        key: options.key,
        onadd: function (element) {
          var self = this;
          this.binding = binding;
          this.text = binding.get();

          var editor = aceify(element, options);
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
        append: function (element, r, m) {
          model = m;
          render = r;
        },
        html: plastiq.html
      };

      function fakeRequire() {
        return fakePlastiq;
      }

      function parseExample(example) {
        var match = /^((.|\n)*plastiq\s*\.\s*append\s*\(\s*[a-z_$.]+\s*,\s*[a-z_$.]+\s*,\s*)((.|\n)*)(\);)\s*$/.exec(example);

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
      return h('div.example',
        {
          class: { original: !model.edited, edited: model.edited }
        },
        model.edited
          ? h('button.restore',
              {
                key: 'restoreButton',
                onclick: function () {
                  var parsedSource = parseSource(source);
                  model.source = parsedSource;
                  model.sourceText = parsedSource.generate(true);
                  delete model.edited;
                }
              },
              'restore')
          : undefined,
        renderAceEditor(
          {
            key: 'editor',
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
                model.edited = true;
                model.sourceText = value;
                try {
                  model.source = parseSource(value);
                } catch (e) {
                  return h.norefresh;
                }
              }
            },
            mode: 'javascript',
            theme: 'tomorrow_night_blue'
          }
        ),
        model.source.error
          ? h('div.error', {key: 'error'}, model.source.error.message)
          : h('div.render', {key: 'render'}, model.source.render(model.source.model))
      );
    }

    var parsedSource = parseSource(source);
    plastiq.replace(element, render, {source: parsedSource, sourceText: parsedSource.generate(true)});
  }
})();
