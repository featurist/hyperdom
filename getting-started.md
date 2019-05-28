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

```jsx
const hyperdom = require("hyperdom");
const {hello} = require("./styles.css");

module.exports = class App {
  render () {
    return <h1 class={hello}>Hello from Hyperdom!</h1>
  }
}
```

It's mounted into the dom in `./browser/index.js`:

```js
const hyperdom = require("hyperdom");
const App = require("./app");

hyperdom.append(document.body, new App());
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMLAUZAyQBI1HAIORWWwAIwoAAMqolaTYVgRr3y8qQbIAEio1JotExfDAtCQmAApCoasQgLQYCwK8yWGx2TGOtk6t4wgQMNJOgVC914spQI6e2zJJiTSYkVRkX1OtAAV2g6gjpXw5Uz2ZjEO9jl0aVMkqsKasZHwEHgrODuTYmGwUEmnG4fI5pu07qgGCoArTbN7XJ0BrYg-HFHLLErmpAVgklpr1HrjYNzfkHDzOEmmcssFwA6H8DnIDki6dBJgSkBJA0gaEBjIhmxphAPz-AOBagac52HJOBrCpcgaQ8OlXAFGITQnJhBiYLgAEcsy4AAKRR4LNNgAEoAG5GBg95gGWKAoBIQxEOQmA0IgTC2BQeEKCUWA4BQfA4BhQi1jIa11AzWAUBsdgn14Gj8EHbimAAQQuJgdy4T1cCYDC8MUh5aIoDNcGYJJFR6aS4EGMicEoww4kNcybTAAFzWNTkzW8JZFTaD930_Mwf3-IEQTBWMQPAtxaRcchYPHM0aNQ9CYCw9kcP7EBeLrcL3nk9horo2L4uYoD8KI1MyEi7QUCA6h1AwzR8AzTpKHQVElGkJgyBgQE5IudSUpxb8CF_PyAIFNj4E47jgsg2hEGJSjMCgDDNiUDSdzACDJjAZloCUAQ2GsqBpXyfBugAORgDMYBkOSXgwKBmrgao4H5NQIDAQqPMYOwbM0tIqGsPkKFwe6VtwLQBAzC41EOgZXs_QxDCAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## State Management

It's rare to have to think about state management in Hyperdom. Just like React app, a Hyperdom app is often composed of multiple components. Unlike React though, Hyperdom does not _recreate_ them on each render - your app has total control over how long those components live. Another crucial difference is that Hyperdom always re-renders the whole app, no matter which component triggered an update.

This means you can use normal JavaScript objects to store state and simply refer to those objects in jsx.

## Events and Bindings

Hyperdom rerenders immediately after each UI event your app handles. There are two ways of handling UI events in hyperdom, event handlers (for things like mouse clicks) and input bindings (for things like text boxes).

## Event Handlers

Event handlers run some code when a user clicks on something. Let's modify our `App` code in `./browser/app.jsx`:

```jsx

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMYBJ3DDZGk2OLcHAIORWWwAIwoAAM6pkDJAVgRr3yiqQbIAEio1JotExfDAtCQmAApCpa6UgLQYCxK8yWGx2THOsQgPVvGECBhpAMCoWevFlKBHb22ZJMSaTEiqMj--QgNAAV2g6mjpXw5Vz-fjEN9jl0aVM2qs6asZHwEHgrLDuTYmGwUEmnG4fI55u0nqgGCoAszAcHXJ0RrYo_HFGrLFrLqsEmtDeozdbRvbWZjxZ7ucssFwI7H8CXIDkq4DBJgSkBJA0IaEBjIhmxpkDBD-AOBNQGnOdhyTgawqXIGkPDpVwBRiM0ZyYQYmC4ABHPMuAACkURCLTYABKABuRg4PeYBligKASEMZDUJgDCIGwtgUHhCglFgOAUHwOAYWItYyFtdQc1gFAbHYF9eDo_BR14pgAEELiYfcuG9XBjRWNQsII5SHiOMAmCw7wKAUCAuNMqwAHEuB4CxiR0_dci4Cgc1wZg9gOHZcnSBRlR6WS4EGCicGoww4g0qi7TAAFLVNTkLW8JZlS83JPG6BQuDAQYAHIAGJsqYcgZIgQkgu05C4iYEyzLsY4YGsmBbLIYk6IoXAcxgMKADkbAoRoMBS9IGluLzaJwAZdPDURnNc9z2DiLqgSq5YyBQNbGnmvSvxrASWFUqxcEMhy9Jmtz0jdCxBuAaquP2tQNKyLSCO21KGgusg2m27acV_X5_iBEEwQTMDILcWkXHIeDpwtOj0MwmAcPZPDhxAfim0h95FPYWGGPhxHWJAwiSIzMhoe0FAQOodQsM0fAc06Sh0FRJRpCYMgYEBBSLm0tGfp-f8AaAgUOPgbjeNB6DaEQYlqMwKAsM2JRjrSMAoMmMBmWgJQBDYCLxXyfBuh6jqZAUl4MCgVm4GqOB-TUCAwGJ7bGDsEK7X3KhrD5NqbdV3AtAEHMLjUQ2Bid79DEMIA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

When `Next` link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current dom and updates it if needed).

Read more about Events [here](api#event-handler-on-attributes)

## Input Bindings

This is how we bind html inputs onto the state. Let's modify `app.jsx` once more and see it in action:

```jsx

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
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JM0OCLMSYbI0mwJGo4BByKy2ABGFAABg1MgZICsCNe-SVSDZAAkVGpNFomL4YFoSEwAFIVbUykBaDAWZXmSw2OyYl1iED6t4wgQMNKBgVCr14spQI4-2zJJiTSYkVRkAPyEBoACu0HUMdK-HKeYLCYhfscujSph1VgzVjI-Ag8FZ4dybEw2Cgk043D5HIt2i9UAwVAFWcDQ65OmNbDHE4oNZYdddVgkNsb1BbbeNHezsZLvbzllguFH4_gy5AcjXgYJMCUgJIGlDQgMZEM2NMQYIfwBYE1Aac52HJOBrCpcgaQ8OlXAFGJzVnJhBiYLgAEd8y4AAKRQkMtNgAEoAG5GHg95gGWKAoBIQwULQmBMIgHC2BQeEKCUWA4BQfA4BhEi1jIO11FzWAUBsdhX14ej8DHPimAAQQuJgDy4H1cBNFY1GwwiVIeI4wCYbDvAoBQIG4syrAAcS4HgJV0g9ci4Chc1wZg9gOHZcnSBQVR6OS4EGSicBoww4k06j7TAAErTNTlLW8JYVS83JPG6BQuDAQYAHIAGJsqYchZIgQkgp0lC4iYUzzLsY4YBsmA7LIYl6IoXBcxgMKADkbAoRoMBS9IGluLzv1rQSWDUqxcAAIVRJRyscgyjOqiy6oapriQc_TJp4Vz3JGnb2jHHtBtyAB1Pp3nMpglBIVymCZToAH50gsdhc3eDjVFOKhrBvJgxUsCVfrM7jcxBLrmRgK5Gnez6zqGk6cER4BVpQCG1ChzomAAMlx9IRtCe7sq4R6gSYbpPAFAFmriGdLSjRoafIYlKrRsGMch6HDBuTyxu8obDojJgBdFiaGPUxb9Oc_b0ndCxBo5mqprUTSsm0wixdyZXuNV2b5p07WhoVsg2jGsacT_X5_iBEEwUTcCoLcWkXHIBCGe0eiMKwmBcPZfCRxAATm3d94lPYb3GN9_22NAojSMzMhPa0FBQOodRsM0fBc06Sh0Hm6RHpgQFFIuHSQ6tn4ALt4CBU4-AeL452YNoRBiRozAoGwzYlG2tIwGgyYwGZaAlAENgIrlfJ8G6HqOpkRSXgwKAi7gao4H5NQIDAROxsYOwQvtA8_r5NqN8H3AtAEXMLjUWeBj3wT0Ea3AABlzIouRag0NRJlIai5wBgCAAWOdgj8jDP2wGoD-CE2p6TSD_aaooSAUAoNoAQKp2DWA-CQKAxwmD4OJPYYkXAlBPyTi_GBn8qrqGlFQ9-NDTIIJYHidQ-xmqYPVNgihJhDCGCAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](api#the-binding-attribute)

## Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

```jsx

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

  render() {
    return (
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeDA0jDxGQKkASNRwCDkVVsACMKAADG7LUY2HEmRjhg7bGwABIqNSaLRMQowLQkJgAKRmnocWgwVkdMTIcUS7STxl9mJsAgYRgc-smFHT7Em-GmVOz3KYnk8JFUZFzDjQpmg6kr1emne7oMz1JzIDkUStcVbcTI-Ag8FVxYGbEw2CgnnYZksZE8ThccDcHm8vmGKsDICgGCo-vbxlXOA3XBOuvVYe06cv14rIEMy5Ar81HRz0_eBv3HX9jDiCQo2nag5wXWwl3kfkpnXTtM1gXAPyvUCghYCcvRAQUYCUEl3HUQshBCMhwjISJonxQliTJNQVihdhxXiKVyBlHI5UyfUGlDQCmFOJguAARy7LgAApFGE8M2AASgAbkYASsX1JRYDgUTxJgKSIFktgUEZChtPgFB8DgGxVM-MgY3UUxYBQBJ2HcXg9PwS8bKYABBaEmCQrhh1wIN3jUGSlKC5EuAoUxcGYOSS22BF_gGQYFCdA4fLgU5gC0nSkhwKASFCJpwqgUqmDAYkIxDDVw3yV4nXSgZcn2BQuDACEAGJHnIbyICFfKotEpomBkigFAgOAkjBGAAHEuB4KxzD0pxTBgJTyuRDKmAAOQSCsUvati2sGFY0uROyjFouQQriXAACF2SUMakJYOKEqSvbBmu07tkvNcLoGAB1I4sVmpglBIBKmCVAIAH5BisdhTCxczVAhKh4m_Jg0FiNacZmubTHJA7lUCEAGTRjHQcu4GcAZz79qYabZpQcm1EpgImAAMn5v79sBYEGZFtLKjhgByLgEdJJh9lyfViTIcwmgA8My1WFXyHVoKObJimqdCeExeFtnvgxihyCYQaoGGwVRui04JsNlAdWemBbSi0ImCBOAsFgcFgHd2aABkSF6NavbUXbAbZ0QgwwG1FYJ72sITy3CWt8hxe2K7zaz2jE9D0mUAjqOgTV2PcCYFG2Ej6O1ZQVvHgEd3HrUWvw9mihfb-s3ERutS7vsr7qCenu-4-5EIDASb8nd7BbWi1mJ_ixLR4Ge6Uu-xLJsHvY0FgHKMBs_LCsslfcF7_V48ToY3l6fOhlwfOAWmp4P8Gaaml5mAqw_4W3an_coIoHZkEAWsBQr81jvwtkA5-Hws5DB-H8EBBty43zmimdgMkZLAARlTaQ7MIFWBgKQ_wIoYAAH0EpQCYKEF2E115s33r9LOIsnA_1ASgxOAjUZaHWm8CA5hkgQgAKyukePifK1DRT0NwFAP2zxMEizWPwwRGUhh9GAIjGAptNG8O2BQPRexzCQMMUArR2jLo8PUUwW6gjmEl2zhQdBF0gFB02CPcc49FZwCULOJgnsM5wFnilOIsAqDs2weE7eogw5wCbtXcwtcNo-BgKPZEGl9JwHctYGAekMAklTFiMAPBDhyX_BQCg7A4CIBWGxdgEAUDozIMKVpVltArAkAAJkJOE5SiSWDL3CSUspIx8mFJOOKcgUUckpWSakmOGc9JgAwFAE4iTd4T1CpEgYHDD6Ax2KmMgTQy6cxmnEZa3thhq3rnEzmXcXpvTGh3curzwq9EijtVYKYrDpWcUwsIvIGIECYqScklJhyJDpNxLIsoMjkEEprbQelJLSRgDU9FQFbp5ICuwTFBlsU1NMuxEZ9k8UoHYpPGSmh8CmACJQdAb1SFQJJP5aEUVbr0RAIxIk0LWJXzmtZBAyAUVIr4kgSxJBMBQBkugtecg3CUE8JsrQ0AlACGDDgG0wx8D7COltGQ_l0RbNIYHaweo1Dz1HrvYqVVYxIVxrqPcrh3BaAEKYaEagjU7LBW2Mg6AM53yxEhRYGg1CeFIFVKEJwBBxsvA07JQbGChrUOG9mddI3kRjYsOp2gBBOnYPEbEJAHbqCYA7cRFBzBcCUA6-ymbb593ZuoQwrbs1fyQlWdQaSS2ujLc2uioRx1AA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

When 'Have a beer' button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the 'Events' example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of the two renders rule to toggle 'Loading...'.

## Composing Components

Our `app.jsx` is getting pretty hairy - why not to extact a component out of it? Like that beer table:

```jsx
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

```jsx
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
  renderHeader() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreeting = true)}>
          Next
        </a>
      </div>
    );
  }

  renderUsername() {
    if (this.userName) {
      return (
        <div>
          <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>
          <button
            onclick={() => this.getBeers()}
            disabled={this.isLoadingBeer}
          >
            Have a beer
          </button>
        </div>
      );
    }
  }

  async getBeers() {
    delete this.beers;
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  render() {
    return (
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
```
<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeUhadgkE4yBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ez2zIWN1FMWAUASc1DT08T8CvWymAAQWhJhkM0nx8AodwmFk5SsuRCgFE89BXNwDyvKYMgYBJJgguqkKivUow6LkLgR1wJz2SUIqStLAyKFMXBmHk4aAQRf4BkGK911muamAAdSOLFPKYJQSDGurlRgAB-QYrHYUwsQs1QISoeIfyYNBYiscwrvKuAUFMckADl9thVYTrOpbthWBacABlhkOWlgyoq961C-gImAAMgRwYZsqHaAHIuDq0kmH2XJ9WJMhzCaQCI3LVYCfIYmsqh16YdwOGYFCeFgVBpg6IhmmXrez79sR5Hacq4L9Q5uaWcRZEwoIrrqDiXBg3eNRBvBkaxom5FptZjXtgUZ0DhSuBTmAbTdKSHAoBIUImgVqALaYMBiUjUMNQjfJXmdNncn2BQuDACEAGJHnIZKICFI3BtOJpCsF8q4gAcS4HhHv0pxTBgZSre1gYPoSSspsBjAAfF2apfZz4jG6uWLnJJUAmV5EIDAaPufpxnipVlguFG8bCqzlGtfzgZAVZtHTExmBscavHKaJknFO0cnzMJ6ngEF1v9uZlYZr7gEuwofLws5gZg6gUPBXD4rI6YQWdWauAitFo-mCBOAsFgcFV-5zy3JIXpHuax-EM2YDGDBgW0uM7pVR3oMQkZ0D6ey3gPZapdpYdXLiwDAcAlBziYLfKq9927IjiLAKg19ubYDtO1AYgtv6_yBETZqKcfAwHasiTSBk4DmmsBPcSGASRpixGAHghx_LJAoOwOAiAVjsXYBAFAp0yDClkdZbQKwJAACZCT4JUlQ0QgsKG4ESrjfhIwOFcJOOKcgbV0F6K_nAH-f8GFVX0mADAUATi6M6hXWWStCHDS7mrXu-cdhpjIE0T-FVY4wATq5YYRMmBHUFpXNQfVfiDQEEknx8tFa4AfqsVMVgS6eLCLyRiBBmKknJCsZqNUKBcR4lkWUGRHJYlJtofSPljJ-QUi7D8IAwrsJNvADphlfL-TMkM16Nk7KsIiuyaKYo4ruF4PpZKmC9I1JCkNOQmDsH4FwTwO-9dhrEJ4BPfR-DdGQzsQ4-h5hGHiVTiwmxLB2HPnMTw4xAj7bCIUKI_eEipEyLkQopRcjTRqM0QYmZpVyH4P0nw757zHJijpFYsKsKKq0Mcfc5x4lXHuOeWgw-BkerlDfn5PxAxG7NwqtCqlc0Ak90mpzYeEtB7bD2GgWA-t1lG0mULFqItgGcreL0EVQ8nASrFmVJ40rJUKCaIzVYZV5WiqaOS8wp96oqsVdAoeaxcDSt1e8Y1FAfh_H1aICJr1oUoFTOwWSslgC1xgNIa-IptVutBKmUUAB9MaUBQiXyjh3J-qtmVWuWkMI1UaIZDA-By8N2x_DmAaDACA5hkgQgAKxukePiI2_gRQwADbgINcq43RrWIm5NrKKB9BdRvFVta63RobeEvYWqrBMxbWqg1Uqq1MGUnG4NgDWVrAtSKlVFKEHb3zigsuxKZY9WOdSpuskaH2Lof_KqDKBhMuYGypotzHooHPcXZEoQmA4BOENZah6gmsvnU_b4cDyBMBPmfC-Yko430Ofgh-z9PIUo_lu09Ti1BW1AeA_YBjVh73gdAm1KBkm4HJdyyl47AYvrmou0WdE6IMRAExIklS2L1nFA0vitB2FtMjN5UZXTRHz2AgMlp6VMqMaMiZAKMiYT9NmfRlAHFZayU0PgUwARKDoH6u6-qjUMqOuUmFYjpGWJVIFdM6j2RaCIC1SQTAUBZIWoZW4SgnhXFaGgEoAQIYcC2mGPgfYOc04yHSuiNx7rX7WD1GoRu7UvFm1tnGZC11dT7lcO4LQAhTDQjUM5jxJTwqCtqfeu6FE1AmhILbKEJwBCkFyxIolQWDFpacOlxYGgsuLH3toAQzp2DxGxDlsETBT5ZooOYLgShAvl1S1shthgBtCVlchas6g7kNbdE1vr9FQgLaAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Since `this.beerList` is a component, we can specify it in place in the jsx. Hyperdom will implicitly call its `render()` method.

## Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to spend time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` - to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router (`browser/index.js`):

```js
const hyperdom = require("hyperdom");
const router = require("hyperdom/router");
const App = require("./app");

hyperdom.append(document.body, new App(), { router });
```

Next, on the home page, we specify what there is to render on the root path - `/` - and also add a link to `/beers` (`browser/app.jsx`):

```jsx
const BeerList = require("./BeerList")
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

  renderHeader() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreeting = true)}>
          Next
        </a>
      </div>
    );
  }
}
```

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project. The beers site ones are in `browser/routes.js`:

```js
const router = require("hyperdom/router");

module.exports = {
  home: router.route("/"),
  beers: router.route("/beers"),
  beer: router.route("/beers/:id")
};
```

A route definition can be specified in the array returned from the `routes()` method. It can also generate a path for html links - e.g. `routes.beer.href({id: 23})` returns `/beers/23`.

There is one other thing that can be a part of the array returned by `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there. This works because `this.beerList` itself a has a `routes()` method (`browser/BeerList.jsx`):

```jsx
const styles = require("./styles.css");
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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdTeEimYZkcwyBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ZSHOsLFiTNeB9J84y_NMlYopvFT1PbMhY3UUxYBQBJ2HcXh9PwK9bKYABBaEmGQzSfHwCh3CYWTlKq5EKAUTz0Fc3APK8pgyBgEkmCC7qQqaidPiMZL4CalrSwMihTFwZhhDmlgprgJJtD85CBjW6g4lwAQZtOJpZt23auAWpamDajr2riABxLgeCscwmAAfhu9qNq4EdcCc9klBmgRbp-_a1GDd41DG1bRDo87QmUyCBlBzrgtvOaaIIia9r-tyMCUU0KFk6Vsmanb5sW5gdjTMgmmAUnKFCVZUysLY6LkX6DoB34Zopy6qca5EAQRf5dtyK91zF86AHUjixTymEJxa-uVGBPtyKx2DNG6wwhKh4h_Jg0FiV79e-lBTHJAA5NXYVWLWzWl7YVklnBnZYCnztRq21FtgImAAMkDwZRcqU0AHIuD60kmH2XJ9WJC0mkAiNy1WRPyHMU7gB9m21eZlZReFuGS89vO_bVoOQ9yfYFC4MBTmAda0dwDb65gMAmtCJpgwwW04-NrrVgwJp4fFovgTFsKjA5ybwdwSHemh8nkQF675NhwEp7LwYFGdA4SrgJvtN0pIcCgEge8hqBL6YMBiUjUMNQjfJXmdD3BjrhuIQAYkecgxUIBCibsdU6slUb3RgE9Vy5o3riScKYGAyke67xYNbBIlZYYAnYs7eEO85r2VnmEXkjECDMVJOSFYw0eoUC4jxLIsoMiOSxKnbQsVDK-X8mw4CRDNLYgsrpDhRkTIBXMpZDaNk7JpX4etYRXDErrVShNTK2UxR5QKnpcSxUMClRoSFWachdFKDnEwcgl9eh81ahbTybkSC9FesNfSiDAjpQGLI-A-VrAwH0hgEkaYsRgB4IcbhFAKDsDgIgFY7F2AQBQNrMgwpYnWW0CsCQAAmQkXU7LWI6tgO0vj_EjAMnALxJxxTkBhrkjatj7FAgtE48SYAMBQBOONNxEkibTVXnNdey0S4t3yW3WSXtRBczUEdZqJ0zrnTGTwQW29ES5xsXAOxDiGldQ-sYNZ9TzAoH2Y8EGFtxm4HKFgWA3d8GIl3uPAYiNkZjK6RtIZIzd4myzK9SJMzZmgnUAIQQoNpD3i6gASV7CALGszCI_JOZMsSOc0GU2uos-mqNanrPME4z6bAdmvX2SgQ5X0OonNKItX6FBhqXMntc7BTBblwxngMSFc9cYHVJbgcllKenuJYUPNQziLZDI2pALMskhnwr5bgFAYIxIIMFaC9QjK5lXWpv4N6-Im5DOlamUUAB9RaUBQjPHaZzBeZy0AXO5cqwWm9zoot3kMc5PidG2RPoIqyQzaGoNpQCNq7xP4DCGLgAN4s2pPBDYGtqTR_YwFWFGxFkaFBNDOeYKAVhY1rCTQm7YYbjU-pdk4ENca3i9CLRQH4fxs3LLydklAqZ2CyRGWCIFSoAhAr2Km9NQL_AihgPq3AhqpkIvzQMPpQsR2huDdmu1FAPgTp-ZrLQb03gQHMMkCEABWN0jwNXAB7Xqg1oRw3TonrOiNsyhh9GAK2mAhcz0nsjVejtab-p3rnT8j9gwz21waD_ZuTzW5JAbk29QiMe5wAUKSEeDJ73zoLVOuDSrP1gcRXGitn841OrwdS6e7S6IMRAExIklC2L1nFAwvitB-E8PkfFbhikPwgD4byqauBaOiJ4UlLp2EmMyN5RVdg7GEpiI4so9KPCUAcX2rJTQ-BTABEoOgQGLaBrlWhE1IFwBOnRTY4jNKBGiMsSoS3OkFHshUZY9xoT9GX6pNY2JxgqicoaMNFomZkGAgCFYygKa_kVgqUgkKrz3GfNdL80KgLcghnBZ06F6K4XskrEQGCFSYR9N8kMyRikp8rJSLM0wxAqaSCYCgGKwGVq3CUE8M0rQ0AlACBDDgW0wx8D7AwUgmQ5V0QtKBXAA8eo1AQDAGlOe59b5xmQgbXU-5XDuC0AIUw0I1CtZOCNiardaEzMWBoNQnhSC3yhCcAQ-2rwRJgGt9KG2DFOC2xRXbiwwnaAEM6dg8RsQkDTeoJgaa10UHMFwJQF3GBXaErOwwIOsRhuQtWdQuzntulexdyIoRQhAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

When beer table page is visited for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. This way, even if the page is then reload whilst on `/beers` or `/beers/23` the data is always going to be there to render.

Speaking of `/beers/23`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
