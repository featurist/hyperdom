## Hyperdom Applications

A Hyperdom application is simply an object that contains a `render()` method which returns the desired HTML for your application in its current state. This HTML can contain event handlers which modify the application state, after which `render()` is called again to reflect the new HTML. Underneath we use virtual-dom, which ensures that the DOM is updated incrementally, applying only the changes since the last render so it's incredibly fast.

The result is that we can write applications that have a simple relationship between our application data, the HTML on the page and how the page changes when the user interacts with it.

Here's an example:

```jsx
const hyperdom = require('hyperdom');

class App {
  constructor() {
    this.name = 'Sally'
  }

  render() {
    return <div>
      <label>what's your name?</label>
      <input type="text" binding="this.name" />
      <div>hi {this.name}</div>
    </div>;
  }
}

hyperdom.append(document.body, new App());
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6CGTkwAHigBWcO0RClK1CrQ9wKTKRl5JSYAXiYuAEcAVwguAAoAckDZBUVEgEoAbkZGfCgMODgmAEF2diYGZiZfClxo_AoSXHiMytUWCnEIOBQyDEUYMKZEgGUMKChJRNVtMlUuG1lW9uqWLgpo3GYAHjkIADcAPg7RHYLsKCOTcQwKROLJEi2mfsGAfh2LC5wTtbPrOxov4KNIYKE2FQ7BQ2Ew0NZ9mQAOYQkBdHp9AYwWEWP6iM77Y7dSro3pvGCaL6EvFnCzUnLVOZzRgpYKKFAYcrUOTxBT4aKDSjoEhySR6V4wEylcqtbI6fQcDD4ADWGCRMCccHIbg8VBoiDoqjYcHwuAg7F4_FW-ONFAwuBhSFYIBMMDQ7CVyoAtLYDl7zLgDrI2HpTmw0LEoHIrWxXe7PSpGaHqmxbDIlmR8BB4FaqjaQKy0jGQAUqH5Eyx9EaQL6ACIwdO2TPZvhOvOiNgAAUwlwspC4xdL8EdyfzPZwXqgJAwtlwg7uw5DYcMWAnnG4FC9haU87LI-X-RgGDIXrjHpVXvYUGiSOsu8XIFHHfcRUn09n9_Lj-X4goiigp5uue3pXjed5OmwQ5fk-YggH4kiwG-M7BhBJYLtBy5ngmqFQfu_yxkBnpevkECfnh-ZYRevr-rIQZzjh6GOrMWjygYcDHnIaAkA4HiQEimrasg7jkHq3gGu2kIwIoV4LsWZAitiIAsWQugGJRyooLxED8c4OoiV4PjkH4TAel0wxRLECSJKZ4iZHkRn-AAEn-UAAOqESqAAK163sw4QWXEMBJL-_6AfGF6gb5dmZg5lRMAAwrAx7ueFyreWBzCaOZMAxIFSSHseYXAZePnWNFjCKCK0SwCg9jsM0vDDO2lW2AIiS-jgJDsIK9xPr6TQkFAbUwAcEz-s8BAwF6iicokT5eLgkhtSgFhGKYAZWEsDjOHNqjPBQQIUAI7YsJAsDkm1EY2DVO0wSZdziAINkoFwWpQEG8QAPqffs2xYuKiRrWYshzSM-x-NFlZPq9g1Bsdpz2HqcAQEZAiCIkmqgxjzh2IkGhJqokXWHAaOnGQkoJUlZApcB6W-a0d3k1Kzn_jTnp09Y8TABQEAULAbWOWCbJMPWlWJJoGSqGoT4tdVMDw_89SwCTQinCwJ34kwe4CBY9D0JqdjvAAJBYd34tE5iXauAFTshuAzP8UNq9amudMOOt65pRQm2bogW_LquO5rGuuywtuzm18GIeHIPO_iVZB_iIehzHuBtfgr6p7tiea11POoy7oea7LysCHU0TYjn8dx6IcxF_jrt16IDdMEy8qaJoQA" target="_blank" rel="noopener noreferrer">Run this example</a>

This works with [babel-preset-hyperdom](https://github.com/featurist/babel-preset-hyperdom), see [JSX](#jsx) for more details.

Here we have a class `App`, that contains a `render()` method. We define the HTML (or virtual-dom), including an `input` element that is bound onto the model with `binding="this.name"`, this means that the app's `name` property is used to populate the `<input>`, and conversely, whenever the user types something into the `<input>`, they change `name`. The name is constantly rendered into the HTML with `hi {this.name}`.

Finally, we attach the application onto the DOM using `hyperdom.append`, which appends the application's top-level DOM element to the HTML document's body.

Larger applications will typically have several classes or objects like this in a hierarchical structure to handle different parts of the page, or to encapsulate different application logic. Here we have an application that shows an article and a login component:

```jsx
const hyperdom = require('hyperdom');
const httpism = require('httpism');

class App {
  constructor() {
    this.article = new Article()
    this.login = new Login()
  }

  render() {
    return <div>
      {this.login}
      {this.article}
    </div>
  }
}

class Article {
  onload() {
    return httpism.get('/content').then(content => {
      this.content = content
    })
  }

  render() {
    if (this.content) {
      return <div class="article">{this.content}</div>
    } else {
      return <div class="article loading"></div>
    }
  }
}

class Login {
  login() {
    ...
  }

  logout() {
    ...
  }

  render() {
    if (this.user) {
      <div class="user">
        <div class="user_name">{this.user.name}</div>
        <button onclick={() => this.logout()}>logout</button>
      </div>
    } else {
      return <div>
        <input type="text" binding={[this, 'username']} />
        <input type="password" binding={[this, 'password']} />
        <button onclick={() => this.login()}>login</button>
      </div>
    }
  }
}

hyperdom.append(document.body, new App());
```

This works with [babel-preset-hyperdom](https://github.com/featurist/babel-preset-hyperdom), see [JSX](#jsx) for more details.

## The Render Method

The `render` method returns a virtual DOM fragment. As a general rule, the render method does not modify the state of the model and returns the same VDOM fragment for the same model state.

The virtual-dom can be generated using regular JavaScript or JSX

### JS

The JavaScript virtual-dom API has some niceties for generating classes and IDs.

```js

class App {
  render() {
    return h('div.content',
      h('h1', 'hello!')
    )
  }
}

hyperdom.append(document.body, new App());
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQeggDsATGADwDoArBZEAYwyIBcZWlHm4WACACwCeABzwkMAW14BeXmhgBHAK4R5ACgDkQ0WnESNASgA6RJkR4CZcxSvVaRYyYcr8WEqCZMMoAQzhxeAEFhYV5gE15rUjw1AzCIyOsWJTQiAU0SCAA3SjM2Vg0AGgTE9K0ARiLeLRgoKAwAQkMS3mM03gBfEy6iE21HCUofEPYSNXEGJQl2FkoUDBJBQt4iGCwgkNiDAG4TEA7CkGEfBgBrHwBzGBo4ZiRQPJnOcPajEDgGNAhhFjg3xHi7Uibx4PjQLH-vDeWBgKGOZwAtGQsgjcGgsng3sUgVCQCgVFASJDobD4ac3gkDgk3mRRNFTBB4JCXqU3v1dJJiSBfGweBT2lTXiBkQARGB0sgMplIQGsxiwHxEBEwuEnU4I4RQJQXYhcnnwCEgbFy1zuZWktUarU63oyt76vlGlok1VnPU-XmG42JF1khHeCDuz1Y50gFV-5GovAYtBBg38yI9Hr7Q5wRUkeZUMyQC43O70R4cRAgFm4tgSTUemBcogLasgbp7A5hi1nXLMHM3e5cVhPYtmCzHFj8KzyZSqGCaIf8Zqmbh8AASbigAHVW6cAArW4ijmwTzSmqDm13qzXa4izgd8YC8ADCCqIa5PW_PaQ6u_Hdm8MEVx79Z5tWcTAkBYlFgSgKGEDBwQCWRSxAsgAQ0ZFagwYRpgKb1kRYDAMCgJCYCyHwj1uFIGBgBEJGGIoEhmNBBCQyh8HQbA0UIaIqFoGj2gwJQWGEPiAVLSJIFgIgfGmJD8VIcCuO9SJpwBadKHkW4oAxNQAH1NMyVIJJgZYNBYnA8CqZCIB4WdE29VS8IxISWgofI4AgbgAQAbQ0G4NAAXUpb0AOIOAPJaVZ1nvH9H3XF8bVieSVjWXgl3cJ8yRi4g1GAFgIBYWAkIXBwOSkMUQI0Do2kiPyiGTDpaqAA" target="_blank" rel="noopener noreferrer">Run this example</a>

### JSX

You can write JSX using [babel](https://babeljs.io/) with [babel-preset-hyperdom](https://github.com/featurist/babel-preset-hyperdom). This uses `hyperdom.jsx` as the JSX pragma and [babel-plugin-transform-jsx-hyperdom-binding](https://github.com/featurist/babel-plugin-transform-jsx-hyperdom-binding) for binding syntax. JSX actually performs faster than `hyperdom.html` because JSX is a slightly less flexible form of virtual-dom.

```jsx
const hyperdom = require('hyperdom');

class App {
  render() {
    return <div class="content">
      <h1>hello!</h1>
    </div>
  }
}
```

### SVG (or XML more generally)

Hyperdom will interpret XML if it contains an `xmlns` attribute. This includes regular XML behaviour like declaring and using namespaces. Note that JSX itself doesn't support `namespace:tag` syntax, so you can use an alternative syntax with `--` instead, for e.g. `namespace--tag`.

```jsx
const hyperdom = require('hyperdom')

class Circle {
  render() {
    return <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="red" stroke-width="4" fill="yellow" />
    </svg>
  }
}
```

Rendering SVG supports all the same DOM events and interaction you'd expect from hyperdom.

## Events

There are two primary ways to respond to user events in Hyperdom, the first most basic form is to set an `on*` event handler such as `onclick` on a VDOM element, just as you would in HTML. For example, to handle a button click, you can write:

```jsx
<button onclick={() => this.doSomething()}>do something</button>
```

The event handler can then modify the model, or start an AJAX download, or whatever is required to respond to the user. Immediately after the event handler has run, the page is re-rendered to reflect the new state of the application. In the case of asynchronous operations, like AJAX, you can return a promise from the event handler, and the page will re-render once more when the promise is resolved.

A common scenario works like this:

1. Render the VDOM with an event handler on `onclick`
2. The VDOM is patched into the HTML
3. The user clicks on the element
4. The event handler is executed, modifies the model as necessary and optionally returns a promise of an asynchronous operation (for example, if the event handler performs AJAX)
5. The view is re-rendered reflecting the new changes to the model
6. If the event handler returns a promise, wait for it to resolve
7. Re-render the model once more to reflect the changes from the asynchronous operation

### Re-rendering the view

Notice that the whole view is re-rendered after each event. This is because it's common for one part of the page to modify the model in such a way that other parts of the page change too, and you shouldn't have to think about which parts of the view need to be re-rendered after a model change. It's possible to do this because Hyeprdom is extremely quick and it's very rare for this approach to cause performance issues, even on mobile, and even for large complex applications, but for some types of application where there is a lot of data on a page, it can be useful to look for performance optimisations, see [performance](#performance) for details.

### Bindings

The second mechanism for handling events is more specialised and represents a very typical usecase for `<input>` elements. You want the input's value to represent the model, but you also want to change the model if the user interacts with the input. For this we introduce a `binding` attribute:

```jsx
<input type="text" binding="this.name"/>
```

which is shorthand for:

```jsx
<input type="text" binding={[this, 'name']}/>
```

The binding attribute does two things, it allows the VDOM to get the current value of the model (the model's `name` in this case), but also set it when the user types something in the text box. Both of these syntaxes above actually end up resolving to an object with two methods: `set` and `get`, and so are equivalent to:

```jsx
<input type="text" binding={
  {
    get: () => this.name,
    set: (value) => this.name = value
  }
}/>
```

This binding object with `set` and `get` can be used to to handle additional logic when the model is read or written to by a binding. The `get` method is called when rendering the VDOM, the `set` method is called with the new value when the user interacts with the input.

Alternatively you can implement the binding logic yourself, by setting the input's value and responding to `onchange` event:

```jsx
<input type="text" value={this.name} onchange={e => this.name = e.target.value}/>
```

Hyperdom bindings handle `onchange` events like this of course, but also other events such as those for copy and paste, and work across a constiety of browsers, so it's recommended to use bindings where possible.

## Routing

The router for Hyperdom supports History API or Hash URLs, and is capable of two-way binding with route parameters, and supports nesting of views.

First we define some routes:

```js
const router = require('hyperdom/router')

const routes = {
  home: router.route('/'),
  posts: router.route('/posts'),
  post: router.route('/posts/:id')
}
```

These routes can be used in constious places, including as `hrefs` in anchors:

```jsx
<a href={routes.post.href({id: post.id})}>{post.title}</a>
```

The application can render the routes by implementing a `routes()` function, which returns an array of route definitions:

```jsx
class App {
  routes() {
    return [
      home({
        render: () => <h2>home</h2>
      })
    ]
  }
}
```

And finally start the application with the router:

```js
hyperdom.append(document.body, new App(), {router: router})
```

Here's a slightly more realistic application that renders all three routes:

```jsx
class App {
  constructor() {
    this.posts = new Posts()
  }

  routes() {
    return [
      home({
        render: () => <h2>home</h2>
      }),

      this.posts
    ]
  }

  renderLayout(content) {
    return <div>
      <h1>our app</h1>
      {content}
    </div>
  }
}
```

When we're on `/` we render `<h2>home</h2>`, but nest it in a div with `<h1>our app</h1>`. This way we can have a consistent page layout no matter what route we're on. Finally, `App` defers to `Posts` for the remaining routes:

```jsx
class Posts {
  constructor() {
    this.posts = []
  }

  async onload() {
    this.posts = await httpism.get('/posts')
  }

  routes() {
    return [
      posts({
        render: () => <div>
          {
            this.posts.map(post => (
              <a href={routes.post.href({id: post.id})}>{post.title}</a>
            ))
          }
        </div>
      }),

      post({
        bindings: {
          id: [this, 'postId']
        },

        render: () => {
          const post = this.posts[this.postId]

          if (post) {
            return <article>
              <h1>{post.title}</h1>
              {post.content}
            </article>
          } else {
            <div>loading...</div>
          }
        }
      })
    ]
  }
}
```

Here `Posts` defines two routes, the first one simply lists the posts available with links, the second displays the post selected. We use `bindings` to define how the route parameter in `/posts/:id` is mapped onto the model as `this.postId`. We also have some conditional logic to render either a loading page or the article itself.

### Component Methods

* `routes()` returns an array of routes or components. Routes define how the route is rendered, components can themselves have `routes()` methods defining more routes.
* `renderLayout(content)` - can be used to wrap HTML around what is returned by the rendered route, such as headers and footers. `content` is the VDOM returned by rendering the route.

### Route Definitions

#### isActive

You can check whether the current URL is on a route by using `route.isActive(params)`. This comes in two forms: if you pass parameters to `isActive()` then those parameters must match the current URL, if you don't pass params then any URL that matches the route's pattern is considered active.

```js
const article = router.route('/article/:id')
const home = router.route('/')

// while on /article/5
article.isActive() === true
article.isActive({id: 5}) === true

article.isActive({id: 10}) === false
home.isActive() === false
```

#### url

```js
const article = router.route('/article/:id')
article.url({id: 5, page: 3}) === '/article/5?page=3'
```

#### params

```js
const article = router.route('/article/:id')

// when on /article/5?page=3
article.params() === {id: '5', page: '3'}

// when on /elsewhere
article.params() === undefined

article.params('/article/10') === {id: '10'}
```

#### push

```js
const article = router.route('/article/:id')

// push history, resetting scroll to 0, 0
article.push({id: 5})

// push history, without scroll reset
article.push({id: 5}, {resetScroll: false})
```

#### replace

```js
const article = router.route('/article/:id')

// replace history, only in push state
article.replace({id: 5})
```

### Route Options

```js
const article = router.route('/article/:id')

class App {
  routes() {
    return [
      article({
        render: () => ...,
        onload: (params) => ...,
        push: { ... },
        push: (oldParams, newParams) => ...,
        bindings: { ... },
        redirect: (params) => ...,
      })
    ]
  }
}
```

Each route definition can contain the following methods:

* `render()` - renders the route. If the component contains `renderLayout(content)`, then the output from the route `render()` will be passed as `content` to the component's `renderLayout(content)` method.
* `onload(params)` - is called when the user navigates to the route, `params` is an object containing the parameters extracted from the route.
* `bindings` - an object containing bindings keyed on the parameter names in the route. These two-way bindings are used to update the URL when the model changes, or to change the model if the URL changes.
* `push` - an object containing parameter names set to `true` if changes to those parameters should cause a new URL to be set using `history.pushState`, otherwise the new URL is set using `history.replaceState`.

    For example: `push: {id: true}` would cause a new URL to be pushed on to history if the model changes in such a way that `:id` changes in the route.

* `push(oldParams, newParams)` - a function that is called if any of the bindings cause the URL to change, if the function returns true, then the new URL is set using `history.pushState`, otherwise the new URL is set using `history.replaceState`.
* `redirect(params)` - return a URL to redirect to, `params` is an object containing the parameters extracted from the route.

### Router Options

You can create new router with different options:

```js
const hyperdomRouter = require('hyperdom/router')
const router = hyperdomRouter.router(options)
```

Where `options` can contain:

* `querystring` - an object that contains `stringify(params)` and `parse(querystring)` methods, the `qs` module or Node's `querystring` module are good options. By default Hyperdom uses a very simple (and small) query string parser and stringifier that works for basic values like strings and numbers, but for complex objects you'll see `%5Bobject%20Object%5D` in your query string.
* `history` - defaults to `router.pushState()` for History API routing. Specify `router.hash()` for hash-style routing. `router.memory()` can be used for testing.
* `baseUrl` - can be used to make all routes relative to this base URL path

### Not Found

You can render something if none of the routes match the URL by using `router.notFound()`:

```jsx
class App {
  routes() {
    return [
      routes ...

      router.notFound((path, routes) => ...)
    ]
  }
}
```

Where

* `path` - the current path as found in the address bar
* `routes` - the list of routes found in the application, these can be used to show which routes are available

## Components

Components are the basic building blocks of a Hyperdom application. The simplest component is an object that contains just a `render()` method. However, components can be used to interact with HTML at a more basic level, such as when using jQuery plugins, or to cache rendering output for performance.

There are two types of components in Hyperdom, with the only difference being where they store their state. The first type, and by far the most common, are **model components** and store their state in the model, or quite often, they _are_ the model. The point of **model components** is that the lifetime of their state is completely independent of whether those components are rendered or not. With **model components** the application is entirely in control of its state.

The other type are **view components** and keep their state in the view only, this means that if the component disappears from view, the state is lost and you'll have to rebuild it again when the component comes back into view. This is advantageous for some types of UI components that need to store state as the user interacts with them, like menus or tabs for example, but don't really affect the underlying model or state of the application itself.

Nevertheless, the API for view and model components is almost entirely the same. They both respond to the same rendering cycle events and have the same rendering and caching logic.

Components allow the following:

1. **Rendering VDOM** - essential to any Hyperdom application
2. **Model Loading** - asynchronously loading model resources
3. **HTML rendering events** - useful for low-level HTML hacking, including jQuery plugins
4. **VDOM caching** - useful in apps that render very large amounts of HTML

Components can implement these methods:

* `render()` - returns the VDOM representation of the component, called on each rendering cycle
* `onload()` (optional) - called when the component is first rendered, this can be used to setup the component, or load resources from AJAX. If this returns a promise, the view will be re-rendered again after the promise is resolved.
* `renderKey` (optional) - used for efficient diffing of virtual-dom elements, see [keys](#keys).
* `renderCacheKey()` (optional) - returns the cache key for the component. If the cache key hasn't changed since the last render, then the VDOM from the last render is used, otherwise, if the cache key has changed, `render()` is called for the latest VDOM.
* `onbeforeadd()` (optional) - called before the component is first added to the VDOM tree
* `onadd(element)` (optional) - called after the component is first added to the VDOM tree. `element` is the top-most HTML element of the component (the one returned from `render()`).
* `onbeforeupdate(element)` (optional) - called before the component is updated with new VDOM. `element` is the top-most HTML element of the component (the one returned from `render()`).
* `onupdate(element, oldElement)` (optional) - called after the component is updated with new VDOM. `element` is the top-most HTML element of the component (the one returned from `render()`). `oldElement` is the previous element represented by the component, and could be the same as `element`.
* `onbeforerender([element])` (optional) - called before the component is added to the VDOM tree, or updated with new VDOM. `element`, present only on update, is the top-most HTML element of the component (the one returned from `render()`).
* `onrender(element, [oldElement])` (optional) - called after the component is added to the VDOM tree, or updated with new VDOM. `element`, present only on update, is the top-most HTML element of the component (the one returned from `render()`). `oldElement` is the previous element represented by the component, and could be the same as `element`.

### Model Components

Model components are simply just plain objects that implement `render()` and some of the methods above. They are rendered by simply placing them in the VDOM:

```jsx
const component = {
  render() {
    return <h1>model component</h1>
  }
}

<div>{component}</div>
```

### View Components

View models are rendered by passing an object that implements `render()` to `hyperdom.viewComponent()`. You can also declare a class containing a `render()` method, and refer to it in JSX.

Using `hyperdom.viewComponent()`:

```jsx
<div>{
  hyperdom.viewComponent({
    render() {
      return <h1>view component</h1>
    }
  })
}</div>
```

Using a view component class in JSX:

```jsx
class MyComponent {
  constructor(properties, children) {
    this.title = properties.title
    this.children = children
  }

  render() {
    return <div>
      <h1>{this.title}</h1>
      {this.children}
    </div>
  }
}

<div>
  <MyComponent title="value">
    <div>child element</div>
  </MyComponent>
</div>
```

If you define fields on the object, these fields are present on each render: `this.name` is the latest value of `name`.

```jsx
<div>{
  hyperdom.viewComponent({
    name: name,
    render() {
      return <h1>view component {this.name}</h1>
    }
  })
}</div>
```

However, if you want to initialise some state once when the component is first rendered, then use it and update it during the lifetime of the component, use `onload()`, in this case `this.name` is the value of `name` when the component was first rendered.

```jsx
<div>{
  hyperdom.viewComponent({
    onload() {
      this.name = name
    },

    render() {
      return <h1>view component {this.name}</h1>
    }
  })
}</div>
```

## Caching

To cache the output from `render()`, return a non-undefined cache key from `renderCacheKey()`. This is useful if the component renders something large, for example, in the 10s of thousands of HTML nodes. For example, the following will only re-render when `this.version` changes:

```jsx
const component = {
  constructor () {
    this.version = 0
  }

  renderCacheKey () {
    return this.version
  }

  render () {
    return <div>
      ...
    </div>
  }
}
```

## Not Refreshing

By default the view will refresh after an event handler has run, however you can return `hyperdom.norefresh()` from an event handler to prevent this.

## Refreshing the view explicitly

Sometimes you want to refresh the view but not just after a UI event. For this, a component has a small handful of methods

* `component.refresh()` - can be called to queue up a refresh of the entire view. Calling this multiple times will only invoke one refresh, normally on the next animation frame.
* `component.refreshImmediately()` - can be called to refresh the view immediately.
* `component.refreshComponent()` - can be called to queue up a refresh of just this component.

## Refreshify

Sometimes you have an event handler in another framework (e.g. jQuery) that modifies the model. You want to refresh the page after that event handler has executed. You can use `hyperdom.html.refreshify(handler)` to return a new handler that refreshes the page after your event handler has run.

```js
const refreshHandler = h.refreshify(handler, [options]);
```

* `handler` - a function that handles some event, can return a promise.
* `options.refresh` - one of these values:
  * `true` - (the default) `refreshHandler` will refresh on return, and on promise fulfil if it returns a promise.
  * `false` - `refreshHandler` will be just `handler` so no refresh will happen if you call it.
  * `'promise'` - `refreshHandler` will only refresh if it returns a promise and only after the promise is fulfilled.
* `options.component` - only refresh this [component](#components)

## Binding

You can customise how bindings refresh the page by using `hyperdom.html.binding()`.

```js
const binding = hyperdom.html.binding(binding, options);
```

* `binding` - an array [model, 'property'], or a binding object {get(), set(value)}.
* `options` - options that are passed directly to [refreshify](#refreshify).

## Server-side Rendering

You can render HTML as text, for example on the server, by using `toHtml`:

```js
const hyperdom = require('hyperdom')
const h = hyperdom.html;
const toHtml = require('hyperdom/toHtml');

const vdom = h('html',
  h('head',
    h('link', {rel: 'stylesheet', href: '/style.css'})
  ),
  h('body',
    h('h1', 'hyperdom!')
  )
);

const html = toHtml(vdom);
console.log(html);
```

## Using with Typescript

All of the above functionality (with the exception of string bindings - e.g. `binding="this.name"`) is available and is reasonably well typed. Type definitions come bundled with hyperdom npm package - there is no need to install a separate types package.

In order to plug in hyperdom into the typescirpt tsx compilation, add the following settings to the `compilerOptions` section of `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom"],
    "jsx": "react",
    "jsxFactory": "hyperdom.jsx"
  }
}
```

### Render component

```tsx
import * as hyperdom from "hyperdom";

class App extends hyperdom.RenderComponent {
  private name: string;

  render() {
    return (
      <div>
        <label>what's your name? </label>
        <input type="text" binding={[this, "name"]} />
        <div>hi {this.name} </div>
      </div>
    );
  }
}

hyperdom.append(document.body, new App());
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQeggDsATGADwDoAXOcpUAYwyOplaRAgFsAHDNNQAEAKiEBDOEIAWAT154SGbkLCYVAHRByFaJdy0BuDUROMokqQEFevIRTakpOxcsoAldmTQBhZfyJ2YWATISFeNAgAN3E2ISJxbhhEIThqSKIAc2NTIjC0LzwACgBKIRC8sKEC6gBXNDyi0KqwgB4SaIA-Zpa2ixQYKE6saViAcilZDHr4xJgAfiFW_H7B7srepeJeWuFqeRgAXi02cmotIRRiDqzD4ABtamkIOAAaIS0EpK0AXQBfIT4dabNodKKdZ7lJ4vShfGAA5Zg4G9RFdHpCEo5MJ_Ew43IuPRucS2LxFJSMWpJViUFAYEiyd6BLBCGy8UqYkwgP6vEC8cSMADW4kyMEoACs4CwGCBmKwgpwKmFPnMtCktCLqABaNLiQQwEia4gQLW0LSvZpaOCMSK8U1Icroy3UXXne1aLAwFB8wWashRbV4KJ4M2OkAoWrQEiqj4gD1e_kCrTNbkWkBkBSkdiMCDwaOKqpaAn6aNaABMlAAjJQAAxJyopypaP0AERgGbIRGzuft-aVMtg4iImrj3oFmt4UFqmWIJZAFjYaRDGxjjDgcE1UAw4m8s_n8Fd5uXheo3Cgw89o_Hk-npjdc9i-6XLSdslgG63O7ve8XIEPz5AtDvtuwZfg-P5_gWAEHFaNqumq94LgeoYjgmu5gUhR6xheCaauYEBoYhT6QShPp-gGaBBmgBGPiAya4lyPJwIOJC0lQsqQJk4qSkQ0qyo41AKqmbB8Hus5EHSMB1niDEAVaLAcVxUrIDKLD8YJjYqXw0B4AA8raEAsHAeahpK9SMDAACyxLRuktQwBBfZQBAKDRvc6J9vAABsRH_sWtHLj8DkxhK5CzgU_IYf-IUAGIRQIsizkWbghT5MZpJEjBwUItmSfW9Hclh8aCpQ7EQJxEq8ap8qICpRBpOEsTSEIhzVDAACOEYFEUYx8k8YwlGYhnCAAEieUAAOrYYKAAK17EM1rUdRAXVjNIY3nkVY4TlOxD9YNdXBEIPgDkQk2bbNO15ACLUFEtK3mDAg4bZe203ntuTcHStSwJQFD8IIUgtfmn1kCkYx-oMGC8FS1BjBBfrUBgGBQGDMAxGeploOZmrcMScPNEEaCyGDlD4Og2C4AQ1wUDQcD45U0zUDs1ApL2qjaXCYPhqQP0SvTLS9dIKSC5QBSSlAQZFAA-lLHQNHM7xjOTOB4HDQjgy8sMDfWEFi8jQas-iDjsHABl1Sk9xjFxatW7QNu0-QYw_MmEGvcQcAW-iTJHSdZ2jhdN6lEF3ujaefsJgHxBFMA1DGrAYPDQchIqK2n1jH82thIFzQg99yQOsuaB5x7QhucuYRsy0iEpPgGgaA78wACT4EFLS1Lghvl70m7AWgYOAT33hjO5VR4psDabJXVTV4CdclWuzet1U7f52XIJVFPmyD3gYNpK-MBAUPI8tBP68F2fVTb336uruuV_8xfQhQ7Hhmd4_VS57AJc5cfvRj2f_9NjOy7oAoQwDsS4k5H8aBQA" target="_blank" rel="noopener noreferrer">Run this example</a>

### Router components

```tsx
import * as hyperdom from "hyperdom";
import * as router from "hyperdom/router";

const home = router.route("/");

class Thing extends hyperdom.RoutesComponent {
  tech = "hyperdom";

  routes() {
    return [
      home({
        render: () => {
          return <div>Hello from {this.tech}</div>;
        }
      })
    ];
  }
}

hyperdom.append(document.body, new Thing(), {router});
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQeggDsATGADwDoAXOcpUAYwyOplaRAgFsAHDNNQAEAKiEBDOEIAWAT154SGbkLCYVAHRByFaJdy0BuDUR79BoiVMwBXNmlXqhWnYuX5b9oyZPMicYWllGCEAXiFPPEpIgAotfC0ASmMiXyhJKQAVaWIAcyEKNlIpVz1lSgAlDDt4AGFlfiJ2YWATISE2Rmkw5215NwMQFLaI6rY4GMShVqJ29rQYahs0WYBtEbmZYJiZzc2F0jxEIUmwgD5pjb35xeXZgB4SCAA3M4AJGCgoDEdlaeocnAaDAugBfe74J6vFLXdqgq5wxJXAC6MKE8KIGJMpX0lHEvAUpBiSkYNm4zUoKAwJFkABohE0sEJsnlJvTgJE0KDkiYQKDaSBeOJGABrcS5GCUABWcBYDBAfiK1E4u16RHE5K0xy0EuoAFoAuJBDASHriBB9bQtLSRlo4Iw0BBeFakJdZnM7dQjdQtb0sDAUELRXqyM8DXhnnhrVctCgbNASL6tP7A8KRVoRvzbSAyISyERGBB4L7Ve0XP0yoNtSAAEyUACMlAADBn3Vn3VpQwARGB59iF4uu0u9RiwcREPUpoMivW8KA2XLEJMgdLjH0gG3ussKuBwPXfcRkNDL1fwdebzYuajcKCTgPT2fzxepV1aU8BaNb3oBWSwfcYQ8o1fFdxDXT9LxAWh_0A49gPfc8Y0g_p7UdZ0T1As9wI9EApzTdCwI3RDcODUcIHwzDCK_ZN7zTEMYDDXA0EjWDq3g1s4RMUE-QFOBxxIKkqD8SBcmlWUiHlRVmhVbM2D4U9lyIakYFbDFuMg-0WGE0S5WQBUWCVaSOz0vhoDwAB5Z0IBYOAS0Q2VlkYGAAFl8V9ag0BsGAL2wqAIBQX11i_bd4AANiwiD9HYuZkW87cZXIZcFmFBCqJAeKADFkoEWRlxxcp4vC793IgRh12OdzPMzTi1OIkVKCEiARJlCT9KkxA9P8YQhQBHoFgAR3jBYYgAcm66RhqRAtrOEN5rygAB1GjRQABSfYhepgAaICG4bpDmu9U2DOcF2ICbfGm6YhFqMciEWw6RVWk7ZlBDatp20cYHHA6H2O58ztSIhuGpGxYEoChzFoHpVSBshjmG0NPgwXhyVYYbvNDagMAwKA4fo8Rb3stBHL1bh8TRkZmjQWQ4cofB0GwRjCEOKhaHJ90xl4OxjmHSBYHVck4bjUhQZlNnNjG44xuieBscjGIAH15aeFYNS8oRhvpnA8DR9WngCf64W8hZZSgSNuauQp2DgKz_GOVZhtEnWHdZ-lnboYbkUzbzfuIOA7auRkrpuu7p0e582QDmAmVmm8Q7TMPiB2agLVgOG3grfQhB7IHhu5EYYpGGGQZgc2vw82A_aEQLrmHTY12OBINBoOgAH4ABJ8FivYbFwUvYTmA8jzhqDB-1hE5gxa52xr8f2nroRG_q3cO67zYe5LqvZ7mWvYVHtA4Z_P89-GrfDdPt1-82Pe4cYXdoKPMXL_aJHk-svun7mIuK_KjzlKC2FJ6X0AdcT2_9gFCFARxTEvJQSwKAA" target="_blank" rel="noopener noreferrer">Run this example</a>

## Performance

Hyperdom is usually very fast. It's based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) which has excellent performance, several times faster than React. See [these benchmarks](http://vdom-benchmark.github.io/vdom-benchmark/). However, if you have very large and interactive pages there are several strategies you can employ to speed things up.

* Consider only rendering a part of the page on certain events. For this, you can use a [component](#components) for the portion of the page you want to refresh, then return a component or an array of components from the event handler.
* Consider using [key](#keys) attributes for large dynamic lists of elements. Key attributes allow the diffing engine to spot differences inside lists of elements in some cases massively reducing the amount of DOM changes between renders.
* For form inputs with bindings, especially text inputs that can refresh the page on each keypress, consider using `hyperdom.html.binding()` to not refresh, or only refresh a component.
* Consider using a component with a `renderCacheKey()` method, to have finer control over when the component re-renders. You can reduce the total render time by not rendering portions of the page that don't change very often. When the `renderCacheKey()` result changes from one render to the next, the component will be re-rendered. When it doesn't change, the component won't be re-rendered.
* For parts of the page that don't ever change, you can pre-render the VDOM statically once and return the same VDOM on each render.

## Debugging

### Chrome Plugin

[https://chrome.google.com/webstore/detail/hyperdom-inpector/pggnlghflkefenflladfgkbcmfnjkcle](https://chrome.google.com/webstore/detail/hyperdom-inpector/pggnlghflkefenflladfgkbcmfnjkcle)

### File Names and Line Numbers

By using [transform-react-jsx-source](http://babeljs.io/docs/plugins/transform-react-jsx-source/) hyperdom will generate `data-file-name` and `data-line-number` attributes pointing to the file that generated the DOM.

```jsx
render() {
  return <h1>{this.title}</h1>
}
```

Will generate

```html
<h1 data-file-name="/full/path/to/file.jsx" data-line-number="40">Title</h1>
```

## Production Build

Debugging features and deprecation warnings can be turned off for production builds. Hyperdom source code checks the `NODE_ENV` environment constiable, and when set to `production` will turn these features off.

To make a production build with webpack, use `webpack -p`.

To make a production build with browserify, use [envify](https://github.com/hughsk/envify) and ensure `NODE_ENV=production`, for e.g. `browserify -t [ envify --NODE_ENV production  ] ...` and then use a minifier like [uglify](https://github.com/mishoo/UglifyJS2) to strip the disabled code.

## Common Errors

### Outside Render Cycle

> You cannot create virtual-dom event handlers outside a render function

This usually happens when you try to create virtual dom outside of a render function, which is ok, but if you try to add event handlers (`onclick` etc, or otherwise have attributes set to functions) then you'll see this error. This is because outside of the render cycle, there's no way for the event handlers to know which attachment to refresh - you could have several on a page at once.

Another cause of this error is if you have more than one instance of the hyperdom module loaded. This can occur if you have an NPM listing like this:

```
my-app@1.0.0 /Users/bob/dev/my-app
├── hyperdom@1.19.1
├── my-hyperdom-component@1.0.0
│ ├── hyperdom@1.19.1
```

With `my-hyperdom-component` depending on another `hyperdom`. Better to have `my-hyperdom-component` have a `peerDependency` on hyperdom, allowing it to use the `hyperdom` under `my-app`.

### Refresh Outside Render Cycle

> Please assign hyperdom.html.refresh during a render cycle if you want to use it in event handlers

This can occur if you use `hyperdom.html.refresh`, or `h.refresh` outside of a render cycle, for example, in an event handler or after a `setTimeout`. This is easily fixed, take a look at [Refresh Function](#refresh-function).

## Development

To get started:

```js
git clone https://github.com/featurist/hyperdom.git
cd hyperdom
npm install
```

Some of the scripts below assume that you have `node_modules/.bin` in your `$PATH`.

### Building

`hyperdom.js` and `hyperdom.min.js` can be build using `npm run build`, these can then be used in a `<script src="..."></script>` tag.

### Automated Testing

Hyperdom is almost 100% tested with karma and mocha. If you're planning to submit a pull request, we kindly ask that you write a test that demonstrates that it works. Without tests, we can't guarantee that your feature will continue to work as we refactor the codebase.

Tests can be found in [test/browser/hyperdomSpec.js](https://github.com/featurist/hyperdom/blob/master/test/browser/hyperdomSpec.js).

You can run karma by running `karma start`, it will watch your files and rerun the tests every time they change.

Server-side tests can be found in [test/server](https://github.com/featurist/hyperdom/tree/master/test/server). You can use `mocha test/server` to run these.

To run all tests use `npm test`.

### Manual Testing

As much as automated testing is amazing, it can never really replace manual or exploratory testing. You may want to experiment with an API or see how hyperdom performs in a real project, while making changes to hyperdom as you go.

To do this, first go to the `hyperdom` directory and run `npm link`. This will make hyperdom available to other projects.

Then inside your other project run `npm link hyperdom`. When your project has `require('hyperdom')` it will be referring to your local version.

You can then use [browserify](https://github.com/substack/node-browserify): `browserify myapp.js > myappbundle.js` or [watchify](https://github.com/substack/watchify): `watchify myapp.js -dvo myappbundle.js`, or [amok](https://github.com/caspervonb/amok): `amok --compiler babel --browser chrome myapp.js`, or [beefy](https://github.com/chrisdickinson/beefy): `beefy myapp.js`. [browserify-middleware](https://github.com/ForbesLindesay/browserify-middleware) is worth a look too.

Alternatively, if you just want to compile `hyperdom.js` and reference it in a `<script src="..."></script>`, you can by running `npm run prepublish` in the hyperdom directory.

