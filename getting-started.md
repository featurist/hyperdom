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

```jsx
const hyperdom = require("hyperdom");
const {hello} = require("./styles.css");

module.exports = class App {
  render () {
    return <h1 class={hello}>Hello from Hyperdom!</h1>
  }
}
```

It's mounted into the DOM in _./browser/index.js_:

```js
const hyperdom = require("hyperdom");
const App = require("./app");

hyperdom.append(document.body, new App());
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMLAUZAyQBI1HAIORWWwAIwoAAMqolaTYVgRr3y8qQbIAEio1JotExfDAtCQmAApCoasQgLQYCwK8yWGx2TGOtk6t4wgQMNJOgVC914spQI6e2zJJiTSYkVRkX1OtAAV2g6gjpXw5Uz2ZjEO9jl0aVMkqsKasZHwEHgrODuTYmGwUEmnG4fI5pu07qgGCoArTbN7XJ0BrYg-HFHLLErmpAVgklpr1HrjYNzfkHDzOEmmcssFwA6H8DnIDki6dBJgSkBJA0gaEBjIhmxphAPz-AOBagac52HJOBrCpcgaQ8OlXAFGITQnJhBiYLgAEcsy4AAKRR4LNNgAEoAG5GBg95gGWKAoBIQxEOQmA0IgTC2BQeEKCUWA4BQfA4BhQi1jIa11AzWAUBsdgn14Gj8EHbimAAQQuJgdy4T1cCYDC8MUh5aIoDNcGYJJFR6aS4EGMicEoww4kNcybTAAFzWNTkzW8JZFTaD930_Mwf3-IEQTBWMQPAtxaRcchYPHM0aNQ9CYCw9kcP7EBeLrcL3nk9horo2L4uYoD8KI1MyEi7QUCA6h1AwzR8AzTpKHQVElGkJgyBgQE5IudSUpxb8CF_PyAIFNj4E47jgsg2hEGJSjMCgDDNiUDSdzACDJjAZloCUAQ2GsqBpXyfBugAORgDMYBkOSXgwKBmrgao4H5NQIDAQqPMYOwbM0tIqGsPkKFwe6VtwLQBAzC41EOgZXs_QxDCAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

#### ** Typescript **

_./browser/app.tsx_

```tsx
import * as hyperdom from "hyperdom";
import { hello } from "./styles.css";

export default class App extends hyperdom.RenderComponent {
  render() {
    return <h1 className={hello}>Hello from Hyperdom!</h1>;
  }
}
```

It's mounted into the DOM in _./browser/index.js_:

```ts
import * as hyperdom from "hyperdom";
import App from "./app";

hyperdom.append(document.body, new App());
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVdTeCqkMTKZGo_owdhwCA0LGogCMeAADJyqTSxMwHmsvMykKiedQUWIeNh1CyxJcYNprFAxRKQAL1jdsUjxSjUQSOMRZSA_ttgkMNArdJ8uBUKuhxvQVbqxJgBNACEaTUEQq73earkq5DqVLymDAHRbqBQIPAWdrdaidJ0HewCOgeEa2HQCU7VcRk_AVoKjQBmPAAVjwrKDKJDOr5MH6ABFw_RmFGY5quPHncbAsEKq6NLB2JnsNnDSAaXXVQCYJ1juhU12ANoAXXkinkPzV2wOR1O9NiE3G1000JMcPMCIgPHGS424i42DgXCTKbTPC4YCOX7E7_pT8xAAbnkW97yJbs32CDAuEUb9f1RPB7nzWA4CkGQQNaBUII2ZgwGwIQNlYF9XwAQUmLgFThAhXwA1N0zwAAlNt6QAYXTe9qDMbsaU4C12AACgASl4nUUU4YgBHYcUrFZLI2BkAA5DEYHyYAmigDBFBsAAJGD0AQ9MuF0gsGJ4ABCRpWRsUDg03bcVF3fZDhOM4LgtbRSAvWEzEYcCHy4J8XzfMzPyMv8QHooCQDsgLIIo8YIqQ49JiwtxqGixiTzbQS0woAQ0loPAOk6ZQuG444uESkThLsnc9n3NyjwJTo0IwshjF8-EkDQLBcEE0rRJ7MBYQqAieGgTpsTEfSoDpLwKEyJSYAEGAqWq1ZcHKuAIjgfF6QgMA7K3DLdAMsSUToTQ8WIdg9tG9geGxARJnpJa8hOxzVFIExIBQcFIQUchLz8hEezEKg72gekAHl1iZagux7VVIWkoIAFkJhZO61upcTUSgCBMBZFcxHgAA2Da-XTMQ13xhMxAhTQjU4f5JwZ3tmbKdml06I0sp4QGWZATnUbuiAKEnbFcZgMXUSOdBiCbCBRxFMQ9hrOCHIURQ9aAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

#### ** Typescript **

_./browser/app.tsx_

```tsx
export default class App extends hyperdom.RenderComponent {
  private hideGreeting: boolean;

  renderHeader() {
    if (!this.hideGreeting) {
      return (
        <div>
          <h1 className={hello}>Hello from Hyperdom!</h1>
          <a href="#" onclick={() => this.hideGreeting = true}>Next</a>
        </div>
      );
    } else {
      return <p>Now then...</p>;
    }
  }

  render() {
    return <main>{this.renderHeader()}</main>;
  }
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVGD9MxwCqkMTKZGo8nsOAQGhY1EARjwAAYuTS6WJmA81l4WUhUbzqCixDxsOpWWJLjBtNYoOLJSBBesbtikRKUaiCRxiHKQH9tsEhhpFbpPlwKhV0ON6Kq9WJMAJoARjaagiE3R6LVdlXJdSo-UwYI7LdQKBB4KydXrUTpOo72AR0DxjWw6ATnWriCn4CshcaAMx4ACseDZwZRod1_LJABEI_RmNHY1quAmXSbAsEKm6NLB2FnsDmjSA6fW1QCYJ1jug012ANoAXXkinkP3V2wOR1OMHOE3G1000JMcPMCIgPHGS424i42DgXGTqfTPC4YCOX7E76PT8xAAbnkW97yJbs32CDAuEUb9f1RPB7gLWA4CkGQQNaRUII2ZgwGwIQNlYF9XwAQUmLhFThAhXwAtMMzwAAlNsjwAYQze9qDMbs6XGVZ-nHbgdGGGAAHFOHSdQUGxKJ0FgCJQLcXVOEtdgAAlmiPAAKABKXjdRRCAwC4bSAEJiBE9CROYCSYCk6gUH0ntE04YgBHYCVtLpRMUQsOZXF83yrDZLI2BkAA5DEYHyYAmigDBFBsTSEvQBCMy4dTCwYngzMaNlAqCvULEyHRODAUYAGJahoVgIEBWK9K4fIbC4SyIGs0S7IclBmra9gBBgJKIuouJsEKoLZgGCa9V0pTE3g4I8gMoK3I8iULHGGwIpONqmmoPBDriLb5r1LcQ1aFFVOYdgmpcrg1s8rhUhlagbGAdr0Ouo9NOcHTdMUOJpXUGxTvO86dz2fcTjOC5LW0UgL1hMxGHAh8uCfF832yz90r_EB6KAkAlLRyCKPGPGkNiE8sOUwnGJPNttPTCgBDSWg8A6TplC4bjji4cm9Lm7cVF3fZDhho8UM6NCMLIYxkfhJA0CwXBtK55y6TAWEKgInhoE6bExBS8kvAoTIRsGmkBdWXAebgCJKTOYylPO-RdBgtKezoTQ8WIdhHe19geGxARJiPc28ldkXVFIExIBQcFIQUchLxRhEezEKg72gI8AHl1mZagu3usRIQ8oIAFkJlZf3BtpQzUSgCBMFZFcxHgAA2a3-QzMQ1wbxMxAhTRjU4f5J0H3sR7KCel06Y16Z4JPR5AKe1QJVYKEnbE65gdfUSOdBiCbCBR1FMvtlrODNxFxRFCAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

When "Next" link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current DOM and updates it if needed).

Read more about Events [here](api#event-handler-on-attributes)

## Input Bindings

This is how we bind html inputs onto the state. Let's see it in action:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

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

#### ** Typescript **

  _./browser/app.tsx_

```tsx
  renderBody() {
    if (this.hideGreeting) {
      return (
        <div>
          <label>What is your name? <input type="text" binding={[this, "userName"]} /></label>
          {this.userName && <div>You're now a <strong>hyperdomsta</strong> {this.userName}</div>}
        </div>
      );
    }
  }

  render() {
    return (
      <main>
        {this.renderHeader()}
        {this.renderBody()}
      </main>
    );
  }
}

```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVTCXdQoOAVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFgqSBBpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREB441XG3EXGwcC4qfTmZ4XDAR1_MQvyZH8xAAbnkB8nyJPtP2CDAuEUP8ANRPB7iLWA4CkGRwNaZVoI2ZgwGwIQNlYd8PwAQUmLhlThAgP2AjMszwAAlTsmQAYSzJ9qDMPt6XGVZ-inbgdGGGAAHFOHSClsSidBYAiCD9SEgZRK4AQzgAOQxGBsQJVZqBQFT6U4a12AACWaJkAAoAEoBP1FEIDALhbIAQmIcSsPE5hpJgWTjMc_tk04YgBHYKVbPpZMUQsOZXDiuKrA5LI2BkXS0nyYAmigDBFBsaz8vQZCsy4Szi2YngPMaDkkuSg0LEyHRODAUYAGJahoVgIEBHKHK4fIbC4byIF8iSAqClAhtG9gBBgQrtLouJsAa5LZgGdaDXslTk13MNWhRczmHYAAhV5BtCoY3NssaJv8mSvGCpzkvCyLotilLEq-ja2EwYIbAAdRyDZxq4Tp0Eirh0TSAB-LgLHUcYBA2ItnVGOhNBnLgyQ0CkcvXe7lFRLSmSymAxE3JD6jif7Ad-uLgHuvAyfYCmuAAMk5xHEoATShgByTgYZON9EcMmgUBsJifyNOJJeMkbmZ81mdL0xRNvmA7GsR2Ifucna9oNHXEKOrgTrskKvveqL3MZ1I5WobbkxV8a8EtqybPYBzTeSt2sM9i6ul9h3YlldRtt2ucd1afc9iPE4zgua1tFIa9YTMRgoOfLhX3fT8qp_MrAJAWWs1w6gc5g6jxhL1Cz0mSv5HLng8HPTtbMzCgBDSWg8A6ToSb444uFrhzo4UFQD32Q4k9PAlOkw7CyGMTP4SQNAsFwWzB-t_UwFhCpiJ4aBOmxMRisZLwKEyZaFtpMfVlwEm4AiKkzlclSDvkXR4NK_sWM8TEHYO_Q-7AeDYgEJMJkt88jfz3NPUgJhIAoHBJCBQ5AbxZwRP2MQVBHzQCZAAeXWKyagvZrpiEhJFIIABZCY7IQELTpIbMQUAICYHZOuMQ8AABsj9BQVxAJuVhyYxAQk0KaTg_wZxiIHJIsosjVydFNK3dBUiQDyI1IZPqM5sTMJgNo1ERx0DEFbBACc4pqHbHrGbagB0lCKEUEAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](api#the-binding-attribute)

## Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

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

#### ** Typescript **

_./browser/app.tsx_

```tsx
  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding={[this, "userName"]} />
        </label>
        {this.userName && (
          <div>
            <div>
              You're now a <strong>hyperdomsta</strong> {this.userName}
            </div>
            <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
              Have a beer
            </button>
          </div>
        )}
        {this.isLoadingBeer ? "Loading..." : this.renderBeerList()}
      </div>
    );
  }

  renderBeerList() {
    if (!this.beers.length) {
      return;
    }

    return (
      <table className={styles.beerList}>
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
                <td><img height={50} src={image_url} /></td>
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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVbBg7CaCqkMTKZGo_owdhwCA0LGogCMeAADNyaXSxMwHmsvKykKi-dQUWIeNh1GyxJcYNprFAJVKQEL1jdsUjJSjUQSOMR5SA_ttgkMNErdJ8uBUKuhxvQ1fqxJgBNACCazUEQu7PZariq5HqVPymDAnVbqBQIPA2br9aidJ0newCOgeCa2HQCS71cRU_AVsKTQBmPAAVjw7JDKLDeoFMH6ABFI_RmDG49quInXabAsEKu6NLB2NnsLnjSA6Q31QCYJ1juh0z2ANoAXXkinkPw12wOR1OjNiE3G1000JMcPMCIgPHGK424i42DgXBTaYzPC4YCOP7ET9GW_MQAG55HvR8iS4F8302QtYHfP9M1RPB7gQ-ApBkMDWnUOh2DAf5uAAIRgRlezpdE0mxAlVmoFBwL1DI0HUGAaOIOiGLpe9gRgAB9AR2CgdjOMYnc3GoJUoI2ZhCKEDZWDfd8AEFJi4JU4QId8gPTTM8AAJQ7RkAGFM0fSTaAovVxlWfpJ24HRhhgABxTh0nUFAuHyX9cDyRiURsgZ7K4AQzgAOQxbhvLkEB_K4QK7LoIY4AAGXQZwPNI8jvMIqA_LpBLgswMimWxZT2HYbBOgsLL2BsLyuE3Ri6U4K12AACWaRkAAoAEorKTThiEEyVurpJMLDmVwkwmnR2SyNgZAitJ8mAAlOkQ3RggwRQbE6qAMF_f8uHaotdJ4ABCRp2WmmaUQsTIdE4MBRgAYlqGhWAgQFVr6rz6u64hHLgXQnNcsivHohqOIEGBet2sKNLibBbom2IpvGrheri8SWqM9hiNeP6-xRIaRq4Ma9QmjGqZmiw2GKr5MbugB1HINggd9OnQQSuComAAH4uAsdRxgEDZCydUY6E0acuEwS4PNWtcgc55RUVCxllpgMQN0UOpUbp2IGeCQ2k2AVWQc19hta4AAyO2KeZumabuu7JoGM23ZRABNHmAHJOD5k5X2F2iaBQGwdO_Q04nD-j6ot4G8Gt7XxO9tHXYz-73WIYgaC4T6oG-gFfv6_J6stvBcVquA-v1vo4GwTBYBGJPObwTm0oy-jat253vfa7AGVD4rGQHo3c_z6gvczz2J_hif25Brv0r6XuSq4IWxG79eUDwA_amxKvWuYAmSpSzniHr53Znn2nsdnVpSfx2rL4JYnMYgMAKYuqux6ZHgWA9Egb9RJvqMm7BqBxXrM_CB6RyaU3dhkFu3BFJLUiqtdam0AHv2IP3WmE0gbNFnvqTwdUJ5EJ0AbShZCgY2G1nEehtD7r0JKMCYukkmE6FIfdeIFDCFkPiE0ZwpDPAdDeII82_8SogxlOMbq3VgB80iurZinCYDqx4iCASQkuCKHLonFhXBIGjWMawgR2dkEuBFjwTyTQIAoD0KtSsXJ9Z7FWto_igkoD63qEwloUiM6eBcMAfmigAm8LdiEmwFsOGsQifEQJVihEcSiSiR-QT6yLyCUwiRXsmHN18JjTJsCJIojfJ0GMXAa6yM_rTKuq8e4oFqtDdgsNmq0xMASEx8BzJ5AatgY4soNhgHSNkMaIA9DEHGHARAsRTzjAgHgMW1AgRLKkJmWI_QABMBxZFiFKfqGRjJ3zeSGSM3pcB-mgghDQPqnSkyNNSmvTKm8cq-RgDjOBp8epgMxqYp2gjUiyhnsvUGzBwbuShkLE-r8ib9WPsnX5HUursHrnEGU6hDZHPEuJPcexDwnDOBcK02hSBXlhGYRgkEnwwVfNpM634jooUAkyzMOFqC0ugqpcYLKAIgDQmeTl8ho56TPB2bqGYKACDSLQPAEj1aSWOFwXlfVMkEoPIcYlJ5sGYWkGQYwVL4RIDQFgXA3UJH_L1GAWEFRCI8GgJ0bEYh9oMi8BQTIiNYY0lVasXA6sm7UDgPiRk38xKtC2gddAA0uAyzxBxCIcBbXsB4NiAQkxGSevytQXG1AFUXyvrGqI6ZGQVCoAdCYeRsQVrYLMr525I24KLRxYtK4z7DnQHnTM2J2TjE0JsdAxcCBcGLk44gKBOCdAjRJAtjI8FxoILSfNzaelA1jX8Age9e1cn7TOvcpATCQH3nchQ5BrzUoRH2MQVAHzQEZAAeXWCyYNCZMZiEhIJIIABZCYbIYaaPfSAYumA2RrjEPAAAbL6gUHKQAbmXUmMQEJNAmk4P8aciH-wobKBhlcnQTRip4OCOAqGQBYfVLRb605j7tMA7TMQRwu0tggOOMUH7th1n0Y2hQig-NAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

When "Have a beer" button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the "Events" example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of the two renders rule to toggle "Loading...".

## Composing Components

Our `App` class is getting pretty hairy - why not to extact a component out of it? Like that beer table:

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

```jsx
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

_./browser/app.jsx_

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
          What is your name? <input type="text" binding="this.userName" />
        </label>
        {this.userName && (
          <div>
            You're now a <strong>hyperdomsta</strong> {this.userName}
          </div>
        )}
        {this.userName && this.beerList}
      </div>
    );
  }

  renderHeader() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreeting = true)}>Next</a>
      </div>
    );
  }

  render() {
    return (
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeUhadgkE4yBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ez2zIWN1FMWAUASc1DT08T8CvWymAAQWhJhkM0nx8AodwmFk5SsuRCgFE89BXNwDyvKYMgYBJJgguqkKivUow6LkLgR1wJz2SUIqStLAyKFMXBmHk4aAQRf4BkGK911muamAAdSOLFPKYJQSDGurlRgAB-QYrHYUwsQs1QISoeIfyYNBYiscwrvKuAUFMckADl9seZ5kQGVYFpwJbRGAMqKvetQvoCJgADIYcKv65sBYFgeWyodoAci4OrSSYfZcn1YkyHMJpAIjctVkJ8gSaysHXoh3AoZgOjlv-lYZsRlhlJZ1nQZet7Pv22H4bpyrgv1Hm2Y54awoIz4jG6uJcGDd41EG5CWC4UbxoRqbBml1nBgUZ0DhSuBTmAbTdKSHAoBIUImhVqA7aYMBiUjUMNQjfJXmdVHBn2BQuDACEAGJHnIZKICFC3BtOJpCtF8q4gAcS4HhHv0pxTBgbmmg-hIKFWDBgfhFHkVlphOoV6glfV5EtbGibEZ2NMyCaPmKuTmA09c4ZiaYI7RcVtQ-t-QaBGH2u1BV3o1e51ZUysWbK7ouiGJAJiiVJckVmamqKC4nisllDJHKxMntH0nzjL8hSvY_EAws07ELN06_DN8_yzKtqybLs9qjBIrRTFHFdwvB9LJQwKlfeIUhpyGgUoOcTAdTNTgPXYacRYBUCYKLbAdp2oDFFp5NyJBeiPWalnHwMBAHDRfs-c01gYD6QwCSNMWIwA8EOP5ZIFB2BwEQCsdi7AIAoFOmQYUIjrLaBWBIAATISKqADSr83wbgRKeM2EjAMnARhJxxTkDavLIh_MSFkKBMTSh4kwAYCgCcQhVdjEGR6uULAsAMEDAgGAROqilHFQ1qIRuOtJqG2RoiTm2w9hoFgKbaB5tLZvysmog-DsIn_TKu8f2y0hi4CyazIYCgnh5OyWVfO-1VilLSfk0prjzBQCsDACpChinbDWLkqpAI1hvF6C0oYPw_gdJBngpRKBUzsFkrJYASoAjSFwSKep9VZn-BFDAAA-mNKAoRirxyGobQ2QTm56z2ZE9pRzjmRI-Gc852x_DmAaDACA5hkgQgAKxukePiC2yzRTrNwJsopgzQlrEudc0JFA-hTP2qECpILQUlIhXsOpDToXApadktpaLRDKUBVXbmgyKn9LyRUtxmwIll3CXrSucsOpOJHrgDxogvE-IqmY8hliqr-MRgc_WKNSFsvMCgQV5LZqhCYDgE4uy5rcpCfkg2ezvhnXyswSO9SY7ADjgnUWqClFFVFUCOAJLwSd1eqyix5hmoO2DBgW0eM7pVVWF2CgSq8nGpQHS1x0S_J4rOcKxGVLHE0toryRiBBmI7zYvWcUx8-K0BfpfSM3lP63x4YpR-z9z7pUyomoyJkArCJhE_Wh8aUAcVrrJTQ-BTABEoOgfqsz6qNQyuM5SYUN5bxYrvX-r1_7RuyLQRAdSSCYCgLJfpnKjBuEoJ4GxWhoBKAECGHAtphj4H2AXHOMh0rolsbMg11g9RqC8e1auNtnZxmQtdXU-5XDuC0AIUw0I1CrvsWEeWYsWpCWQosDQagTQkGdlCE4AhSAAf4TQ194V30H1wbgSV36laeEWE67QAhnTsHiNif9YImD1KeRQcwXAlDHrfckuB4LDBQbI4U5C1Z1BmtQ26dDxH6KhFY0AA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

#### ** Typescript **

_./browser/BeerList.tsx_

```tsx
interface Beer {
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RenderComponent {
  private isLoadingBeer = false;
  private beers: Array<Beer> = [];

  render() {
    if (this.isLoadingBeer) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
            Have a beer
          </button>
          {this.renderTable()}
        </div>
      );
    }
  }

  private renderTable() {
    if (!this.beers.length) {
      return;
    }

    return (
      <table className={styles.beerList}>
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
                  <img height={50} src={image_url} />
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

  private async getBeers() {
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }
}
```

And use it in the main app:

_./browser/app.tsx_

```tsx

export default class App extends hyperdom.RenderComponent {
  private hideGreeting = false;
  private userName = "";
  private beerList = new BeerList();

  renderHeader() {
    return (
      <div>
        <h1 className={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreeting = true)}>
          Next
        </a>
      </div>
    );
  }

  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding={[this, "userName"]} />
        </label>
        {this.userName && (
          <div>
            You're now a <strong>hyperdomsta</strong> {this.userName}
          </div>
        )}
        {this.userName && this.beerList}
      </div>
    );
  }

  render() {
    return (
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVKg8cboPIVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFghUPRpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREHJq424i42DgXFT6czPC4YCOP7ET8mW_MQAG55AfCkiS4F8302ItYHfP8s1RPB7gQ-ApBkMCIMfaCACEYCZAAZCACV_f9UNiQiSLImdwLcahlSgjZmDAbAhA2Vg33fABBSYuGVOECHfICMyzPAACVOyZABhLMKSY2g-3pcZVn6KduB0YYYAAcU4dJ1BQLh8l_XA8gYlE1IGTSuAEM4ADkMW4Uy5BASyuGsjS6C4TAiPYUjyNMpjji4GiArogAKABKBj6U4a12AACWaJkYpU_UUU4YgBHYKVIvpZMLDmVxkyKnQOSyNgZCctJ8mAAlOkQ3RggwRQbBSqAMAolCkuLcSeAAQkaDlSrKlELEyHRODAUYAGJahoVgIEBer0vyGwuEi4htLgXQdP0oivGoYzTOIdgBBgaL2sK8auAcoTbqKs8xuekrbtiudWiymT2Hw150v7H6cryranq4YqBlesqLDYPyvnB5MAHUcg2MiuE6dBcq4dE0gAfgh9RxgEDYi2dUY6E0GdfMuIz6vXHayOUVF7KZWqYDETdFDqaHnrh4JeYNYBGb21n2HZrgADJJbBzK7sh-ZEbKgBNLGAHJOBxk5XwhgkjhOmwxO_I04j1mgUE24XdrwMX2d3OXxtmKGleupWrbIm3HOcqWZZFvA_Nogl7cd2J3rlz6w2-rgEuYdhAdu7Lcvy8HUjlagbHdvbtOYQ7DJOrgCb9mOmX-rp0uxIvfpS5w0uuuJZXUaGI4bHc9xUA99kOE4zmo_zAuIS9r1hMxGEgp8YNfUT-u_HqAJAI2sxw6gx-g2D30axDZ6ojfMOkG44uX0x2HYoIwv8jKUVxmBsT1oyPIyNB1Gv-DVhOjyH2BGAAH1cqgG_zrvq3RizFx5sQ4lALi1V3zhX7oJKmnYp5fgktJRK8lHxKQ2P2LytkyLEXQM4Iy4UTJmSgBZVS6lbIB2ZNiXi7B2DYE6BYcKm1TJbgPj9RK8c5YQDAFtP2uD8F9BOuFaKF8yqJ1BgrGweCCEnTwPIp28wPINkEqQ7gQMDQSOTg7A0UilYTQ9MQYgNAuBLSgCtAEa1REbS4H7XE4U4AxW5n0OA2BMCwBGJnPAAjZEoHCjdHR40krYEZDrKh-iIYHBJsY9OESvHF3YCUNxsAnFK0UYLZuBpg5cHtuQmyPkElJPcTALhyYeFbUGn7Khe1YAnR2qIjRwMk7KJyVHJpoMCo6M8Mk7g3EarOXqjvPaVD-4BLuhDHazRBZFXOtMmGO0eYRImjtGw7M4grKWRMnQNgkmPyYus7ZET1nsDmQcqZaTiAdDeIEoWVT_J7VlOMSKkVgA42cszB-5imLMw_iCH-7AQiKGsZbTZWjZbjMdrMzZMyWg3IhYTHgxkmgQBQHoeqVZuTcz2PVX539f7c3qNC3R8RYXwshS4YAV9FDrNJWSmFGdPlP2pSSuZIcoVwoNJk8ZQLslsquYLdZPSm4eVyfqbBPk3ydFjFwex9zSkGn4XAGRQi_HnzOhdGA7CDQmHIpwOAik8jEOwMcOUGwwDpGyAVeeRjxhwEQLEM84wIB4GJtQIETqpBZliP0AATAce5YguW2OttUo1JrvDR3gAa0EEIaAxS1SiRVyrCFqpIWQyO1B7b7j2Eebup4lTaFIEPUw8I1B4WfJPD808ULITngvbM7lcIsS4PxcYW8xBoXPEveQ9a8Dnk7JFTMFABBpFoP7V4zMQotsmDFCO2bDxdxPOcIZWEyDGGHqWxAaAsC4Eilchp9IwCwgqOxHg0BOjYjEJ1RkXgKCZAepdWkLbVi4GZq46gcB8RMh4QxUVLUuroDEZTPE50IhwCPewHg2IBCTCZHe9Nf6Rl0TEVEDMTJSToC6hMPI2IqBYdtZqoB8h_Z92Q-dFDq5Y4jnQEYrM2IOTjE0JsTDwwuDmNRcQFAnBOi_taCRwOpMCB0moPxiK5EFlYOcCq-j3JGO8YUO3UgJhIAoHBJCBQ5AbwjwRP2MQZInXjgAPLrFZB-xMt0xCQlykEAAshMdk51LrCeTGIcxmB2TrjEPAAAbE-wUi8QCbmcwOCEmhTScH-DOYLGpQtlEi6uToppe2hYLIaABFAZwVw1dF1ERwaOtggBOcUlntj1laZmtuihFBAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

?> Since `this.beerList` is a component, we can specify it in place in the jsx. Hyperdom will implicitly call its `render()` method.

## Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to spend time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` - to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router:

<!-- tabs:start -->

#### ** Javascript **

_./browser/index.js_

```js
const hyperdom = require("hyperdom");
const router = require("hyperdom/router");
const App = require("./app");

hyperdom.append(document.body, new App(), { router });
```

#### ** Typescript **

_./browser/index.ts_

```ts
import * as hyperdom from "hyperdom";
import * as router from "hyperdom/router";
import App from "./app";

hyperdom.append(document.body, new App(), { router });
```

<!-- tabs:end -->

Next, on the home page, we specify what there is to render on the root path - `/` - and also add a link to `/beers`:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

```jsx
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

#### ** Typescript **

_./browser/app.tsx_

```tsx
import routes from "./routes";

export default class App extends hyperdom.RoutesComponent {
  private hideGreeting = false;
  private userName = "";
  private beerList = new BeerList();

  routes() {
    return [
      routes.home({
        render: () => {
          return this.hideGreeting ? this.renderBody() : this.renderHeader();
        }
      }),
      this.beerList
    ];
  }

  renderLayout(content: hyperdom.VdomFragment) {
    return <main>{content}</main>;
  }

  renderHeader() {
    return (
      <div>
        <h1 className={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreeting = true)}>
          Next
        </a>
      </div>
    );
  }

  renderBody() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding={[this, "userName"]} />
        </label>
        {this.userName && (
          <div>
            You're now a <strong>hyperdomsta</strong> {this.userName}
          </div>
        )}
        {this.userName && <a href={routes.beers.href()}>Have a beer</a>}
      </div>
    );
  }
}
```

<!-- tabs:end -->

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project:

<!-- tabs:start -->

#### ** Javascript **

_./browser/routes.js_

```js
const router = require("hyperdom/router");

module.exports = {
  home: router.route("/"),
  beers: router.route("/beers"),
  beer: router.route("/beers/:id")
};
```

#### ** Typescript **

_./browser/routes.ts_

```ts
import * as router from "hyperdom/router";

export default {
  home: router.route("/"),
  beers: router.route("/beers"),
  beer: router.route("/beers/:id")
};
```

<!-- tabs:end -->

A route definition can be specified in the array returned from the `routes()` method. It can also generate a path for html links - e.g. `routes.beer.href({id: 23})` returns `/beers/23`.

There is one other thing that can be a part of the array returned by `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there. This works because `this.beerList` itself a has a `routes()` method:

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

```jsx
const routes = require("./routes");

module.exports = class BeerList {

  get beerId() {
    return Number(this.beerIdParam)
  }

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
          id: [this, "beerIdParam"]
        },
        render: () => {
          return <div>{this.isLoadingBeer ? "Loading..." : this.renderCurrentBeer()}</div>
        }
      })
    ]
  }

  renderCurrentBeer() {
    const beer = this.beers.find(beer => beer.id === this.beerId)
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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdTeEimYZkcwyBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ZSHOsLFiTNeB9J84y_NMlYopvFT1PbMhY3UUxYBQBJ2HcXh9PwK9bKYABBaEmGQzSfHwCh3CYWTlKq5EKAUTz0Fc3APK8pgyBgEkmCC7qQqaidPiMZL4CalrSwMihTFwZhhDmlgprgJJtD85CBjW6g4lwAQZtOJpZt23auAWpamDajr2riABxLgeCscwmAAfhu9qNq4EdcCc9klBmgRbp-_a1GDd41DG1bRDo87QmUyCBlBzrgtvOaaIIia9r-tyMCUU0KFk6Vsmanb5sW5gdjTMgmmAUnKFCVZUysLY6LkX6DoB34Zopy6qca5EAQRf5dtyK91zF86AHUjixTymEJxa-uVGBPtyKx2DNG6wwhKh4h_Jg0FiV79e-lBTHJAA5NXYVWLWzWl7YVklnBnZYCnztRq21FtgImAAMkDwZRcqU0AHIuD60kmH2XJ9WJC0mkAiNy1WRPyHMU7gB9m21eZlZReFuGS89vO_bVoOQ9yfYFC4MBTmAda0dwDb65gMAmtCJpgwwW04-NrrVgwJp4fFovgTFsKjA5ybwdwSHemh8nkQF675NhwEp7LwYFGdA4SrgJvtN0pIcCgEge8hqBL6YMBiUjUMNQjfJXmdD3BjrhuIQAYkecgxUIBCibsdU6slUb3RgE9Vy5o3riScKYGAyke67xYNbBIlZYYAnYs7eEO85r2VnmEXkjECDMVJOSFYw0eoUC4jxLIsoMiOSxKnbQsVDK-X8mw4CRDNLYgsrpDhRkTIBXMpZDaNk7JpX4etYRXDErrVShNTK2UxR5QKnpcSxUMClRoSFWacgdRDzUAASXUHzNePBBbW1MFobAuAIEW2wGY9QExnBaBntjdKLBdFKDnEwcgl9eiWLmqjTybkSC9FesNfSiDAg-NELI-A-VrAwH0hgEkaYsRgB4IcbhFAKDsDgIgFY7F2AQBQNrMgwoKnWW0CsCQAAmQkXU7KtWcW0jJWSRgGTgKkk44pyAww6R1CJUSgQWlieJMAGAoAnHGok9aoSBjr2WiXFuLi26yS9qILmagjrNROmdc6ezrHXW3oiXOFtxnRKmV1D6xhIl3PMCgN5jwQYW32bgcoWBYDd3wYiXe48BiI2RnsomVktk7N3ibLMr0SknNOaCdQAhBCg2kPeLq5j3HKjYFjU5hFkXfMOWJHOaDKYXNFtcsZcBnmTPMLEz6bB6WvTeSgD5X0OrfNKItX6FBhoAsnkC7BTAQVwy8aIAlc9cYHV5bgflgrV5zX4VsuJnS7QoEgFmWSarjlbJQGCMSpwEEatwOYyVe0rrU38G9fETcDX-BFDAAA-otKAoRniLM5gvX5aB_nKtWec5gm9zqXM_kMP56SdG2RPoIqFXVaGoNFQCNq7xP4DCGLgDN4s2pPBzZmtqTR_YwFWEWilhaFBNF-eYKAVhS1rCrRW7YeavUppdk4HNZa3i9C7RQH4fxm00o2lsjaqZ2CyR2WCTFSoAiYr2LW-tmKnWijdbgD1RzyXtqDdaoW27c3ZubWGigHx93Is1loN6bwIDmGSBCAArG6R49rgArtde60I-aj0TxPQW05Qw-jAFnTAQuv7v2FsAwuut_VQOnuRfBwYv7a4NB_s3SFI6upJAblO9QiMe5wAUKSEeDIwNno7Yesjlr4N4YpWWgdEa1hRrwcK6eiy6IMRAExIklC2L1nFAwvitB-E8PkfFbhikPwgD4SwiSkLcCidETwpKcnlFzhkxVdgCmEpiI4qpxgPCUAcX2rJTQ-A7HZHQIDGdA1yrQiapi4AsnorycRmlDjXGWJUJbnSAT2QhMyamvJ7ynCxMKRfg0wLemMrsjUbleI-VDRaJOYRgIAhAsoCmv5FYKlIKjrS3JjLkKsujpy3ILZ-XnOFeisVtpKxEBghUmENzfIPM8YpKfKyUjfNMMQLWkgmAoC6sBoG--vFPCzK0NAJQAgQw4FtMMfA-wMFIJkOVdEczMVwAPHqNQEAwBpTnufW-cZkIG11PuVw7gtACFMNCNQi2TgHYmq3WhJzFgaDUJ4Ugt8oQnAEN9q8xSYBPfSi9gxTg3sUU-4sQp2gBDOnYPEbEJA63qCYHW29FBzBcCUCDxgYOhInsMATrEebkLVnUAy-HbpEcg8iKEUIQA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

#### ** Typescript **

_./browser/BeerList.tsx_

```tsx
import routes from "./routes";

interface Beer {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RoutesComponent {
  private isLoadingBeer = false;
  private beers: Array<Beer> = [];
  private beerIdParam: string = "";

  private get beerId() {
    return Number(this.beerIdParam);
  }

  async onload() {
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  routes() {
    return [
      routes.beers({
        render: () => {
          return (
            <div>{this.isLoadingBeer ? "Loading..." : this.renderTable()}</div>
          );
        }
      }),
      routes.beer({
        bindings: {
          id: [this, "beerIdParam"]
        },
        render: () => {
          return (
            <div>
              {this.isLoadingBeer ? "Loading..." : this.renderCurrentBeer()}
            </div>
          );
        }
      })
    ];
  }

  render() {
    if (this.isLoadingBeer) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
            Have a beer
          </button>
          {this.renderTable()}
        </div>
      );
    }
  }

  renderCurrentBeer() {
    const beer = this.beers.find(beer => beer.id === this.beerId);
    return <img src={beer.image_url} />;
  }

  private renderTable() {
    if (!this.beers.length) {
      return;
    }

    return (
      <table className={styles.beerList}>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Tagline</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {this.beers.map(({ id, name, tagline, image_url }) => {
            return (
              <tr>
                <td>
                  <img height={50} src={image_url} />
                </td>
                <td>{name}</td>
                <td>{tagline}</td>
                <td>
                  <a href={routes.beer.href({ id })}>show</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
```

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVI4CLzUFAVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFghUPRpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREB441XG3EXGwcC4qfTmZ4XDAR1_MQvyZH8xAAbnkB8nyJLhX3fTYi1gD9_yzVE8HuRD4CkGRwMgx9ny4AAhGAmQAGQgAk_wAtDYmIsiKJnCDqCggiyTzKjULEdC2ITEAmPkZVoI2ZgwGwIQNlYd8PwAQUmLhlThAgP2AjMszwAAldByXgABhLMn2oMw-3pcZVn6KduB0YYYAAcU4dJ1BQLh8j_XA8iYlFTIGCyuAEM4ADkMW4Fy5D4kyzJ8zASPYcjKJcwzjiI6LYuIAAKABKfj9R4uAMuM_UUU4YgBHYKV13pZMct0LMYFS_tk0KzsmWxPL8hsfKGoaoqSqlYgrLgXRrLskiKScgB-Lg-oovBOGtdhCNePLsSmgbZuYdgAAlmiZDKPM6rhdwKg1FHSukjpRFa8Ci-j8yOzc9sO-k1rI7BOi0tKbzMbEVJ_PAADUfzKdhgTSWh0o6g1utKrhUjlagbGAT7aEUOJZXUGwHtaRq5q25wdvB-quChqVUoqg0LDmVx9phnQOSyNgZECtJ8mAAlOiQ3RggwRQbC2qAMA438NuLVSeAAQkaDkqf2ixMh0TgwFGABiWoaFYCBARZ1r2tSy6rOYYaHMpZzJvYAQYHSnmyc6_yFOt8mz2l5NZgGJ2uEyucsaJpr5sWgmyeJrhSfOmHKftlELDYKKvnDg0AHUcg2CiuDekquHRNIJosdRxnJSbi1GOhNBnLhMEuRyWfXFblFRPymSZmAxE3RQ6jd53Yij4I24NYBLrr9gG64AAyIeg9jiOw5DzqAE0tIAck4dOTjfGGCSOSkbB-rMjTiNeaBQdre_6vB-4bw7qYj2JJ-py3Y6P6bT6C4fR9lz8FZZqrruZXQFYynmNuwIyFeX84jYBsOfBqLt5hkw9mGHce4VAHn2IcE4ZxaLJQYpea8sIzCMBYjBOCykRY_kFimYhWZcLMXwgQt8H42ZIVIVxDC7MsLSBuExfBGwcqMJANxd6vEsrqDoOwUSQQkpMghsMbE1ABA8CiuwPaGcYDYjXo5PaGQ0DqGUQhVYlI9oPmBDAAA-iVKAKjiC6JQExR6hlNBCS4CJMSUAJIMw_HRGKDF5LF07EQ78alNLaTgHpfChlaAQy8uZOgQw4CkXQM4Ry7iTaiSgO5cK3kolfzgNiaS7BgadAsO49qLktx7QiZFaKABJAgARgY8HMZYk2oUsqeQilE3EpdKkEDyoTQO_lZHyN1sfL-VSakYlgQ2L275Oixi4DQDAzhulk0uhRWJ8TKSJJchY82zSDQmEopwOABk8gm2wMcOUGwwDpGyKTEAehiDjCybEM84wIB4FztQIELypBZliP0AATAcaKNxxkGkupkk5ZzvDe0OTQPI4JITUF2l7C6x8VlxL6Os6KSS3IwExm4bK_Dcr-yOoHcqIdP5ArqrHZ67AWrgzahDamgdg4X3JpTe-A00VrJQIkiaYhVkYpQHgYVtRlrHxpSUbAmBYB_ygd3ZMILOoQOTCdM6nUKU7UJsmMuGhHJZMZftKRXAq79Rru6TpozswgG3FPA6ar9o0rpc5Q-49vbFWhiy1lodXauuTByvAXLBW8tRAKxywq8CismuKn2OkSqzWIO4v-vqYZXx9balEiqGrKuOulMm91Pb4uxutRZR0IBgCDssmJ6KEnRWJeq9IPVvXzFDZScNcq9oNnkik7gWq3WNs9Z1CmabWXtHJMQGgszYxQA1gCLW9L2qXVxO4olLc-hwClbAEY_rA01qZFbdNBoAFAMyF_V1cQPTEHHfDV1_qJUbtqrfW1cr7aZogTYotTJY25LMImutuzYUbC_ibMFQK8CQA0KlIDDKv4BoIM5fImyhmdMzYHbOPAnJ7BZjBgxIITHsCgC3eoeK0mRO4He6VD6DVlqDmLEDTIBqwEpH1P9lUG2lQ7QdZFfaPX208Pe-mUkG4s3oVhL-KV93U08E0Zw8ryYWNk87Pqrdk1SZsA3OIfUFNyZ0DYSVmjDIaZ0yppT9Qz3xHYLJwzzRLPEA6G8A9_rMl4FlOMVKdUhgEBrkomuGjp2GRrjh4xpiDrzoNUytjJNk0R3k1FuTLQD2SYfE5JoEAUB6BZlWbkLdMPAEC3hgjymEuQPiPFr1kDiAuGAEolGJWtODoqwjXzWiasNdi9F0rZXIFy3fsADV7Af4wDAO54YIWeZwB0CcUBdXiutaK5fGLRXM1KsfZJ-Idnu4afvW7EFh1Dr7j2EeVBp4lTaFINg0w8I1DUJfLQz85DfwoUArc-7lDOGwVuzxdgPCt48FiJ91712uCyXGDw9C55KHyB-3gc8nZUqZgoLIswV1XheZgIlYHGUa7ACJvwr7J0mL7cPCgk85wqpnfIEjO8V37GEJx9pL7j2yF-N-_9sK-LBIEUceJCGE20jYk-zNfhNzYhiFOvSTJ_PceC-0sLzJov7Vf0l_T6XdBZdAtiIgYYoudwE8QQd4naCRMDTYed28jBEBoCwLgSDrw_1gFhBUUSPBoCdGxGIPmjIvAUEyLbc2tIgerFwDXdd1A4D4iZGW6xrROb83QBDIueILERDgPb9gdTfKTCZN71J1AbFXQwZRfsUQMxMgqFQfmEw8jYnL2wB5uL4H4vzzdDYFiIbF_WiOdAl6szYg5OMTQmx0DTrg9OtLxAUCcE6FHxvYnPEVbOk3jxlElP9j-AQQVvfuT9-n_uUgJhIBCohFCCnODLv9jEFQR80AmQAHl1islD4mMmYhIQlSCAAWQmOyLZMB7UamnZgOyGSp1GIPAAAGwFgDigSzh3R_6ogQiaCmicD_AzhwFiAIFlAoGridCmhQ4IGQEv4WIawzjLRmy_7P4gCEi4imgACioQVYBBIARwXerYEAE44oL-2w9YnGueCCigigQAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

When beer table page is visited for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. This way, even if the page is then reload whilst on `/beers` or `/beers/23` the data is always going to be there to render.

Speaking of `/beers/23`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

?> Note how we use a custom `beerId` getter to coerce `:id` param into a number. That's because all url bindings produce string values.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
