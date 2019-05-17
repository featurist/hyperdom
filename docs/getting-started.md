## Install

```sh
yarn create hyperdom-app --jsx myapp # or npx create-hyperdom-app --jsx myapp
cd myapp
yarn install
```

Run dev server:

```sh
yarn dev
```

Open `http://localhost:5000`

## Hyperdom App

An object with a `render()` method is a valid hyperdom component (we call top level component an app). The one in your project - `./browser/app.jsx` - looks like this:

[view code](codesandbox/get-started-init/src/browser/app.jsx#L4)

It's mounted into the dom in `./browser/index.js`:

[view code](codesandbox/get-started-init/src/browser/index.js)

[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-init?fontsize=14)

## State Management

It's rare to have to think about state management in Hyperdom. Just like React app, a Hyperdom app is often composed of multiple components. Unlike React though, Hyperdom does not _recreate_ them on each render - your app has total control over how long those components live. Another crucial difference is that Hyperdom always re-renders the whole app, no matter which component triggered an update.

This means you can use normal JavaScript objects to store state and simply refer to those objects in jsx.

## Events and Bindings

Hyperdom rerenders immediately after each UI event your app handles. There are two ways of handling UI events in hyperdom, event handlers (for things like mouse clicks) and input bindings (for things like text boxes).

## Event Handlers

Event handlers run some code when a user clicks on something. Let's modify our `App` code in `./browser/app.jsx`:

[view code](codesandbox/get-started-events/src/browser/app.jsx#L3)

[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-events?fontsize=14)

When `Next` link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current dom and updates it if needed).

Read more about Events [here](#Events)

## Input Bindings

This is how we bind html inputs onto the state. Let's modify `app.jsx` once more and see it in action:

[view code](codesandbox/get-started-bindings/src/browser/app.jsx#L13)

[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-bindings?fontsize=14)

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](#Bindings)

## Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

[view code](codesandbox/get-started-ajax/src/browser/app.jsx#L15)

[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-ajax?fontsize=14)

When 'Have a beer' button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the 'Events' example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of the two renders rule to toggle 'Loading...'.

## Composing Components

Our `app.jsx` is getting pretty hairy - why not to extact a component out of it? Like that beer table:

[view code](codesandbox/get-started-compose/src/browser/BeerList.jsx)


And use it in the main app:

[view code](codesandbox/get-started-compose/src/browser/app.jsx#L3)
[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-compose?fontsize=14)

Since `this.beerList` is a component, we can specify it in place in the jsx. Hyperdom will implicitly call its `render()` method.

## Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to spend time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` - to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router (`browser/index.js`):

[view code](codesandbox/get-started-routing/src/browser/index.js#L1)

Next, on the home page, we specify what there is to render on the root path - `/` - and also add a link to `/beers` (`browser/app.jsx`):

[view code](codesandbox/get-started-routing/src/browser/app.jsx#L3)

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project. The beers site ones are in `browser/routes.js`:

[view code](codesandbox/get-started-routing/src/browser/routes.js)

A route definition can be specified in the array returned from the `routes()` method. It can also generate a path for html links - e.g. `routes.beer.href({id: 23})` returns `/beers/23`.

There is one other thing that can be a part of the array returned by `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there. This works because `this.beerList` itself a has a `routes()` method (`browser/BeerList.jsx`):

[view code](codesandbox/get-started-routing/src/browser/BeerList.jsx#L2)
```
[codesandbox](https://codesandbox.io/embed/github/featurist/hyperdom/tree/master/docs/codesandbox/get-started-routing?fontsize=14)

When beer table page is visited for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. This way, even if the page is then reload whilst on `/beers` or `/beers/23` the data is always going to be there to render.

Speaking of `/beers/23`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

Learn more about routing [here](#Routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
