# hyperdom [![npm version](https://img.shields.io/npm/v/hyperdom.svg)](https://www.npmjs.com/package/hyperdom) [![npm](https://img.shields.io/npm/dm/hyperdom.svg)](https://www.npmjs.com/package/hyperdom) [![Build Status](https://travis-ci.org/featurist/hyperdom.svg?branch=master)](https://travis-ci.org/featurist/hyperdom)

A simple, fast, feature rich framework for building dynamic browser applications.

Hyperdom supports a simple event-update-render cycle, promises for asynchronous operations, JSX, non-JSX, typescript, client-side routing, SVG, two-way data binding, server-side rendering, and optimises for performance, developer usability and simplicity of application architecture.

Hyperdom is influenced by [react](http://facebook.github.io/react/) and uses [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for the DOM patching. Unlike react though, there is no need for state management libraries (this problem simply does not exist in hyperdom), the API is compact and the routing is built in.

## Table of Contents

<details><summary>Quick Start</summary>

* [Install](#install)
* [Hyperdom App](#hyperdom-app)
* [State Management](#state-management)
* [Events and Bindings](#events-and-bindings)
* [Event Handlers](#event-handlers)
* [Input Bindings](#input-bindings)
* [Calling Ajax](#calling-ajax)
* [Composing Components](#composing-components)
* [Routes](#routes)
* [Testing](#testing)

</details>
<details><summary>Install</summary>

* [New project](#new-project)
* [Add to existing project](#add-to-existing-project)
* [Size](#size)
* [Browser Support](#browser-support)

</details>

<details><summary>Usage</summary>

* [Hyperdom Applications](#hyperdom-applications)
* [The Render Method](#the-render-method)
  * [JS](#js)
  * [JSX](#jsx)
  * [SVG (or XML more generally)](#svg-or-xml-more-generally)
* [Events](#events)
  * [Re-rendering the view](#re-rendering-the-view)
  * [Bindings](#bindings)
* [Routing](#routing)
  * [Component Methods](#component-methods)
  * [Route Definitions](#route-definitions)
      * [isActive](#isactive)
      * [url](#url)
      * [params](#params)
      * [push](#push)
      * [replace](#replace)
  * [Route Options](#route-options)
  * [Router Options](#router-options)
  * [Not Found](#not-found)
* [Components](#components)
  * [Model Components](#model-components)
  * [View Components](#view-components)
* [Caching](#caching)
* [Not Refreshing](#not-refreshing)
* [Refreshing the view explicitly](#refreshing-the-view-explicitly)
* [Refreshify](#refreshify)
* [Binding](#binding)
* [Server-side Rendering](#server-side-rendering)
* [Using with Typescript](#using-with-typescript)
  * [Render component](#render-component)
  * [Router components](#router-components)
* [Performance](#performance)
* [Debugging](#debugging)
  * [Chrome Plugin](#chrome-plugin)
  * [File Names and Line Numbers](#file-names-and-line-numbers)
* [Production Build](#production-build)
* [Common Errors](#common-errors)
  * [Outside Render Cycle](#outside-render-cycle)
  * [Refresh Outside Render Cycle](#refresh-outside-render-cycle)
* [Development](#development)
  * [Building](#building)
  * [Automated Testing](#automated-testing)
  * [Manual Testing](#manual-testing)
* [Sister Projects](#sister-projects)

</details>
<details><summary>API</summary>

* [Rendering the Virtual DOM](#rendering-the-virtual-dom)
  * [The binding Attribute](#the-binding-attribute)
  * [Event Handler on\* Attributes](#event-handler-on-attributes)
  * [Promises](#promises)
* [Virtual Dom API](#virtual-dom-api)
  * [Selectors (hyperdom.html only)](#selectors-hyperdomhtml-only)
  * [Add HTML Attributes](#add-html-attributes)
  * [Keys](#keys)
  * [Raw HTML](#raw-html)
  * [Classes](#classes)
  * [Joining VDOM Arrays](#joining-vdom-arrays)
  * [Data Attributes](#data-attributes)
  * [Responding to Events](#responding-to-events)
  * [Binding the Inputs](#binding-the-inputs)
  * [Radio Buttons](#radio-buttons)
  * [Select Dropdowns](#select-dropdowns)
  * [File Inputs](#file-inputs)
  * [Window Events](#window-events)
  * [Mapping the model to the view](#mapping-the-model-to-the-view)
* [Raw HTML](#raw-html-1)
* [Attaching to the DOM](#attaching-to-the-dom)
  * [Detach](#detach)
  * [Remove](#remove)

</details>

Sponsored by:

[![Browserstack](https://www.browserstack.com/images/mail/newsletter-bs-logo.png)](https://www.Browserstack.com/).

## Quick Start

### Install

```sh
yarn create hyperdom-app --jsx myapp # or npx create-hyperdom-app myapp
cd myapp
yarn install
```

Run dev server:

```sh
yarn dev
```

Open `http://localhost:5000`

### Hyperdom App

An object with a `render()` method is a valid hyperdom component (we call top level component an app). The one in your project - `./browser/app.jsx` - looks like this:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-init", "file": "src/browser/app.jsx", "addToNextExample": true}}
const hyperdom = require("hyperdom");
const {hello} = require("./styles.css");

module.exports = class App {
  render () {
    return <h1 class={hello}>Hello from Hyperdom!</h1>
  }
}
```

It's mounted into the dom in `./browser/index.js`:

```js {"codeExample": {"project": "docs/codesandbox/get-started-init", "file": "src/browser/index.js"}}
const hyperdom = require("hyperdom");
const App = require("./app");

hyperdom.append(document.body, new App());
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMLAUZAyQBI1HAIORWWwAIwoAAMqolaTYVgRr3y8qQbIAEio1JotExfDAtCQmAApCoasQgLQYCwK8yWGx2TGOtk6t4wgQMNJOgVC914spQI6e2zJJiTSYkVRkX1OtAAV2g6gjpXw5Uz2ZjEO9jl0aVMkqsKasZHwEHgrODuTYmGwUEmnG4fI5pu07qgGCoArTbN7XJ0BrYg-HFHLLErmpAVgklpr1HrjYNzfkHDzOEmmcssFwA6H8DnIDki6dBJgSkBJA0gaEBjIhmxphAPz-AOBajBWNyQQZAXHIGkPDpVwBRiE0JyYQYmC4ABHLMuAACkUOCzTYABKABuRhoPeABBC4EKQmBUIgDC2BQBpzkuEACLWMhxzNFBGOodR0M0fAM06Sh0FRJRpCYMgYEBJgyPYdDcIInFvwIX8gRBeEKCUWA4BQfA4BA4hwPcWhEGJKASEwKB0M2JRcKYHcwHAyYwGZaAlAENhDRwaV8nwboADkYAzGAZGkl4MCgMS4GqOB-TUCAwEI99WLsHAzLsuQqGsPkKFwaKHNwLQBAzC41F8gZEo_MhFJ_f5VIAxjgOsKlDNpMCyBg9jtAolC0JgTD2Ww_tmMS4i7OWKAzMMbqqN6_r6IFTT4B0vS8MSxhrXUDNYBQGx2CfXgKPwQc9Ok8idy4T1cCYOT0pDSiKAzXBmCSRUemOuBBmAcbJriTyJptMAAXNY1OTNbwlkVNpKuMQxYaAA&query=module%3Dsrc%2Fbrowser%2Findex.js" target="_blank" rel="noopener noreferrer">Run this example</a>

### State Management

It's rare to have to think about state management in Hyperdom. Just like React app, a Hyperdom app is often composed of multiple components. Unlike React though, Hyperdom does not recreate them on each render - your app has total control over how long those components live. Another crucial difference is that Hyperdom always re-renders the whole app, no matter which component triggered an update.

This means you don't have to think about which components will be rerendered, you don't have to think about which events will rerender the app, you don't have to think about special data structures - you can use normal JavaScript objects to store state. You can now just concentrate on how UI events update your application state, and how that state is rendered on the page.

### Events and Bindings

Hyperdom rerenders immediately after each UI event your app handles. There are two ways of handling UI events in hyperdom, event handlers (for things like mouse clicks) and input bindings (for things like text boxes).

#### Event Handlers

Event handlers run some code when a user clicks on something. Let's modify our `App` code in `./browser/app.jsx`:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-events", "file": "src/browser/app.jsx", "line": 3}}
module.exports = class App {
  renderHeader() {
    if (!this.hideGreeting) {
      return <div>
        <h1 class={hello}>Hello from Hyperdom!</h1>
        <a href='#' onclick={() => this.hideGreeting = true}>Next</a>
      </div>
    } else {
      return <p>Now then...</p>
    }
  }

  render () {
    return <main>
      {this.renderHeader()}
    </main>
  }
}
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMYBJ3DDZGk2OLcHAIORWWwAIwoAAM6pkDJAVgRr3yiqQbIAEio1JotExfDAtCQmAApCpa6UgLQYCxK8yWGx2THOsQgPVvGECBhpAMCoWevFlKBHb22ZJMSaTEiqMj--QgNAAV2g6mjpXw5Vz-fjEN9jl0aVM2qs6asZHwEHgrLDuTYmGwUEmnG4fI55u0nqgGCoAszAcHXJ0RrYo_HFGrLFrLqsEmtDeozdbRvbWZjxZ7ucssFwI7H8CXIDkq4DBJgSkBJA0IaEBjIhmxpkDBD-AOBNQGnOdhyTgawqXIGkPDpVwBRiM0ZyYQYmC4ABHPMuAACkURCLTYABKABuRg4PeYBligKASEMZDUJgDCIGwtgUHhCglFgOAUHwOAYWItYyFtdQc1gFAbHYF9eDo_BR14pgAEELiYfcuG9XBjRWNQsII5SHiOMAmCw7wKAUCAuNMqwAHEuB4CxiR0_dci4Cgc1wZg9gOHZcnSBRlR6WS4EGCicGoww4g0qi7TAAFLVNTkLW8JZlS83JPG6BQuDAQYAHIAGJsqYcgZIgQkgu05C4iYEyzLsY4YGsmBbLIYk6IoXAcxgMKADkbAoRoMBS9IGluLzaJwAZdPDURnNc9z2DiLqgSq5YyBQNbGnmvSvxrASWFUqxcEMhy9Jmtz0jdCxBuAaquP2tQNKyLSCO21KGgusg2m27acV_X5_iBEEwQTMDILcWkXHIeDpwtOj0MwmAcPZPDhxAfim0h95FPYWGGPhxHWJAwiSIzMhoe0FAQOodQsM0fAc06Sh0FRJRpCYMgYEBBSLm0tGfp-f8AaAgUOPgbjeNB6DaEQYlqMwKAsM2JRjrSMAoMmMBmWgJQBDYCLxXyfBuh6jqZAUl4MCgVm4GqOB-TUCAwGJ7bGDsEK7X3KhrD5NqbdV3AtAEHMLjUQ2Bid79DEMIA&query=module%3Dsrc%2Fbrowser%2Fapp.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

When `Next` link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current dom and updates it if needed).

Read more about Events [here](#Events)

#### Input Bindings

This is how we bind html inputs onto the state. Let's modify `app.jsx` once more and see it in action:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-bindings", "file": "src/browser/app.jsx", "line": 13}}
  renderBody() {
    if (this.hideGreeting) {
      return <div>
        <label>
          What is your name? <input type="text" binding="this.userName"></input>
        </label>
        {this.userName && <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>}
      </div>
    }
  }

  render() {
    return <main>
      {this.renderHeader()}
      {this.renderBody()}
    </main>
  }
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JM0OCLMSYbI0mwJGo4BByKy2ABGFAABg1MgZICsCNe-SVSDZAAkVGpNFomL4YFoSEwAFIVbUykBaDAWZXmSw2OyYl1iED6t4wgQMNKBgVCr14spQI4-2zJJiTSYkVRkAPyEBoACu0HUMdK-HKeYLCYhfscujSph1VgzVjI-Ag8FZ4dybEw2Cgk043D5HIt2i9UAwVAFWcDQ65OmNbDHE4oNZYdddVgkNsb1BbbeNHezsZLvbzllguFH4_gy5AcjXgYJMCUgJIGlDQgMZEM2NMQYIfwBYE1Aac52HJOBrCpcgaQ8OlXAFGJzVnJhBiYLgAEd8y4AAKRQkMtNgAEoAG5GHg95gGWKAoBIQwULQmBMIgHC2BQeEKCUWA4BQfA4BhEi1jIO11FzWAUBsdhX14ej8DHPimAAQQuJgDy4H1cBNFY1GwwiVIeI4wCYbDvAoBQIG4syrAAcS4HgJV0g9ci4Chc1wZg9gOHZcnSBQVR6OS4EGSicBoww4k06j7TAAErTNTlLW8JYVS83JPG6BQuDAQYAHIAGJsqYchZIgQkgp0lC4iYUzzLsY4YBsmA7LIYl6IoXBcxgMKADkbAoRoMBS9IGluLzv1rQSWDUqxcAAIVRJRyscgyjOqiy6oapriQc_TJp4Vz3JGnb2jHHtBtyAB1Pp3nMpglBIVymCZToAH50gsdhc3eDjVFOKhrBvJgxUsCVfrM7jcxBLrmRgK5Gnez6zqGk6cER4BVpQCG1ChzomAAMlx9IRtCe7sq4R6gSYbpPAFAFmriGdLSjRoafIYlKrRsGMch6HDBuTyxu8obDojJgBdFiaGPUxb9Oc_b0ndCxBo5mqprUTSsm0wixdyZXuNV2b5p07WhoVsg2jGsacT_X5_iBEEwUTcCoLcWkXHIBCGe0eiMKwmBcPZfCRxAATm3d94lPYb3GN9_22NAojSMzMhPa0FBQOodRsM0fBc06Sh0Hm6RHpgQFFIuHSQ6tn4ALt4CBU4-AeL452YNoRBiRozAoGwzYlG2tIwGgyYwGZaAlAENgIrlfJ8G6HqOpkRSXgwKAi7gao4H5NQIDAROxsYOwQvtA8_r5NqN8H3AtAEXMLjUWeBj3wT0Ea3AABlzIouRag0NRJlIai5wBgCAAWOdgj8jDP2wGoD-CE2p6TSD_aaooSAUAoNoAQKp2DWA-CQKAxwmD4OJPYYkXAlBPyTi_GBn8qrqGlFQ9-NDTIIJYHidQ-xmqYPVNgihJhDCGCAA&query=module%3Dsrc%2Fbrowser%2Fapp.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](#Bindings)

### Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-ajax", "file": "src/browser/app.jsx", "line": 15}}
  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding="this.userName"></input>
        </label>
        {
          this.userName &&
            <div>
              <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>
              <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
                Have a beer
              </button>
            </div>
        }
        {this.isLoadingBeer ? "Loading..." : this.renderBeerList()}
      </div>
    );
  }

  renderBeerList() {
    if (!this.beers) {
      return;
    }

    return (
      <table class={styles.beerList}>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Tagline</th>
          </tr>
        </thead>
        <tbody>
          {this.beers.map(({ name, tagline, image_url }) => {
            return (
              <tr>
                <td>
                  <img height="50" src={image_url} />
                </td>
                <td>{name}</td>
                <td>{tagline}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  async getBeers() {
    delete this.beers;
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeDA0jDxGQKkASNRwCDkVVsACMKAADG7LUY2HEmRjhg7bGwABIqNSaLRMQowLQkJgAKRmnocWgwVkdMTIcUS7STxl9mJsAgYRgc-smFHT7Em-GmVOz3KYnk8JFUZFzDjQpmg6kr1emne7oMz1JzIDkUStcVbcTI-Ag8FVxYGbEw2CgnnYZksZE8ThccDcHm8vmGKsDICgGCo-vbxlXOA3XBOuvVYe06cv14rIEMy5Ar81HRz0_eBv3HX9jDiCQo2nag5wXWwl3kfkpnXTtM1gXAPyvUCghYCcvRAQUYCUEl3HUQshBCMhwjISJonxQliTJNQVihdhxXiKVyBlHI5UyfUGlDQCmFOJguAARy7LgAApFGE8M2AASgAbkYASsX1JRYDgUTxJgKSIFktgUEZChtPgFB8DgGxVM-MgY3UUxYBQBJ2HcXg9PwS8bKYABBaEmCQrhh1wIN3jUGSlKC5EuAoUxcGYOSS22BF_gGQYFCdA4fLgU5gC0nSkhwKASFCJpwqgUqmDAYkIxDDVw3yV4nXSgZcn2BQuDACEAGJHnIbyICFfKotEpomBkigFAgOAkjBGAAHEuB4KxzD0pxTBgJTyuRDKmAAOQSCsUvati2sGFY0uROyjFouQQriXAACF2SUMakJYOKEqSvbBmu07tkvNcLoGAB1I4sVmpglBIBKmCVAIAH5BisdhTCxczVAhKh4m_Jg0FiNacZmubTHJA7lUCEAGTRjHQcu4GcAZz79qYabZpQcm1EpgImAAMn5v79sBYEGZFtLKjhgByLgEdJJh9lyfViTIcwmgA8My1WFXyHVoKObJimqdCeExeFtnvgxihyCYQaoGGwVRui04JsNlAdWemBbSi0ImCBOAsFgcFgHd2aABkSF6NavbUXbAbZ0QgwwG1FYJ72sITy3CWt8hxe2K7zaz2jE9D0mUAjqOgTV2PcCYFG2Ej6O1ZQVvHgEd3HrUWvw9mihfb-s3ERutS7vsr7qCenu-4-5EIDASb8nd7BbWi1mJ_ixLR4Ge6Uu-xLJsHvY0FgHKMBs_LCsslfcF7_V48ToY3l6fOhlwfOAWmp4P8Gaaml5mAqw_4W3an_coIoHZkEAWsBQr81jvwtkA5-Hws5DB-H8EBBty43zmimdgMkZLAARlTaQ7MIFWBgKQ_wIoYAAH0EpQCYKEF2E115s33r9LOIsnA_1ASgxOAjUZaHWm8CA5hkgQgAKyukePifK1DRT0NwFAP2zxMEizWPwwRGUhh9GAIjGAptNG8O2BQPRexzCQMMUArR2jLo8PUUwW6gjmEl2zhQdBF0gFB02CPcc49FZwCULOJgnsM5wFnilOIsAqDs2weE7eogw5wCbtXcwtcNo-BgKPZEGl9JwHctYGAekMAklTFiMAPBDhyX_BQCg7A4CIBWGxdgEAUDozIMKVpVltArAkAAJkJOE5SiSWDL3CSUspIx8mFJOOKcgUUckpWSakmOGc9JgAwFAE4iS3Fd1wJEgYHDD6Ax2KmMgTQy6cxmnEZa3thhq3rnEzm-zXq_DGh3cu-zwq9EijtVYKYrDpWcUwsIvIGIECYqScklJhyJDpNxLIsoMjkEEprbQelJLSRgDU9FQFbp5ICuwTFBlsU1NMuxEZ9k8UoHYpPGSmh8CmACJQdAb1SFQJJP5aEUVbr0RAIxIk0LWJXzmtZBAyAUVIr4kgSxJBMBQBkugtecg3CUE8JsrQ0AlACGDDgG0wx8D7COltGQ_l0RbNIYHaweo1Dz1HrvYqVVYxIVxrqPcrh3BaAEKYaEagjU7LBW2Mg6AM53yxEhRYGg1CeFIFVKEJwBBxsvA07JQbGChrUOG9mddI3kRjYsOp2gBBOnYPEbEJAHbqCYA7cRFBzBcCUA6-ymbb593ZuoQwrbs1fyQlWdQaSS2ujLc2uioRx1AA&query=module%3Dsrc%2Fbrowser%2Fapp.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

When 'Have a beer' button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the 'Events' example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of that second render to toggle 'Loading...'.

### Composing Components

Our `app.jsx` is getting pretty hairy - why not to extact a component out of it? Like that beer table:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-compose", "file": "src/browser/BeerList.jsx", "addToNextExample": true}}
const hyperdom = require("hyperdom");
const styles = require("./styles.css");

module.exports = class BeerList {

  async getBeers() {
    delete this.beers;
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  renderTable() {
    if (this.beers) {
      return (
        <div>
          <table class={styles.beerList}>
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Tagline</th>
              </tr>
            </thead>
            <tbody>
              {this.beers.map(({name, tagline, image_url}) => {
                return (
                  <tr>
                    <td>
                      <img height="50" src={image_url} />
                    </td>
                    <td>{name}</td>
                    <td>{tagline}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    if (this.isLoadingBeer) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>Have a beer</button>
          {this.renderTable()}
        </div>
      );
    }
  }
}
```

And use it in the main app:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-compose", "file": "src/browser/app.jsx", "line": 3}}
const BeerList = require("./BeerList");

module.exports = class App {
  constructor () {
    this.beerList = new BeerList();
  }

  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding="this.userName"></input>
        </label>
        {
          this.userName && <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>
        }
        {this.userName && this.beerList}
      </div>
    );
  }
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeUhadgkE4yBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUz453IISACEYDUAAZCAhPEqSZJgeSQDM1yPK8n97PbMhY3UUxYBQBJzUNPTxPwK9bKYABBaEmGQzSfHwCh3CYWTlOy5EKAULz0Dc3BPO8pgyBgEkmGCmrQuK9SjDouQuBHXBnPZJRitK0sDIoUxcGYeSRoBBF_gGQYr3XOb5qYAB1I4sS8pglBIcb6uVGAAH5BisdhTCxCzVAhKh4h_Jg0FiKxzGuiq4BQUxyQAOQO2FVlO87lu2FZFpwQGWGQlaWHKyqPrUb6AiYAAyRHBlmypdoAci4erSSYfZcn1YkyHMJpAIjctVkJ8gSey6G3th3B4ZgUJ4WBMGmDoyHade96voOpGUbpqqQv1Tn5tZxFkXCgjuuoOJcGDd41CGiHRvGybkRmtnNe2BRnQOVK4FOYBtN0pIcCgEhQiaRWoEtpgwGJSNQw1CN8leZ12dyfYFC4MAIQAYkecgUogIVjaG04miKoWKriABxLgeCe_SnFMGBlOtnWBk-hJK2moGMEBiW5uljmHJYHr5YucklQCFXkQgMAY55hmmZK1XK54dWiuz1HtYLgZATZ9HTCxmAcaa_GqeJ0nFO0CnzKJmngCFtuDpZlZZr7gEuwoAqIq5gYQ6gMPBQjkqo6YIWdRauBirFo-mCBOAsFgcFV55rz3JIXonpax-kN2YDGDBgW0eN7rVR3oMQk50D5ey3gPFaZcZadQrnjOASg5xMFvtVe-HdkRxFgFQa-PNsB2g6gMIW39f5AmJi1VOPgYAdWRJpAycBzTWAnuJDAJI0xYjADwQ4AVkgUHYHARAKx2LsAgCgM6ZBhQyOstoFYEgABMhI8EqUoaIIW5DcBJTxnwkY7DOEnHFOQdq6CoZfzgD_P-9Dqr6TABgKAJwdFdSMFXZWBCRpcDGhNXuBcdhpjIE0T-lU44wETm5YYxMmDHSFt4vqA0hoCCSXLNQiteg-M3qmKwpcPFhF5IxAgzFSTkkpCORIdIeJZFlBkJyWIybaH0r5Yy_kFKuw_CAcKbDMrsDaYZPyAUzIcW0Q5FpWgUAcTlrJTQ-BTABEoOgAa0h6qNQytCYq4UGIgCYkSCpbFTZWRsggZAjT6n8SQOYS2mAoCyR-EoXxLA3CUE8C4rQ0AlACBDDgW0wx8D7FzunGQGV0SuPWa_aweo1BNw6p482ds4zIRurqfcrh3BaAEKYaEaggXuOKRFYWrUhLIUWBoNQJoSB2yhCcAQpBaXiOYUSxgJLaoXVwMNFgFL5aeEWPvbQAhnTsHiNiGlYImCn3MMkcwXAlAIocuy0K191CGGVUJcq3KmDVnUHQ8wwq3SisVfRPkByWKVJahyridS-K0DYVMoZRkTIAXnsBPpTTsQWV0k6kZplzKWTemciZEUooxTFPFdwvB9IpQwGlK1KqSxyDjVg_AOCeB3wbiNIhPAJ56LwTomxlUaEOPMAw8SacWWH1EGw58ZjuFGP4Q7IRCgRH73EZI6Rsj5GKNkaaVRGj9F2ULaQyqQ79K8KbXWpyYo6SWPCmVWx9j9Xlodq4wlaDq3JPKG_fyLzRBNxbmOvB-6Bj-J7lNLmw9JaD22HsNAsADZxqNibb1Vl9Ecqzreoe5V3jAPFk4f9K0hgKCeEBgDCgmhM1WOVcDP7IM7tuVYGAMHIPQKHmsXA4HUN_vQ4MCgTy4Pc2PXaFAqZ2CyVksAOuMB1l7CQw1dZ_gRQwAAPrjSgKES-0dO5PzVoEy9fHgOAbw1eigHxv1CZOlocwDQYAQBlRQCEABWN0jx8TG2Y6KdjuBONgdE5DGDEmpOGfE-Emjm8zMGeE30VeIpT4NUs8ZkzQMROSeQQZrjgCr1rEI9AmDu6EHbwLig8um7Za9SzQMQ9slqF2Nof_aqp7RDnsCdepoy6nooGyyXZEoQmA4BONqs93cBN93S_5veB8mAnzPhfMS0cb4ZrwQ_Z-Xld0fzi5lxxahragPAfsfRqwqvkH_REt627d0P3K4gm9yCR1izoqESIoRQhAA&query=module%3Dsrc%2Fbrowser%2Fapp.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

Since `this.beerList` is a component, we can specify it in place of jsx. Hyperdom will implicitly call its `render()` method.

### Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to waste time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` - to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router (`browser/index.js`):

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-routing", "file": "src/browser/index.js", "line": 1, "addToNextExample": true}}
const router = require("hyperdom/router");
const App = require("./app");

hyperdom.append(document.body, new App(), { router });
```

Next, on the home page, we specify what there is to render on the root path - `/` - and also add a link to `/beers` (`browser/app.jsx`):

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-routing", "file": "src/browser/app.jsx", "line": 3, "addToNextExample": true}}
const routes = require("./routes");

module.exports = class App {
  constructor () {
    this.beerList = new BeerList()
  }

  routes() {
    return [
      routes.home({
        render: () => {
          return this.hideGreeting ? this.renderBody() : this.renderHeader()
        }
      }),
      this.beerList
    ]
  }

  renderLayout(content) {
    return <main>{content}</main>
  }

  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding="this.userName"></input>
        </label>
        {
          this.userName && <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>
        }
        {this.userName && <a href={routes.beers.href()}>Have a beer</a>}
      </div>
    )
  }
```

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project. The beers site ones are in `browser/routes.js`:

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-routing", "file": "src/browser/routes.js", "addToNextExample": true}}
const router = require("hyperdom/router");

module.exports = {
  home: router.route("/"),
  beers: router.route("/beers"),
  beer: router.route("/beers/:id")
};
```

A route definition can be specified in the array returned from the `routes()` method. It can also generate a path for html links - e.g. `routes.beer.href({id: 23})` returns `/beers/23`.

There is one other thing that can be a part of the array returned by `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there. This works because `this.beerList` itself a has a `routes()` method (`browser/BeerList.jsx`):

```jsx {"codeExample": {"project": "docs/codesandbox/get-started-routing", "file": "src/browser/BeerList.jsx", "line": 2}}
const routes = require("./routes");

module.exports = class BeerList {

  async onload() {
    this.isLoadingBeer = true

    const response = await fetch("https://api.punkapi.com/v2/beers")
    this.beers = await response.json()

    this.isLoadingBeer = false
  }

  routes() {
    return [
      routes.beers({
        render: () => {
          return <div>{this.isLoadingBeer ? "Loading..." : this.renderTable()}</div>
        }
      }),
      routes.beer({
        bindings: {
          id: [this, "beerId"]
        },
        render: () => {
          return <div>{this.isLoadingBeer ? "Loading..." : this.renderCurrentBeer()}</div>
        }
      })
    ]
  }

  renderCurrentBeer() {
    const beer = this.beers.find(beer => beer.id == this.beerId)
    return <img src={beer.image_url}/>
  }

  renderTable() {
    return (
      <div>
        <table class={styles.beerList}>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Tagline</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.beers.map(({id, name, tagline, image_url}) => {
              return (
                <tr>
                  <td>
                    <img height="50" src={image_url} />
                  </td>
                  <td>{name}</td>
                  <td>{tagline}</td>
                  <td><a href={routes.beer.href({id})}>show</a></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdTeEimYZkcwyBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ZSHOsLFiTNeB9J84y_NMlYopvFT1PbMhY3UUxYBQBJ2HcXh9PwK9bKYABBaEmGQzSfHwCh3CYWTlKq5EKAUTz0Fc3APK8pgyBgEkmCC7qQqaidPiMZL4CalrSwMihTFwZhhDmlgprgJJtD85CBjW6g4lwAQZtOJpZt23auAWpamDajr2riABxLgeCscwmAAfhu9qNq4EdcCc9klBmgRbp-_a1GDd41DG1bRDo87QmUyCBlBzrgtvOaaIIia9r-tyMCUU0KFk6Vsmanb5sW5gdjTMgmmAUnKFCVZUysLY6LkX6DoB34Zopy6qca5EAQRf5dtyK91zF86AHUjixTymEJxa-uVGBPtyKx2DNG6wwhKh4h_Jg0FiV79e-lBTHJAA5NXYVWLWzWl7YVklnBnZYCnztRq21FtgImAAMkDwZRcqU0AHIuD60kmH2XJ9WJC0mkAiNy1WRPyHMU7gB9m21eZlZReFuGS89vO_bVoOQ9yfYFC4MBTmAda0dwDb65gMAmtCJpgwwW04-NrrVgwJp4fFovgTFsKjA5ybwdwSHemh8nkQF675NhwEp7LwYFGdA4SrgJvtN0pIcCgEge8hqBL6YMBiUjUMNQjfJXmdD3BjrhuIQAYkecgxUIBCibsdU6slUb3RgE9Vy5o3riScKYGAyke67xYNbBIlZYYAnYs7eEO85r2VnmEXkjECDMVJOSFYw0eoUC4jxLIsoMiOSxKnbQsVDK-X8mw4CRDNLYgsrpDhRkTIBXMpZDaNk7JpX4etYRXDErrVShNTK2UxR5QKnpcSxUMClRoSFWachdFKDnEwcgl9eh81ahbTybkSC9FesNfSiDAjpQGLI-A-VrAwH0hgEkaYsRgB4IcbhFAKDsDgIgFY7F2AQBQNrMgwpYnWW0CsCQAAmQkXU7LWI6tgO0vj_EjAMnALxJxxTkBhrkjatj7FAgtE48SYAMBQBOONNxEkibTVXnNdey0S4t3yW3WSXtRBczUEdZqJ0zrnTGTwQW29ES5xsXAOxDiGldQ-sYNZ9TzAoH2Y8EGFtxm4HKFgWA3d8GIl3uPAYiNkZjK6RtIZIzd4myzK9SJMzZmgnUAIQQoNpD3i6gASV7CALGszCI_JOZMsSOc0GU2uos-mqNanrPME4z6bAdmvX2SgQ5X0OonNKItX6FBhqXMntc7BTBblwxngMSFc9cYHVJbgcllKenuJYUPNQziLZDI2pALMskhnwr5bgFAYIxIIMFaC9QjK5lXWpv4N6-Im5DOlamUUAB9RaUBQjPHaZzBeZy0AXO5cqwWm9zoot3kMc5PidG2RPoIqyQzaGoNpQCNq7xP4DCGLgAN4s2pPBDYGtqTR_YwFWFGxFkaFBNDOeYKAVhY1rCTQm7YYbjU-pdk4ENca3i9CLRQH4fxs3LLydklAqZ2CyRGWCIFSoAhAr2Km9NQL_AihgPq3AhqpkIvzQMPpQsR2huDdmu1FAPgTp-ZrLQb03gQHMMkCEABWN0jwNXAB7Xqg1oRw3TonrOiNsyhh9GAK2mAhcz0nsjVejtab-p3rnT8j9gwz21waD_ZuTzW5JAbk29QiMe5wAUKSEeDJ73zoLVOuDSrP1gcRXGitn841OrwdS6e7S6IMRAExIklC2L1nFAwvitB-E8PkfFbhikPwgD4byqauBaOiJ4UlLp2EmMyN5RVdg7GEpiI4so9KPCUAcX2rJTQ-BTABEoOgQGLaBrlWhE1IFwBOnRTY4jNKBGiMsSoS3OkFHshUZY9xoT9GX6pNY2JxgqicoaMNFomZkGAgCFYygKa_kVgqUgkKrz3GfNdL80KgLcghnBZ06F6K4XskrEQGCFSYRVIGfIcR1iFJT5WSkWZphiBU0kEwFAMVgMrVuEoJ4ZpWhoBKAECGHAtphj4H2BgpBMhyrohaUCuAB49RqAgGANKc9z63zjMhA2up9yuHcFoAQphoRqDaycUbE1W60JmYsDQahPCkFvlCE4AgDtXgiTAdb6VNsGKcNtiie3FhhO0AIZ07B4jYhIGm9QTA01rooOYLgShLuMGu0JWdhhQdYjDchas6hdkvbdG9y7kRQihCAA&query=module%3Dsrc%2Fbrowser%2FBeerList.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

When beer table page is visited for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. This way, even if the page is then reload whilst on `/beers` or `/beers/23` the data is always going to be there to render.

Speaking of `/beers/23`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

Learn more about routing [here](#Routing)

### Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.

## Install

### New project

Create a skeleton application with express backend:

```bash
npx create-hyperdom-app my-app # yarn create hyperdom-app my-app
```

### Add to existing project

    npm install hyperdom

Use with browserify or webpack:

```javascript
const hyperdom = require('hyperdom');
```

### Size

* `hyperdom.js`: 77K
* `hyperdom.min.js`: 29K
* `hyperdom.min.js.gz`: 9.4K

### Browser Support

* IE 9, 10, 11
* Edge
* Safari
* Safari iOS
* Firefox
* Chrome

Other browsers are likely to work but aren't routinely tested.

## Usage

### Hyperdom Applications

A Hyperdom application is simply an object that contains a `render()` method which returns the desired HTML for your application in its current state. This HTML can contain event handlers which modify the application state, after which `render()` is called again to reflect the new HTML. Underneath we use virtual-dom, which ensures that the DOM is updated incrementally, applying only the changes since the last render so it's incredibly fast.

The result is that we can write applications that have a simple relationship between our application data, the HTML on the page and how the page changes when the user interacts with it.

Here's an example:

```jsx {"codeExample": {"project": "docs/codesandbox/demo-js", "file": "src/index.jsx"}}
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
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCWSJCjAY6qn0FJ4UEBSwceEYBDhMAMoYlmgk1p4A9AVFMDl5WjwYTPgKZXA8ALxsAKrBAGIAtAAcbEyNqU0ZWTlknnXqSu2e6hASTBDqwyAY7OxscU27Equ5nnD4uBDsFExwBMfv-I0WVrYAVnBrBdGHdGg8ni9Fo0NltQWtGslUiYzOwMPgANYYADmMBQgPIzlcVBoiDocjYZAwnX4rBAylUGm0kxs1PYsBkFJAEjUcAg5FpbAAjCgAAxiznMOlWCHPAoCpB0gASKjUmi0TF8MC0JCYAClKpKxCAtBgLILzJYbHYHFAjXTZS8-IqGFLjXAKGUKBa0eUoAcrbZkkxJpMSKo0iBZG66WgAK7QdQ-sr4CrxxMBv42xy6KWmLlWCNWMj4CDwWmu0SxrA4SacbgUSYMtXaC1QDBUD3243Npk6RVsdud70gOT5qVsKwSLVF6il8suuTG32pqCTeOWWC4Nsd-AjsfR40YmBKADuJA0zoEggMZEMjBRIC-P0D-KBRPIJI8ZNcHpiqr7JhBiYLgAEcEy4AAKAByXt1WggBKABueF8HbOA4CYABBM4mErHpyA9XA43wCgL0ghC8KXJgKAUCA4BQKlOiAphoOqKAoCUaCx3hFguCtXAKKomMuAoONcGYHY9lSKsWE8dtsBSU8-goaDMKUEhxKYJiYAAfiaBScBk2TPAsdg41eChVWOKhrBHJg0F-CxsRsuiGJ0uYFmouTrjiOi8No-jGOpGBDCuaTqPCm4ULzIx4Tg7QUFOItIM0fA406Sh0BITZpG0mBT2ws4KOQkxDEMIA&query=module%3Dsrc%2Findex.jsx" target="_blank" rel="noopener noreferrer">Run this example</a>

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

### The Render Method

The `render` method returns a virtual DOM fragment. As a general rule, the render method does not modify the state of the model and returns the same VDOM fragment for the same model state.

The virtual-dom can be generated using regular JavaScript or JSX

#### JS

The JavaScript virtual-dom API has some niceties for generating classes and IDs.

```js {"codeExample": {"project": "docs/codesandbox/demo-no-jsx", "file": "src/index.js", "line": 2}}
const h = require('hyperdom').html

class App {
  render() {
    return h('div.content',
      h('h1', 'hello!')
    )
  }
}
```
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKCA7AJjAHgOgBYAuAtlEqAMYD2qBMNSIAPAIQAiA8gMIAqAmgAoBRAASESAPgA6qRmKhTU02TACG6BZIKMCEArHH8VAJ3IwowgMoqMAI0pZGAeh16YGrURgEVw8nmNwXgC8kiAAqtwAYgC0AByhwo4KTniq6tJKdugAnu6M6BAAbsIQ6CEgKgAOlaHiTgWFGopacORGEJUEwnAm5T3kjmiYuABWcLUZWo6t7Z3Jjlm5GTKOcgogAL4ANCCVKuQA1ioA5jA4Y9RkIFQ0dAQMwNLCwqGoKp6hiC8geNmVMEZ0JQiNFsO9KrBQlsnt9CgC4BBqJ9vgBGHAABgxUJhoUwMw6OiRSG-AAk_gCgURhKwYERKMIAFIWbGoZ6hIgqNDI0JDbD4YhQFlskD4zrjYmPVnPb5wbxGAjc3bGUzmXm4OTCaLRSj_RQgaFS4U2ACu0HQir2JjMwhNZpKGD5clCMO2OJAmF1mFQ5Ag8GRkul31-_0BwMVUBUtFlzqlrqluJghRpnroPr9EphwstKuiJowsCM4cj8AVIBdBuFBxg2QA7pRAeKvgBtAC60g20k2O36gwdowQyGu1Fo9EQQ9QstE5NDVKCwiMMAAjqaFwAKADkwYpwPXAEpljdJ3hhHOF8uIGvN9PKXv-SQDxG4HBhABBarCAPzuiYIyr3cfzMvwIY0jFZPANwaHAbhHAh1wrQNRA3PAUTg4RNzMKBKGYPdAP3WN22kLcZxwKpPVXIFyGNTwaBwRYtmEVAYBrV9qj_XcAG5Ow2bigA&query=module%3Dsrc%2Findex.js" target="_blank" rel="noopener noreferrer">Run this example</a>

#### JSX

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

#### SVG (or XML more generally)

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

### Events

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

#### Re-rendering the view

Notice that the whole view is re-rendered after each event. This is because it's common for one part of the page to modify the model in such a way that other parts of the page change too, and you shouldn't have to think about which parts of the view need to be re-rendered after a model change. It's possible to do this because Hyeprdom is extremely quick and it's very rare for this approach to cause performance issues, even on mobile, and even for large complex applications, but for some types of application where there is a lot of data on a page, it can be useful to look for performance optimisations, see [performance](#performance) for details.

#### Bindings

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

### Routing

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

#### Component Methods

* `routes()` returns an array of routes or components. Routes define how the route is rendered, components can themselves have `routes()` methods defining more routes.
* `renderLayout(content)` - can be used to wrap HTML around what is returned by the rendered route, such as headers and footers. `content` is the VDOM returned by rendering the route.

#### Route Definitions

##### isActive

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

##### url

```js
const article = router.route('/article/:id')
article.url({id: 5, page: 3}) === '/article/5?page=3'
```

##### params

```js
const article = router.route('/article/:id')

// when on /article/5?page=3
article.params() === {id: '5', page: '3'}

// when on /elsewhere
article.params() === undefined

article.params('/article/10') === {id: '10'}
```

##### push

```js
const article = router.route('/article/:id')

// push history, resetting scroll to 0, 0
article.push({id: 5})

// push history, without scroll reset
article.push({id: 5}, {resetScroll: false})
```

##### replace

```js
const article = router.route('/article/:id')

// replace history, only in push state
article.replace({id: 5})
```

#### Route Options

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

#### Router Options

You can create new router with different options:

```js
const hyperdomRouter = require('hyperdom/router')
const router = hyperdomRouter.router(options)
```

Where `options` can contain:

* `querystring` - an object that contains `stringify(params)` and `parse(querystring)` methods, the `qs` module or Node's `querystring` module are good options. By default Hyperdom uses a very simple (and small) query string parser and stringifier that works for basic values like strings and numbers, but for complex objects you'll see `%5Bobject%20Object%5D` in your query string.
* `history` - defaults to `router.pushState()` for History API routing. Specify `router.hash()` for hash-style routing. `router.memory()` can be used for testing.
* `baseUrl` - can be used to make all routes relative to this base URL path

#### Not Found

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

### Components

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

#### Model Components

Model components are simply just plain objects that implement `render()` and some of the methods above. They are rendered by simply placing them in the VDOM:

```jsx
const component = {
  render() {
    return <h1>model component</h1>
  }
}

<div>{component}</div>
```

#### View Components

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

### Caching

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

### Not Refreshing

By default the view will refresh after an event handler has run, however you can return `hyperdom.norefresh()` from an event handler to prevent this.

### Refreshing the view explicitly

Sometimes you want to refresh the view but not just after a UI event. For this, a component has a small handful of methods

* `component.refresh()` - can be called to queue up a refresh of the entire view. Calling this multiple times will only invoke one refresh, normally on the next animation frame.
* `component.refreshImmediately()` - can be called to refresh the view immediately.
* `component.refreshComponent()` - can be called to queue up a refresh of just this component.

### Refreshify

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

### Binding

You can customise how bindings refresh the page by using `hyperdom.html.binding()`.

```js
const binding = hyperdom.html.binding(binding, options);
```

* `binding` - an array [model, 'property'], or a binding object {get(), set(value)}.
* `options` - options that are passed directly to [refreshify](#refreshify).

### Server-side Rendering

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

### Using with Typescript

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

#### Render component

```typescript {"codeExample": {"project": "docs/codesandbox/demo-ts", "file": "src/index.tsx"}}
import * as hyperdom from "hyperdom";

class App extends hyperdom.RenderComponent {
  private name: string;

  public render() {
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
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKCA7AJjAHgOgBYAuAtlEqAMYD2qBMNSIAPISQHwA6qABF8zAIboO3HrwIQCsVgAV-AJ3IwoXAMr8MAI0pZGAenGSYw0byIwC_LuTzy45gLzsQAVQAqAMQC0ADidddxry6eAJCnJw8jFroAJ6BkegQAG5cEOiOIPwADllOrHqJScIRooxw5HIQWQRccAoZdeS6aJi4BHBYeXrlldWBetFxnHosUMIgAL4ANCBZ_OQA1vwA5jA4AFZw1GQgVDR0BAzAJU6o_GZOiFxOeDFZMHLolESeBHfwFVUEntjnWbBOKYnEBJB5wCDUS7XEAARhwAAYEYDgZgel8IagoU5kSInER-GgsSAWth8MQoDieE40dU4FDjiIqSA4BY5AQiXMFEpUhhSaMuJ5PJR7piQEDGdCNABXaDoDnyRTKaWynmtMkkbEiaYomAizCocgQeD0kpM273R7PIlQfi0FmU0RON73GnspDQgDMOC9Ht9Hs1PG1uJAmCSABFdXR9Ybje6GSYnJzFZ5pRhYHJrbb4G6SkGmQsYDEAO6UR5090AbQAupwJpxJjN2ntIMsNltUDs9rR6IgQPHoVQiFloA8APLVDHlq79plbKVcgCy2ShBDkUpg4oTICgEA0UIrTngADZAdCnkQnFXN46QJtOu6nHIBOQ3demXf3PMCKWYkTzQ9zzbe832hORKEoAgwwgDMH2ZBQAy4OtUCQhs4KaEk2g6TtqG7Q5ewgIdSxqAAqLh-DgLh_0tIguDAMCaJud5qKcABucIDRtOAKIAQRyLhsG7dAKKowCACUoweABhZ4smoA4uH7LJKiSLMuDOMwrhZSpUGWNjMRELIpQ0HdyC4J9eTkAAKABKBTTTM8x524Sz7ISZJ4hMXgbQ0JRWCLGwCAAcgomJKHnNTzhgAB-IJvN81zSjQQyamdGAMloLA3S4DQWjQZZ7GACsCDwCA4CmaF1JgS8Jn8DyTEYQpWBKhTitKnBKpqgp3ISrqins6y9MDWt2JE54cGyPVLKecgpTMGgcEGcrUBgIsuF4rIbIGyYJgmIA&query=module%3Dsrc%2Findex.tsx" target="_blank" rel="noopener noreferrer">Run this example</a>

#### Router components

```typescript {"codeExample": {"project": "docs/codesandbox/demo-ts-routing", "file": "src/index.tsx"}}
import * as hyperdom from "hyperdom";
import * as router from "hyperdom/router";

const home = router.route("/");

class Thing extends hyperdom.RoutesComponent {
  public tech = "hyperdom";

  public routes() {
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
<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKCA7AJjAHgOgBYAuAtlEqAMYD2qBMNSIAPISQHwA6qABF8zAIboO3HrwIQCsVgAV-AJ3IwoXAMr8MAI0pZGAenGSYw0byIwC_LuTzy45gLzsQAVQAqAMQC0ADidddxry6eAJCnJw8jFroAJ6BkegQAG5cEOiOIPwADllOrHqJScIRooxw5HIQWQRccAoZdeS6aJi4BHBYeXrlldWBetFxnHosUMIgAL4ANCBZ_OQA1vwA5jA4AFZw1GQgVDR0BAzAJU6o_GZOiFxOeDFZMHLolESeBHfwFVUEntjnWbBOKYnEBJB5wCDUS7XEAARhwAAYEYDgZgel8IagoU5kSInER-GgsSAWth8MQoDieE40dU4FDjiIqSA4BY5AQiXMFEpUhhSaMuJ5PJR7piQEDGdCNABXaDoDnyRTKaWynmtMkkbEiaYomAizCocgQeD0kpM273R7PIlQfi0FmU0RON73GnspDQgDMOC9Ht9Hs1PG1uJAmCSABFdXR9Ybje6GSYnJzFZ5pRhYHJrbb4G6SkGmQsYDEAO6UR5090AbQAupwJpxJjNGs1eW0Ojs9rR6IhiUQsqWagAqLj8OBcc0PJ5ELhgOTPaHjy1EJwAbk4EF7_a4Q5HXFnUtocmns6nN3ei90e4PK_CBuoLLHzxgXHsu8o-4eOEvMAAFE5dE4AEpV0xA0bTgUdXDwNBli4bBO3QUcF0nHAACU3ztABhZ4-1QA4uHjLgsilDQoAgcguFoaxn3nM9J2vECeCIkiyNfd84G_AD8NNXdzClORuArbieDwR9vwIkweDkKMHiuDjn1YLiJQkniCD47hGEKVgAAklCgSgjznYACCguAcEovAJgKZJWGA5TAyErgJgA7iq1sxzaxvJDnhwbI9W_J5yClMwaBwQYpi4XCiy4SDoI48LgC_OQnOXBsQHaPZIGWDYtlQdtqE7Q5uwIpwqF7aAHgAeWqDFyyucToS2PjFAAWWyKECDkKUYHFBMQFIjQoUEkB4AANkBaE6JAKsesdEBNk6d0nCk-Y3Rmpl5vcFbSxiIkvKIbKFrW6FZ0oAgwwgDNFuZBQA3c1A61yiYnqAA&query=module%3Dsrc%2Findex.tsx" target="_blank" rel="noopener noreferrer">Run this example</a>

### Performance

Hyperdom is usually very fast. It's based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) which has excellent performance, several times faster than React. See [these benchmarks](http://vdom-benchmark.github.io/vdom-benchmark/). However, if you have very large and interactive pages there are several strategies you can employ to speed things up.

* Consider only rendering a part of the page on certain events. For this, you can use a [component](#components) for the portion of the page you want to refresh, then return a component or an array of components from the event handler.
* Consider using [key](#keys) attributes for large dynamic lists of elements. Key attributes allow the diffing engine to spot differences inside lists of elements in some cases massively reducing the amount of DOM changes between renders.
* For form inputs with bindings, especially text inputs that can refresh the page on each keypress, consider using `hyperdom.html.binding()` to not refresh, or only refresh a component.
* Consider using a component with a `renderCacheKey()` method, to have finer control over when the component re-renders. You can reduce the total render time by not rendering portions of the page that don't change very often. When the `renderCacheKey()` result changes from one render to the next, the component will be re-rendered. When it doesn't change, the component won't be re-rendered.
* For parts of the page that don't ever change, you can pre-render the VDOM statically once and return the same VDOM on each render.

### Debugging

#### Chrome Plugin

[https://chrome.google.com/webstore/detail/hyperdom-inpector/pggnlghflkefenflladfgkbcmfnjkcle](https://chrome.google.com/webstore/detail/hyperdom-inpector/pggnlghflkefenflladfgkbcmfnjkcle)

#### File Names and Line Numbers

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

### Production Build

Debugging features and deprecation warnings can be turned off for production builds. Hyperdom source code checks the `NODE_ENV` environment constiable, and when set to `production` will turn these features off.

To make a production build with webpack, use `webpack -p`.

To make a production build with browserify, use [envify](https://github.com/hughsk/envify) and ensure `NODE_ENV=production`, for e.g. `browserify -t [ envify --NODE_ENV production  ] ...` and then use a minifier like [uglify](https://github.com/mishoo/UglifyJS2) to strip the disabled code.

### Common Errors

#### Outside Render Cycle

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

#### Refresh Outside Render Cycle

> Please assign hyperdom.html.refresh during a render cycle if you want to use it in event handlers

This can occur if you use `hyperdom.html.refresh`, or `h.refresh` outside of a render cycle, for example, in an event handler or after a `setTimeout`. This is easily fixed, take a look at [Refresh Function](#refresh-function).

### Development

To get started:

```js
git clone https://github.com/featurist/hyperdom.git
cd hyperdom
npm install
```

Some of the scripts below assume that you have `node_modules/.bin` in your `$PATH`.

#### Building

`hyperdom.js` and `hyperdom.min.js` can be build using `npm run build`, these can then be used in a `<script src="..."></script>` tag.

#### Automated Testing

Hyperdom is almost 100% tested with karma and mocha. If you're planning to submit a pull request, we kindly ask that you write a test that demonstrates that it works. Without tests, we can't guarantee that your feature will continue to work as we refactor the codebase.

Tests can be found in [test/browser/hyperdomSpec.js](https://github.com/featurist/hyperdom/blob/master/test/browser/hyperdomSpec.js).

You can run karma by running `karma start`, it will watch your files and rerun the tests every time they change.

Server-side tests can be found in [test/server](https://github.com/featurist/hyperdom/tree/master/test/server). You can use `mocha test/server` to run these.

To run all tests use `npm test`.

#### Manual Testing

As much as automated testing is amazing, it can never really replace manual or exploratory testing. You may want to experiment with an API or see how hyperdom performs in a real project, while making changes to hyperdom as you go.

To do this, first go to the `hyperdom` directory and run `npm link`. This will make hyperdom available to other projects.

Then inside your other project run `npm link hyperdom`. When your project has `require('hyperdom')` it will be referring to your local version.

You can then use [browserify](https://github.com/substack/node-browserify): `browserify myapp.js > myappbundle.js` or [watchify](https://github.com/substack/watchify): `watchify myapp.js -dvo myappbundle.js`, or [amok](https://github.com/caspervonb/amok): `amok --compiler babel --browser chrome myapp.js`, or [beefy](https://github.com/chrisdickinson/beefy): `beefy myapp.js`. [browserify-middleware](https://github.com/ForbesLindesay/browserify-middleware) is worth a look too.

Alternatively, if you just want to compile `hyperdom.js` and reference it in a `<script src="..."></script>`, you can by running `npm run prepublish` in the hyperdom directory.

### Sister Projects

* [hyperdom-ace-editor](https://github.com/featurist/hyperdom-ace-editor)
* [hyperdom-draggabilly](https://github.com/featurist/hyperdom-draggabilly)
* [hyperdom-medium-editor](https://github.com/featurist/hyperdom-medium-editor)
* [hyperdom-ckeditor](https://github.com/featurist/hyperdom-ckeditor)
* [hyperdom-semantic-ui](https://github.com/featurist/hyperdom-semantic-ui)
* [hyperdom-sortable](https://github.com/featurist/hyperdom-sortable)
* [hyperdom-zeroclipboard](https://github.com/featurist/hyperdom-zeroclipboard)

## API

### Rendering the Virtual DOM

```js
const vdomFragment = hyperdom.html(selector, [attributes], children, ...);
```

* `vdomFragment` - a virtual DOM fragment. This will be compared with the previous virtual DOM fragment, and the differences applied to the real DOM.
* `selector` - (almost) any selector, containing element names, classes and ids: `tag.class#id`, or small hierarchies `pre code`.
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `children` - any number of children, which can be arrays of children, strings, or other vdomFragments.

#### The `binding` Attribute

Form input elements can be passed a `binding` attribute, which is expected to be either:

* An array with two items, the first being the model and second the field name, the third being an optional function that is called when the binding is set, for examle, you can initiate some further processing when the value changes.

  ```js
  [object, fieldName, setter(value)]
  ```

* `object` - an object
* `fieldName` - the name of a field on `object`
* `setter(value)` (optional) - a function called with the value when setting the model.

* An object with two methods, `get` and `set`, to get and set the new value, respectively.

  ```js
  {
    get: function () {
      return model.property;
    },
    set: function (value) {
      model.property = value;
    },
    options: {
      // options passed directly to `hyperdom.binding()`
    }
  }
  ```

#### Event Handler `on*` Attributes

Event handlers follow the same semantics as normal HTML event handlers. They have the same names, e.g. `onclick`, `onchange`, `onmousedown` etc. They are passed an `Event` object as the first argument.

When event handlers complete, the entire page's virtual DOM is re-rendered. Of course only the differences will by applied to the real DOM.

#### Promises

If the event handler returns a [Promise](https://promisesaplus.com/), then the view is re-rendered after the promise is fulfilled or rejected.

### Virtual Dom API

#### Selectors (`hyperdom.html` only)

Use `tagname`, with any number of `.class` and `#id`.

```js
h('div.class#id', 'hi ', model.name);
```

Spaces are taken to be small hierarchies of HTML elements, this will produce `<pre><code>...</code></pre>`:

```js
h('pre code', 'hi ', model.name);
```

#### Add HTML Attributes

JS

```js
h('span', { style: { color: 'red' } }, 'name: ', this.name);
```

JSX

```jsx
<span style={{color: 'red'}}>name: {this.name}</span>
<span style="color: red">name: {this.name}</span>
```

[virtual-dom](https://github.com/Matt-Esch/virtual-dom) uses JavaScript names for HTML attributes like `className`, `htmlFor` and `tabIndex`. Hyperdom supports these, but also allows regular HTML names so you can use `class`, `for` and `tabindex`. These are much more familiar to people and you don't have to learn anything new.

Non-standard HTML attribtes can be placed in the `attributes` key:

```js
h('span', {attributes: {'my-html-attribute': 'stuff'}}, 'name: ', model.name);
```

#### Keys

Hyperdom (or rather [virtual-dom](https://github.com/Matt-Esch/virtual-dom)) is not clever enough to be able to compare lists of elements. For example, say you render the following:

```jsx
<ul>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>
```

And then, followed by:

```jsx
<ul>
  <li>zero</li>
  <li>one</li>
  <li>two</li>
  <li>three</li>
</ul>
```

The lists will be compared like this, and lots of work will be done to change the DOM:

```html
<li>one</li>   => <li>zero</li>  (change)
<li>two</li>   => <li>one</li>   (change)
<li>three</li> => <li>two</li>   (change)
                  <li>three</li> (new)
```

If we put a unique `key` (String or Number) into the attributes, then we can avoid all that extra work, and just insert the `<li>zero</li>`.

```jsx
<ul>
  <li key="one">one</li>
  <li key="two">two</li>
  <li key="three">three</li>
</ul>
```

And:

```jsx
<ul>
  <li key="zero">zero</li>
  <li key="one">one</li>
  <li key="two">two</li>
  <li key="three">three</li>
</ul>
```

It will be compared like this, and is much faster:

```html
                  <li>zero</li>  (new)
<li>one</li>   => <li>one</li>
<li>two</li>   => <li>two</li>
<li>three</li> => <li>three</li>
```

Its not all about performance, there are other things that can be affected by this too, including CSS transitions when CSS classes or style is changed.

#### Raw HTML

Insert raw unescaped HTML. Be careful! Make sure there's no chance of script injection.

```js
hyperdom.rawHtml('div',
  {style: { color: 'red' } },
  'some dangerous <script>doTerribleThings()</script> HTML'
)
```

This can be useful for rendering HTML entities too. For example, to put `&nbsp;` in a table cell use `hyperdom.rawHtml('td', '&nbsp;')`.

#### Classes

Classes have some additional features:

* a string, e.g. `'item selected'`.
* an array - the classes will be all the items space delimited, e.g. `['item', 'selected']`.
* an object - the classes will be all the keys with truthy values, space delimited, e.g. `{item: true, selected: item.selected}`.

JS

```js
this.items.map(item => {
  return h('span', { class: { selected: item == this.selectedItem } }, item.name)
})
```

JSX

```jsx
this.items.map(item => {
  return <li class={{ selected: item == this.selectedItem }}>{item.name}</li>
})
```

#### Joining VDOM Arrays

You may have an array of vdom elements that you want to join together with a separator, something very much like `Array.prototype.join()`, but for vdom.

```jsx
const items = ['one', 'two', 'three']
hyperdom.join(items.map(i => <code>{i}</code>), ', ')
```

Will produce this HTML:

```html
<code>one</code>, <code>two</code>, <code>three</code>
```

#### Data Attributes

You can use either `data-*` attributes or set the `data` attribute to an object:

```jsx
h('div', {'data-stuff': 'something'})
h('div', {dataset: {stuff: 'something'}})
<div data-stuff="something"/>
<div data={{stuff: 'something'}}/>
```

#### Responding to Events

Pass a function to any regular HTML `on*` event handler in, such as `onclick`. That event handler can modify the state of the application, and once finished, the HTML will be re-rendered to reflect the new state.

If you return a promise from your event handler then the HTML will be re-rendered twice: once when the event handler initially returns, and again when the promise resolves.

```jsx
class App {
  constructor() {
    this.people = []
  }

  addPerson() {
    this.people.push({name: 'Person ' + (this.people.length + 1)})
  }

  render() {
    return <div>
      <ul>
        {
          this.people.map(person => <li>{person.name}</li>)
        }
      </ul>
      <button onclick={() => this.addPerson()}>Add Person</button>
    </div>
  }
}

hyperdom.append(document.body, new App())
```

#### Binding the Inputs

This applies to `textarea` and input types `text`, `url`, `date`, `email`, `color`, `range`, `checkbox`, `number`, and a few more obscure ones. Most of them.

The `binding` attribute can be used to bind an input to a model field. You can pass either an array `[model, 'fieldName']`, or an object containing `get` and `set` methods: `{get(), set(value)}`. See [bindings](#the_binding_attribute) for more details.

```jsx
class App {
  render() {
    return <div>
      <label>what's your name?</label>
      <input type="text" binding={[this, 'name']} />
      <div>hi {this.name}</div>
    </div>
  }
}
```

#### Radio Buttons

Bind the model to each radio button. The buttons can be bound to complex (non-string) values, such as the `blue` object below.

```jsx
const blue = { name: 'blue' };

class App {
  constructor() {
    this.colour: blue
  }

  render() {
    return <div>
      <input class="red" type="radio" name="colour" binding="this.colour" value="red" />
      <input class="blue" type="radio" name="colour" binding="this.colour" value={blue} />
      <div>
        colour: {JSON.stringify(this.colour)}
      </div>
    </div>
  }
}

hyperdom.append(document.body, new App());
```

#### Select Dropdowns

Bind the model onto the `select` element. The `option`s can have complex (non-string) values.

```jsx
const blue = { name: 'blue' };

class App {
  constructor() {
    this.colour = blue
  }

  render() {
    return <div>
      <select binding="this.colour">
        <option value="red">red</option>
        <option value={blue}>blue</option>
      </select>
      <code>{JSON.stringify(this.colour)}</code>
    </div>
  }
}

hyperdom.append(document.body, new App());
```

#### File Inputs

The file input is much like any other binding, except that only the binding's `set` method ever called, never the `get` method - the file input can only be set by a user selecting a file.

```js
class App {
  constructor () {
    this.filename = '(no file selected)'
    this.contents = ''
  }

  render() {
    return <div>
      <input type="file" binding={ { set(file) => this.loadFile(file) } }>
      <h1>{this.filename}</h1>
      <pre>
        <code>{this.contents}</code>
      </pre>
    </div>
  }

  loadFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onloadend = () => {
        this.filename = file.name;
        this.contents = reader.result;
        resolve();
      };
    });
  }
}

hyperdom.append(document.body, new App())
```

#### Window Events

You can attach event handlers to `window`, such as `window.onscroll` and `window.onresize`. Return a `windowEvents()` from your render function passing an object containing the event handlers to attach. When the window vdom is shown, the event handlers are added to `window`, when the window vdom is not shown, the event handlers are removed from `window`.

E.g. to add an `onresize` handler:

```js
const windowEvents = require('hyperdom/windowEvents');

class App {
  render() {
    return <div>
      width = {window.innerWidth}, height = {window.innerHeight}
      {
        windowEvents({
          onresize: () => console.log('resizing')
        })
      }
    )
  }
}
```

#### Mapping the model to the view

Sometimes you have an input that doesn't map cleanly to a view, this is often just because the HTML input element represents a string value, while the model represents something else like a number or a date.

For this you can use a `mapBinding`, found in `hyperdom/mapBinding`.

```jsx
const mapBinding = require('hyperdom/mapBinding')

const integer = {
  view (model) {
    // convert the model value to a string for the view
    return model.toString()
  },

  model (view) {
    // convert the input value to an integer for the model
    return Number(view)
  }
}

<input binding={mapBinding(this, 'age', integer)}>
```

As is often the case, it's possible that the user enters an invalid value for the model, for example they type `xyz` into a field that should be a number. When this happens, you can throw an exception on the `model(value)` method. When this happens, the model is not modified, and so keeps the old value, but also, crucially, the view continues to be rendered with the invalid value. This way, the user can go from a valid value, they can pass through some invalid values as they type in finally a valid value. For example, when typing the date `2020-02-04`, it's not until the date is fully typed that it becomes valid.

```js
const mapBinding = require('hyperdom/mapBinding')

const date = {
  view (date) {
    // convert the model value into the user input value
    return `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
  },
  model (view) {
    // test the date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(view)) {
      // not correct, keep typing
      throw new Error('Must be a date of the format YYYY-MM-DD');
    } else {
      // correct format, set the model
      return new Date(view);
    }
  }
}

<input binding={mapBinding(this, 'dateOfBirth', date)}>
```

Under the hood, hyperdom stores the intermediate value and the exception in the model's [meta](#meta) area. You can get the exception by calling `hyperdom.meta(model, field).error`.

### Raw HTML

**Careful of script injection attacks!** Make sure the HTML is trusted or free of `<script>` tags.

```js
const vdomFragment = hyperdom.html.rawHtml(selector, [attributes], html);
```

* `selector` - (almost) any selector, containing element names, classes and ids. E.g. `tag.class#id`
* `attributes` - (optional) the attributes of the HTML element, may contain `style`, event handlers, etc.
* `html` - the element's inner HTML.

### Attaching to the DOM

```js
const attachment = hyperdom.append(element, component, [options]);
const attachment = hyperdom.replace(element, component, [options]);
```

* `attachment` - the instance of the hyperdom attachment, see below.
* `element` - any HTML element.
  * in the case of `hyperdom.append` the view is added as a child via `element.appendChild(view)`
  * in the case of `hyperdom.replace` the view replaces `element` via `element.parentNode.replaceChild(view, element)`
* `component` - a component: an object with a `.render()` method.
* `options`
  * `requestRender` - function that is passed a function that should be called when the rendering should take place. This is used to batch several render requests into one at the right time.

    For example, immediately:

    ```js
    function requestRender(render) {
      render();
    }
    ```

    Or on the next tick:

    ```js
    function requestRender(render) {
      setTimeout(render, 0);
    }
    ```

    Or on the next animation frame:

    ```js
    function requestRender(render) {
      requestAnimationFrame(render);
    }
    ```

    The default is `requestAnimationFrame`, falling back to `setTimeout`.

    For testing with [karma](http://karma-runner.github.io/) you should pass `setTimeout` because `requestAnimationFrame` is usually not called if the browser is out of focus for too long.

#### Detach

```js
attachment.detach();
```

Detaches the rendering engine from the DOM. Note that this doesn't remove the DOM, just prevents any hyperdom rendering events from modifying the DOM.

#### Remove

```js
attachment.remove();
```

Destroys the DOM, running any `onremove` handlers found in components. This will remove the DOM element.

## We're Hiring!

Join our remote team and help us build amazing software. Check out [our career opportunities](https://www.featurist.co.uk/careers/).
