var Widgets;

if (typeof Set === 'function') {
  Widgets = Set;
} else {
  Widgets = function() {
    this.widgets = [];
  };

  Widgets.prototype.add = function(widget) {
    if (this.widgets.indexOf(widget) == -1) {
      this.widgets.push(widget);
    }
  };

  Widgets.prototype.delete = function(widget) {
    var i = this.widgets.indexOf(widget);
    if (i !== -1) {
      this.widgets.splice(i, 1);
    }
  };

  Widgets.prototype.forEach = function(fn) {
    for(var n = 0; n < this.widgets.length; n++) {
      fn(this.widgets[n]);
    }
  };
}

module.exports = Widgets;
