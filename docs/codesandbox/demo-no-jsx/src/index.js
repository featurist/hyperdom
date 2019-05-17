const hyperdom = require('hyperdom')
const h = require('hyperdom').html

class App {
  render() {
    return h('div.content',
      h('h1', 'hello!')
    )
  }
}

hyperdom.append(document.body, new App());
