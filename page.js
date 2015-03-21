var plastiq = require('plastiq');
var h = plastiq.html;
var prettyprint = require('js-object-pretty-print');
var detective = require('detective');

var modules = {
  plastiq: { exports: plastiq }
};

function startExamples() {
  var codeElements = Array.apply(undefined, document.querySelectorAll('pre code.language-JavaScript'));
  var demos = codeElements.filter(function (c) {
    return c.textContent.indexOf('plastiq.append') > 0;
  });

  demos.forEach(function (code) {
    attachEditor(code.parentNode, code.textContent);
  });
}

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
  editor.setOption("showPrintMargin", false);
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

function loadModule(name) {
  if (!modules.hasOwnProperty(name)) {
    return $.get('https://wzrd.in/standalone/' + name + '@latest').then(function(data) {
      var module = {
        exports: {}
      };

      new Function('module', 'exports', data)(module, module.exports);
      modules[name] = module;
    }, function (error) {
      modules[name] = false;
    });
  }
}

function attachEditor(element, source) {
  var refresh;

  function parseSource(source) {
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

    function loadModules(source) {
      var modulesRequired = detective(source);
      modulesRequired.forEach(function (r) {
        var promise = loadModule(r);
        if (promise) {
          promise.then(refresh, refresh);
        }
      });

      var modulesNotLoaded = modulesRequired.filter(function (m) {
        return !modules.hasOwnProperty(m);
      });

      var modulesNotFound = modulesRequired.filter(function (m) {
        return modules[m] === false;
      });

      if (modulesNotFound.length) {
        if (modulesNotFound.length == 1) {
          throw new Error('module ' + modulesNotFound[0] + " doesn't exist");
        } else {
          throw new Error('modules ' + modulesNotFound.join(', ') + " don't exist");
        }
      } else if (modulesNotLoaded.length) {
        return 'modules ' + modulesNotLoaded.join(', ') + ' still loading';
      }
    }

    function attach(sourceFunction) {
      var attachment;

      var fakePlastiq = {
        append: function (element, r, m) {
          attachment = {
            render: r,
            model: m
          };
        },
        html: plastiq.html
      };

      function fakeRequire(name) {
        if (name === 'plastiq') {
          return fakePlastiq;
        } else if (modules.hasOwnProperty(name)) {
          return modules[name].exports;
        }
      }

      sourceFunction(fakeRequire, fakePlastiq, fakePlastiq.html);

      return attachment;
    }

    function render(model) {
      try {
        var loading = loadModules(source);
        if (loading) {
          return {
            loading: loading
          }
        } else {
          var render = attach(sourceFunction).render;
          return {
            vdom: render(model)
          }
        }
      } catch(e) {
        return {
          error: e
        };
      }
    }

    var loading, sourceFunction, model, error;

    try {
      sourceFunction = new Function('require', 'plastiq', 'h', source);
      model = attach(sourceFunction).model;
    } catch (e) {
      error = e;
    }

    var exampleComponents = parseExample(source);

    return {
      render: render,
      model: model,
      modelSource: exampleComponents.model,
      error: error,
      loading: loading,
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
    refresh = h.refresh;

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
          theme: 'tomorrow'
        }
      ),
      model.source.error
        ? h('div.error', {key: 'error'}, model.source.error.message)
        : (function () {
            var result = model.source.render(model.source.model);
            if (result.error) {
              return h('div.error', {key: 'error'}, result.error.message);
            } else if (result.loading) {
              return h('div.loading', {key: 'loading'}, result.loading);
            } else {
              return h('div.render', {key: 'render'}, result.vdom);
            }
          })()
    );
  }

  var parsedSource = parseSource(source);
  plastiq.replace(element, render, {source: parsedSource, sourceText: parsedSource.generate(true)});
}
