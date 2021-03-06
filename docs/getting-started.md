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

An object with a `render()` method is a valid hyperdom component (we call top level component an app). The one in your project looks like this:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-init/browser/app.jsx)

It's mounted into the DOM in _./browser/index.js_:

[view code](/docs/codesandbox/get-started-init/browser/index.js)

[codesandbox](/docs/codesandbox/get-started-init)

#### ** Typescript **

_./browser/app.tsx_

[view code](/docs/codesandbox/get-started-init-ts/browser/app.tsx)

It's mounted into the DOM in _./browser/index.ts_:

[view code](/docs/codesandbox/get-started-init-ts/browser/index.ts)

[codesandbox](/docs/codesandbox/get-started-init-ts)

<!-- tabs:end -->

## State Management

It's rare to have to think about state management in Hyperdom. Just like React app, a Hyperdom app is often composed of multiple components. Unlike React though, Hyperdom does not _recreate_ them on each render - your app has total control over how long those components live. Another crucial difference is that Hyperdom always re-renders the whole app, no matter which component triggered an update.

This means you can use normal JavaScript objects to store state and simply refer to those objects in jsx.

## Events and Bindings

Hyperdom rerenders immediately after each UI event your app handles. There are two ways of handling UI events in hyperdom, event handlers (for things like mouse clicks) and input bindings (for things like text boxes).

## Event Handlers

Event handlers run some code when a user clicks on something. Let's modify our `App` class:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-events/browser/app.jsx#L4)

[codesandbox](/docs/codesandbox/get-started-events)

#### ** Typescript **

_./browser/app.tsx_

[view code](/docs/codesandbox/get-started-events-ts/browser/app.tsx#L4)

[codesandbox](/docs/codesandbox/get-started-events-ts)

<!-- tabs:end -->

When "Next" link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current DOM and updates it if needed).

Read more about Events [here](api#event-handler-on-attributes)

## Input Bindings

This is how we bind html inputs onto the state. Let's see it in action:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-bindings/browser/app.jsx#L13)

[codesandbox](/docs/codesandbox/get-started-bindings)

#### ** Typescript **

  _./browser/app.tsx_

[view code](/docs/codesandbox/get-started-bindings-ts/browser/app.tsx#L19)

[codesandbox](/docs/codesandbox/get-started-bindings-ts)

<!-- tabs:end -->

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](api#the-binding-attribute)

## Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-ajax/browser/app.jsx#L15)

[codesandbox](/docs/codesandbox/get-started-ajax)

#### ** Typescript **

_./browser/app.tsx_

[view code](/docs/codesandbox/get-started-ajax-ts/browser/app.tsx#L25)

[codesandbox](/docs/codesandbox/get-started-ajax-ts)

<!-- tabs:end -->

When "Have a beer" button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the "Events" example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of the two renders rule to toggle "Loading...".

## Composing Components

Our `App` class is getting pretty hairy - why not to extact a component out of it? Like that beer table:

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

[view code](/docs/codesandbox/get-started-compose/browser/BeerList.jsx#L4)

And use it in the main app:

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-compose/browser/app.jsx#L3)

[codesandbox](/docs/codesandbox/get-started-compose)

#### ** Typescript **

_./browser/BeerList.tsx_

[view code](/docs/codesandbox/get-started-compose-ts/browser/BeerList.tsx#L4)

And use it in the main app:

_./browser/app.tsx_

[view code](/docs/codesandbox/get-started-compose-ts/browser/app.tsx#L4)

[codesandbox](/docs/codesandbox/get-started-compose-ts)

<!-- tabs:end -->

?> Since `this.beerList` is a component, we can specify it in place in the jsx. Hyperdom will implicitly call its `render()` method.

## Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to spend time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router:

<!-- tabs:start -->

#### ** Javascript **

_./browser/index.js_

[view code](/docs/codesandbox/get-started-routing/browser/index.js)

#### ** Typescript **

_./browser/index.ts_

[view code](/docs/codesandbox/get-started-routing-ts/browser/index.ts)

<!-- tabs:end -->

Next, let's define what the top level path `/` is going to render:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-routing/browser/app.jsx#L4-L20)

#### ** Typescript **

_./browser/app.tsx_

[view code](/docs/codesandbox/get-started-routing-ts/browser/app.tsx#L4-L20)

<!-- tabs:end -->

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project:

<!-- tabs:start -->

#### ** Javascript **

_./browser/routes.js_

[view code](/docs/codesandbox/get-started-routing/browser/routes.js)

#### ** Typescript **

_./browser/routes.ts_

[view code](/docs/codesandbox/get-started-routing-ts/browser/routes.ts)

<!-- tabs:end -->

Route definition can also generate URLs strings. E.g. `routes.beer.href({id: 23})` returns `/beers/23`. This is how a link to `/beers` page looks in our example:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

[view code](/docs/codesandbox/get-started-routing/browser/app.jsx#L35-L35)

#### ** Typescript **

  _./browser/app.tsx_

[view code](/docs/codesandbox/get-started-routing-ts/browser/app.tsx#L48-L48)

<!-- tabs:end -->

Apart from route definitions, there is one other thing that can be a part of the array returned from `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there.

This works because `this.beerList` itself a has a `routes()` and that's where our second path - `/beers` - is mapped onto a render. The pattern then repeats itself with `this.showBeer` plugging in the final `/beers/:id` path.

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

[view code](/docs/codesandbox/get-started-routing/browser/BeerList.jsx#L3-L26)

_./browser/Beer.jsx_

[view code](/docs/codesandbox/get-started-routing/browser/Beer.jsx#L2-L40)

Here is the entire example on codesandbox:

[codesandbox](/docs/codesandbox/get-started-routing)

#### ** Typescript **

_./browser/BeerList.tsx_

[view code](/docs/codesandbox/get-started-routing-ts/browser/BeerList.tsx#L3-L26)

_./browser/Beer.tsx_

[view code](/docs/codesandbox/get-started-routing-ts/browser/Beer.tsx#L2-L43)

Here is the entire example on codesandbox:

[codesandbox](/docs/codesandbox/get-started-routing-ts)

<!-- tabs:end -->

When user navigates to the `/beers` page for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. Since the `onload` returns a promise, the UI will render again once the promise is resolved/rejected.

A similar `onload()` method is implemented on the `/beers/:id` page. Except, if we happen to navigate from the `/beers` page, it won't perform an ajax call, but instead draw from the list of beers fetched previously.

This is a pretty advanced setup as the app will only call the api once, no matter which page user happens to land on.

Speaking of `/beers/:id`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

?> Note how we use a custom `beerId` getter to coerce `:id` param into a number. That's because all url bindings produce string values.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
