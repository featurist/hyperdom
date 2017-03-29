var hyperdomMeta = require('./meta');
var render = require('./render');

function Component(model, options) {
  var currentRender = render.currentRender();

  this.isComponent = options && options.hasOwnProperty('component') && options.component
  this.currentRender = currentRender;
  this.model = model;
  this.key = model.renderKey;
  this.component = undefined;
  this.mount = currentRender.mount;
}

Component.prototype.type = 'Widget';

Component.prototype.init = function () {
  var self = this;

  var vdom = this.render();

  var meta = hyperdomMeta(this.model);
  meta.components.add(this);

  this.component = this.currentRender.mount.createDomComponent()
  var element = this.component.create(vdom);

  if (self.model.onbeforeadd) {
    self.model.onbeforeadd()
  }

  if (self.model.onbeforeadd) {
    self.model.onbeforerender()
  }

  if (self.model.onadd || self.model.onrender) {
    this.currentRender.finished.then(function () {
      if (self.model.onadd) {
        self.model.onadd(self.component.element);
      }
      if (self.model.onrender) {
        self.model.onrender(self.component.element);
      }
    });
  }

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

function beforeUpdate(model, element) {
  if (model.onbeforeupdate) {
    model.onbeforeupdate(element)
  }

  if (model.onbeforerender) {
    model.onbeforerender(element)
  }
}

function afterUpdate(model, element, oldElement) {
  if (model.onupdate) {
    model.onupdate(element, oldElement);
  }

  if (model.onrender) {
    model.onrender(element, oldElement);
  }
}

Component.prototype.update = function (previous) {
  var self = this;

  if (this.isComponent) {
    var keys = Object.keys(this.model);
    for(var n = 0; n < keys.length; n++) {
      var key = keys[n];
      previous.model[key] = self.model[key];
    }
    this.model = previous.model;
  }


  if (self.model.onupdate || self.model.onrender) {
    this.currentRender.finished.then(function () {
      afterUpdate(self.model, self.component.element, oldElement)
    });
  }

  this.component = previous.component;
  var oldElement = this.component.element

  beforeUpdate(this.model, oldElement)

  var element = this.component.update(this.render());

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

Component.prototype.render = function () {
  return this.mount.renderComponent(this.model);
};

Component.prototype.refresh = function () {
  var oldElement = this.component.element

  beforeUpdate(this.model, oldElement)
  this.component.update(this.render());
  afterUpdate(this.model, this.component.element, oldElement)
};

Component.prototype.destroy = function (element) {
  var self = this;

  var meta = hyperdomMeta(this.model);
  meta.components.delete(this);

  if (self.model.onbeforeremove) {
    self.model.onbeforeremove(element)
  }

  if (self.model.onremove) {
    this.currentRender.finished.then(function () {
      self.model.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = Component;
