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
import hyperdom from 'hyperdom'
import {hello} from './styles.css'

export default class App {
  render () {
    return (
      <main>
        <h1 class={hello}>Hello from Hyperdom!</h1>
      </main>
    )
  }
}
```

It's mounted into the DOM in _./browser/index.js_:

```js
import hyperdom from 'hyperdom'
import App from './app'

hyperdom.append(document.body, new App())
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSjGb19_JmBxHCgSTTCI6JQLOApJWDgUfDg4RLJGGEcUgLkYMAwAVygA_CgMSqYAQRs01S4yJtwmAAoASiHmUS4KVtxmCdVRJgAeRQwIMgA-NfXN8QBGJi6euABedMzsvYAJO9zQh-k4pQBCDYtTg7n1j9trt_uspqptGRIboDEZTOZcBZdk1HPYEMhXOQqDRECBkn4ArEQpFwqEYu9idV8akBuwXpEogVrOxqowifEUMzqHIJgp8K1FB50CQ5JI9EwyDATP0bNNwWQYYZjGZLEUSvBypUXG5sZ5cYgAOZZTBQCZoEWSGYMOZgLEAWhaimgkgEbCeUAAbjwIPgMEwAHIwVowNjivq4CAYKDiuAYMhwO0IiBgADcWkYjBQGSgWVmLCojgodoouDjcFtuEUAlaNlkvvMaahOn0HAw-AA1hgDTA0eRtViPLRrWIQHB8BH2Lx-HnRGwihh_NO2CYYGh2G323amh7E7IvbhQ4c2GhWtA5EuQCu1xuVHN9Ko2E0ZKNqPgIPBp8PZyB2UoL90qCKW8WHvOZHxgD0ABEYGfJoyDfD8kBnEcAAFMGwKALFILh_wwQCKEPAFWEMLAcDtLIMDGXD8MI9Zj1IqA7U4bgi1_ZQkLYAD4AIkA9CPVxYDjO0r3XDsmKgVoDV2ajuNo78KgTCiqI4kAuKA3j-PEChFEYkSN3EyTpJUtSeL4oi52KWByJISjZBk9SzLoy9V1E9t7NM_i9LEroIHcuSRy8zdt13XB9z8kAIXTBUW1jUZzVRNxIANXsFQxHVB1xL82CoHwuIvMgRRDCKm2igxAvKcgkrRft3BxTF4wCdcKHEJgriYLgAEdTy4CYoia8QonlNwiiYB5tKgAB1FyNwABQkqTmDazrupgXqtJ04TprE9h5t2QbGGGgJgCYABhQSyCm68OzmwzmByJaYC6iAeqiLoYCEwKDIW_aajIRQRXaHs6gaOBWpnf6mgEKJtxwEh2EFSgokcphtwAZT3WQBC_Fg5AgWM0FgB4SCKE6Mg7AQS2DZGWHEPGKD8SQBggAAxKMoEwcmmEpkM72R7d6ZIKAoYgqNExIJZ8BgO1thZZGPFwF18gsOEVURZE6jRJHVHFih2FaCgscOSBYDIDBBShk9RlgTXqaYPWCZ9Ga8PEKGLC1oj-oEfqUC4OBBa9CYAH1A9x5YzZgcUohVhEkeiXGih-kDkd9_2YENoi6mxOAIHIOABEERkHFjwunCiDRedUHbbrzoRDklaUzvei6tvbG6FumW369G8bLtctvdgmYAKAgChYCht5gniJhoP-qJNHlFg1GRiHAfT9ZcEBmvhCIlhsaOfCBAseh6DRRwAH4ABILFt9ZWnMC2GOs2zcGqI4mFAt-9_WA-mCPk-FKvjfUQd8061x3kcL-b8mBKUxtENUVkYEv0OG_D-UDd7IKgYgqGCkn5jHdmg9YcNh65zXgQ9YK9SgUw3jzMhIEMHrEhGg8uKDDjMPflFXQmhNBAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

It's mounted into the DOM in _./browser/index.ts_:

```ts
import * as hyperdom from "hyperdom";
import App from "./app";

hyperdom.append(document.body, new App());
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQE0IrwACgBKc1q6-pgKKLQmAQAeCQBGAXjEgDlCLhgAXmAJKxs7AD4ACSXbFUUBNZlcrgBCAfwRlcN--yM7IxA7ABoQdGxcAghM4MoEZBBGFiqOCY-IIRGJJPsdDttupNBDdAFjDxgQIUsRHDsXERSAijDlIVwyCRZJkmgp6FEZiwyCgMHIpPcBJUsCjSK0Whc7o9njg8G4PF4fH46L9mBkKBxEABzGwoQhQJo0ultGqXMCigC0kS40CkiGcIA2UAAbt0IPRCAIJjAojANAykmgIHKGXBCEw4OrXhAwBcbkwjGRFtZbCq6qxqBR1RQ0G64Gq0Fw9VFSHhzbhfbcHiBpRhZVAyHIvsK_mKOOFxg0BFxaTEYPqhIL_CBM49iIR6ABrQiSmBkABWcGYxdFAMQIFD-qY01tSH1Pcj7kI_BgcnV7wgkaodo6Gjg9EdxC3s4ndV3FCXFA0eo0WBgKDbnfV4SNnrwJrQ28up6eUWgciv-q3ve7YdhoHQPDuIDhMS4RMPQEDwABJ76ni8KzhoABMZDDGQAAMYGXBBlwaM-AAiMAwWw8GIceHTfvEMBuuqQEPh26rEFAUSSu8AEaAkrDuJ-nT6r4Ho2IQxS8SA_HwJeID3HRKEUFwUDMXerHsZx3H-uh0mEAJckKV--ruJ4MDquJkm6TJgnyYpGhUBZGASXgUk2YZ9kgB4sh7gecnXnpBlCZ0N7qSBbn6bJwXfixIHqvEEARUFdnGaFwGPs-r5oO-SVRc2hHXJyICupkNLUD4zCQJK_aDkww7_OwY4Tg5MA8DJUlMLSM7XC2Xl7pVEDVQOQ4_CWo7jpBjA8NAeAAPKHhAzBNnqyEaNWci1lJZRcNWTAAFIAMrRSZGC9PQMAALIkAB0Y2kZwl8RAKAAQA2op37wAAbMd35oYpAC690hSAA7UFJDTth5qUgzQABikN8FIUmoXkoPHQ5S7zlJACiB3fSlD3FdGZr-QIt22gVTB-kVsWdhVTBVTV9WlmOfzuAIbYUBIAizF0ACOv4NE0ADknMSMLLRGGzghrMpUAAOphZ2AAKWnvDz_OCzAIsSHLanpWxHFce8EtS0t1QCCUsBuorBuq8b_QOLzDQCxAQvCwxTG04batMKb_pMOttZkMEoTiLzE7rTAerC8-VgYMQlIUMLQPPgdb54CtilyBArooLAawYO4JSLJ2erk0DdQSLnFCIykEDw9Yspl2TaA2uBqcwEatcYFAMdd3KnqnWg53qlwJApx0VRoLqAjC643KvPg7zhOVVCT5cp0UMQUQUFnxmQLAU4zDHKBRJksA1Rvwk7_nZrK_pEgx_g1-dGLepi2QDSDsa2sAPp_xzn0acDJhaLzwCnOeOd3D-zqEROo39e4mn3sJdIbA4CLXdHqF688ByQPnuvUBXxqDC3-h3DoRttJwGwYpJkltrZMFtqxe22lWiV0ZDAZkssVJMJAiw94TRgAUA3LAGOextC6AEORasws7CS0uIDDoQdRHtGMm3LwNDjJ1GQsJAyep8BqDUMQgA_AAEnwOw4SURcAoOEnYyymc56OQcWgYW71Oh-jsfYSxqivFhlkvowxjZzE-LqNY6OAg3paLsTovxLiY6mVgE5Fyrj3HCXgX47RaT7HOWKDHUSyTiiv0yXUBOwilq2JKZ0ZR8By5twplUuB2SmnRLqGQ6JnjOjtJadTOwfSgA" target="_blank" rel="noopener noreferrer">Run this example</a>

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
export default class App {
  renderGreetings() {
    if (!this.hideGreetings) {
      return <div>
        <h1 class={hello}>Hello from Hyperdom!</h1>
        <a href='#' onclick={() => this.hideGreetings = true}>Next</a>
      </div>
    } else {
      return <p>Now then...</p>
    }
  }

  render () {
    return <main>
      {this.renderGreetings()}
    </main>
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSiAbkZvX38mYHEcKBJNMIjolAs4CklYOBR8ODgkxkYYRzSAuRgwDABXKAD8KAxqpgBBGwzVLjIW3ABxLh4IMgBzOAAKAEoR5lEIMCYlgEIKcQgKw5bpmFmFuDWGDdEmLgp23GYAHjkIADcAPlU7lhfxABGJg9PpwAC8mWyuS-AAloflQrDpHElLsXhYgT9bn8XhhAlwwOCogBiKJMcg9CD4ADWkNWTHBXyYByOKBOMDOF0WjJZuHaME0XwAcg0KBiMNi_kwMe9vr8mHkcOZ1tKHk9XuwRaYWVkyCgDRitQrtBtTaNqBMdtcFernjLFBg5lK_sBWRUxhMuRQ5otVqa7hjHc7VKbTboDEZTOZcBY5i1HPYEMhXOQqDRECBUn4ArEQpFwqEYij87UyNn0kN2IjIlEitZ2FE6mQ8_EUA3LUsFPh2ooPOgSHJJHomGQYCZBjZVitkmQI4ZjGZLCUyvBKtUXG5055M4h5jlMFAlmhB5IbRswGmALRtRTQSQCNjwqAfWb4fGigVsEcDXAQDBQCOcAYGQcBXjGWyzua-pZFAOSqiyYpXhQuAgXAl64IoAjtDYsjvuYUE6PoHAYLSGDzDASbkJuaYeLQNxiCAcD4H-7C8PwCGMSUGD-BxbAmDAaDsKRNJXi0HzgbIr64N-CpsGg7TQHIfEgAJQkiSoZp6KobAtDI4zUPgEDwBxDGiBIJbxCpvRUCUmksPoOkgOJAAiMD6S0ZBGSZSCcawIAAAKYNgUAWKQXDWRgtkULJOLyVgOBXjkGATJF0WxXc8UhVenDcBQV6tkoaXwDFIDaXFriwCBV5qcJtI5VA7TzHMxV2WVcmuNUSUkClsitaV5WZSA4gUIoUA1YJdWiewjXNWQ_UZeZTGlLA3W9TJvlsDZJWLYxtUaZtIDbW1g1Lft9VUgt7UVedoniZJuDSVdoZaERBjAeMJ6Jm4kDzFRc4pludGZmZbBUD420qWQg4wJp4bEbdlTkL9SY0e4GapqBATCQcvJcAAjopXBLFEOPiFEKyMG4JRMLCo1QAA6pNIkAAqzXMeMwITEDEzE9MTep9UzU1cwU1T5A08ATAAMJVWQTOCzSbMi8weTgvcXNEzAJM9DA1W3Q1Kti_NZCKIOnSUQ0TRwLyZlmy0AhROJOAkOwfaUFEp3iQAylJsgCGZLDvMBaCwLCJAlNLWS0gIKECqdLCHCUfiSEMEAAGIAVAmAx3yX5aao4kUCQJBQI7MAfAB4EkE8-AwFejqNqdHi4A-hQWFGS6xvGDRJp7qg1xQ7DtBQAcKpAsBkBgfaOwp4ywH3CdMMPofUizUXiI7Fj9ziZMCGTKBcHApevksAD6Z_vM808wCOUSdzGnvRMHFDGw5p1HyfMBjziYrUHAEAJYCEEHWBwT9QFOCiBoAuGxhZzTgMAhUY4Jyyz1vLZmtJlZzVWEvZBtN6YKymlguYSw3QQAoLAR2yJgjxCYG5M2URNCUw2GoU69sLY_zuPycoiCcQsEDn8aKAgLD0HoEmRwAB-AAJBYJedx2jmFnglcayUJhNj4YqORfk7hCKYCIsRVQ4AyK0SwBR38hAKmlAI6ULBVH-2iCuVadjcDqJsaIRyGi7jWJsc4x2hi1pqJMX8V2PogHaLcUwdhPC86w08X8AMESEnSmgdKJJ6gXpkHhpoTQQA" target="_blank" rel="noopener noreferrer">Run this example</a>

#### ** Typescript **

_./browser/app.tsx_

```tsx
export default class App extends hyperdom.RenderComponent {
  private hideGreetings: boolean = false;

  renderGreetings() {
    if (!this.hideGreetings) {
      return (
        <div>
          <h1 className={hello}>Hello from Hyperdom!</h1>
          <a href="#" onclick={() => this.hideGreetings = true}>Next</a>
        </div>
      );
    } else {
      return <p>Now then...</p>;
    }
  }

  render() {
    return <main>{this.renderGreetings()}</main>;
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQFiNAgAN0JWSQhwgHE0GBgKCCYAczhEARQMDFhCJgEAXmVCKFxDJlqBHsy8bt7-obgACgBKczW6iDABfYBCCgkIbzuunr6B4eOambqvnoootBn9qcvnUADxyZoAPiBwNBEgAjAJ4okAHKELgwWbACRWGx2CEACRxthUigE-JkuS4VxB-HhUM-MK-IMIkh6YFmGgAxBoBMx4hB6ABrTFHOYQgS3e5kR4wbYvPZzCVoKIwPHI9I0wj0xmg_DgpramGHFbAhxWXAnBnfPp_GYg4gQ5HYCXYphkd00h0mr52Na-1afDbFUUfYE_W0CEFcQgDCHASXeINbZ67YZHOw06Ox73-_0gOwAGhA6GwuAIA3C1EoCGQIEYLCqHBMfEEIjEkgpOlJJPUmk7ugCxh4LYEKWIjlJLiIpEHRhyXa4ZBIsky-wU9Ci6JYZHGcikBYElSwo9IR2NRnzRZLODwbg8Xh8fjodeYGQoHEQgxsKEW-13UneNYwFfABaSIuGgKRRg0QkoCaF56BZdUVQ0A8kkaRYDzgaY4BAstzhWf0jGlIlLTqVhqAoECKDQHDgLQLhRiiUg8EQ5YjDzQsQC_DAfygMg5GrZ96zfDhwiRHoBC4DA5BiGBnBAIRH38EALy44hCCFQhBhgMgACs4GYYTX0bRAQFDBSmDRGANGg7i-jwihCH4GA5BAgYICoqhULWDQ4HoRpiG8pAyK-PynP4WyFKwGAUA0oUQPCJo8LweC0B8q0NBQKJoDkKKNBiuLNMFDQ_QLXyQHCFdwiYegIHgKKLLqDR5wHEKNAAJjIOEyAABlKz5CwqpKABEYGqtg6oakKmoU-IYGmEDCviwUQOIKAokGAZ8pABJWHcDLgQ0XxcJsQhih2vb4AoQ6ws0CguCgJbYpWtaNq21Z2t21prtu5qQHcTwYBAs6Lq-q6DpAcrMpAKgQYwc68Eun7Ieho7YYpfzApu8GUZxtG7uW4rkf2_GgQKl7ipA_kSd-qHyZAImEqSlK0DS2nIb9DjLwB6Y5HGKt60gQZ9MMphjIbdgzIsjRWB4K6dqYGSbNUphOKLKghYgEWDKM2sRNM8yKsYHhoDwAB5IKIGYFTRlmjRpNk2AdrKLhpKYAApABlP6FMMv56BgABZEgopolUCf-qAIBQKKAG1oQU-AADZff-tqgQAXUjhSDOoHaek0smYbzgAxIu-CkHbWryPPfdl5ydJxuyAFEvdT-mYfcRp6GbpUUMGji1KLJnBR8ZhhdFiXRLM-t3HqVoJEVHoAEccp6fYAHINNuTfDiMOfBHxB6oAAdUpoUAAV3oGZeYDXiAN83iQT-eoqEvWzaBj3g-beqAQShTCYOfd-gpr5fxmA4eYq914wC3vNRao83oQJ_gGR2ckyDBFCOIeYFlHYwFGJvJKVgMDEC3BQTeBMkpe1SngO2QJwTYRQLAfEGB3AlGxEKUY4cYA5zuO4SuKQIDl2sD-Lh_cbKDSoTAJoFAJhQEITIxYeEMAB2BtGYglC1hVDQFBAQm9XDXjLPgCswRqxaM-KoigxAogUHoVaSAsArLokIdlTIsBRYWOBDY5hApL6L0IfgLxXwd4SFGKEsgPRDJwTgQAfVieCf41kDybyMXgSh-jGEUP3lItYUTJjwXscCdIbA4DWyYCMAQccDEGQyQYqgdTqzUE3pnMqaxP4fUqQnK0R4AFAJAStcBH0jg516cfR6AzipDIGPseMnlYCEPJNoXQAgxrSU3nYHJdRs5rHQQs0KdRlReFGN0xks1gSk1GPgNQagmkAH4AAk-Ac7AiiLgIpOo6igzofouG3y0Cb0TnUf0jIhpWjqOcr4lyBDXNuSdJ5LyvhvIIVUoFXxIWMn-YQwGsB4aIwBWi4FiLgQYphFi_RJ08XFGCZ8uopD-g2w-bSr4ez4DcOVJI5lwLCX2DRa08FvKrT8u5WrNSdg7BAA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

When "Next" link is clicked, the `onclick` handler is executed. After that, hyperdom re-renders (that is, calls the `render()` method, compares the result with the current DOM and updates it if needed).

Read more about Events [here](api#event-handler-on-attributes)

## Input Bindings

This is how we bind html inputs onto the state. Let's see it in action:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

```jsx

  renderNameForm() {
    if (this.hideGreetings) {
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
      {this.renderGreetings()}
      {this.renderNameForm()}
    </main>
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSiAbkZvX38mYHEcKBJNMIjolAs4CklYOBR8ODgkxkYYRzSAuRgwDABXKAD8KAxqpgBBGwzVLjIW3ABxLh4IMgBzOAAKAEoR5lEIMCYlgEIKcQgKw5bpmFmFuDWGDdEmLgp23GYAHjkIADcAPlU7lhfxABGJg9PpwAC8mWyuS-AAloflQrDpHElLsXhYgT9bn8XhhAlwwOCogBiKJMcg9CD4ADWkNWTHBXyYByOKBOMDOF0WjJZuHaME0XwAcg0KBiMNi_kwMe9vr8mNoNkrRtQJsKMIoYAAxPyKBk3O5bHas44QU4zChzRbXBUsB5PV5yqXSmW9bBQF2upgAdXEGACRyYkhITyYZE1MAA_DK5ux2gFSjJwWwqI4KGwmGg5u8FimQKaUO1zLgNVq2F8MXGE17cRZ3Tha3dgIXi7IyzAmAAyLsy50ATVDUS44dMTHxLxKxgWX1iIUUJQwGKn5HmzJbhwqbdLkc0ss-XyV0v38pxR8VdQ2YwmBoVDueMsUGDmTYyhevsi5Vsuq3PzffartpGuq4PqKx_jKFhPi-qhKkqugGEYpglhYOYNPYCDIK45BUDQiAgKkfgBHO8SIpEMQovOtRkIR6RDOwZGFFYNjUYwJFKCg1gyOMSwKPg7RapQ6AkHIkh6OGMAmIMNirCsyRkAhhjGGYlglGU8CVNULhuLhnj4Yg8w5JgUBLGgImSLaGxgDhAC0bSKNAkgCGw8JQB8sz4PiooCmw4kDLgEAYFA4lwBgZBwDZJZbPJKpkOyCKGiyYo2RQuBhXA1mgQI7Q2LInnmDFl7oOcuAADJHAEiVmfIsg2aQUC9Ow5gCPVjUFVoRXYLI5UlHy6wsNVEw2WZFAUEoAiAuwjhMHAJBQOaTDzfM4gUPMXCSIVZCMMV3UVSych6NtXVlXtBz9Uw7AYHIubzBNAAMU2bYpl20hg8wwBh5DaThHi0IlbBwPgAXsLw_DnWIICLv4YNsCYMBoC9NI2S0HyRbI7m4L5CpsGg7TQHIMMgHDCMYLSKjKodGxsC03EtGQ-AQPAYOJRD7HKEgrAgL0VAlOTLD6Ko1MwB8AAiMC09QDNMxzLOcwAApgHoWKQXCE9z8AZiAlN3DjWA4DZORXbIasBhrWM4rrHo2Zw3AUDZbMmzzmva6IbA9DAYU2cTiPW1A7TzHMjtm1r2OuNUBskEbmMc2w6u8yHFsgCtihQF78M--wfsB1tMdc6b8cuxDamwBHUdBwXofe6TNLl87lfp9XdXzbX5s60TDe0sjwto7gGMtyAsEdQp-iQ2FchmY4lTkJA8yfQpWE6b9-H_QWMA-OrhNkCJMDk_BI9V7SU9kDPGHfe4eHYeFASXWd4L3DAACOeNcEsUQ3-IUQrIwbi9bCFApz6DuNIAAKWc5i8i4E_CAL8Yj_1TgfJGmd_ZzE_t_cgvVgBMAAMKwDCoAkmtJQHIOYHkO-kDn4wFfu7T2CDfbENQVtMgigRKdA-g0JocBeSJWYS0AQUQUY4BIOwQSFAoguxRgAZXRrIAQst3ihTQLAWEJAShYKyLSAQqUBSF0CBVPwkghgQG1EFKAmANF8h8hTVQKMxpzT4cLIKkVQwEBgDZJ87AxGqA8LgJyTEkIqVwKhcY6EHCeI2KGCg8YKCyIVJAWAEYtR8NxuMWAGEwl3HjIo6kwCAziD4RYdJoh34CHfigLgs03KUIAPpVPeM8SM4koj-JLGI6I8jRFfysVeeAc13IxJxGKagcAIDoIEIIKIaTGkYUcFEDQXSWBIOznAMZCoyCSWwbgsg-DEZEOzqsHRaypJ_wAUA3ZcwlgtggBQWAfDkTBFImLZhURNCdJYGoF2PDWH9LuPycoKycQsFlncJ2AgLD0HoNMqMAASCwOi7htiSXrVOhsJhRDtIqOF4M_ggqYGCiFVQ4AwsxSwBFQh0XNnJX8FFMjojF1cdS3AaKAV_AFsyilbKqWRwmHwglpdUXEr-EIq0oysXehYJ8v5Fid4cruBBaUcrRBzPlQqJVF4yB700JoIAA" target="_blank" rel="noopener noreferrer">Run this example</a>

#### ** Typescript **

  _./browser/app.tsx_

```tsx
  renderNameForm() {
    if (this.hideGreetings) {
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
        {this.renderGreetings()}
        {this.renderNameForm()}
      </main>
    );
  }
}

```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQFiNAgAN0JWSQhwgHE0GBgKCCYAczhEARQMDFhCJgEAXmVCKFxDGfrGlrao3DQAOUIuGFH3RqG5gQByc5XagR7MvG7e_qG4AAoASnMbuogwAVeAIQUCQQbwgro9PoDYafGqrOp1HoUKJoGavb4IuoAHjkzQAfBjMdiJABGATxRJ7A6zYASKw2Ox4gAS9NsKkUAiZMlyXABWPwpIJ8KJ2MIkh6YFmGgAxBoBMx4hB6ABrGkfOZ4gTA0FkcEwR5Ql5nChoKIwRk7dL8whCkXY_C4pq2onvFaYuw3D1MG53YpUmAAMT4XHVcMxv3-2rBHX1kOeMK-wsRfRRaMJCJx-PTmKxCRQVjxAHUJK0BKCBFIMCiBEx9jAAPwCLEDYhRQQeWRSkCsagUOUoAa4oY0gDaUYANM4QFs8P6NABdBz4PH8vMF7MI4BRsgz3Z1gQAMgPTcdeIAmlXzj0a9hRE3jsxBnicjpFO5CPyH0NNVuQd5d_6dj8qeXp2k2DpZkmAiuhioH2IEqy-ngoYYkiqb_OmWJcIQAzOiKv46khaAGvGbzvHB-HbkR_pBmgIbkZh-DYbhGIwasXpekYIB2OOIDoNg2z4IOwSUAgyAgIwLBVBwJh8IIIhiJI3Kvko7LqJoym6AExg8HJAgpMQjgci4RCkNpRgvroZAkLImSvAo9BRAcLBkOMchSJOlRYPppAfGx3G8fxOB4G4HheD4fh0BJzAZBQHCIIMNgoIsrxuVIsI3GAMUALSRFw0BSKMGgslATRQvQYqWmaGiTkkjSLJOcDTHA2XbL8KycUwuqsomdQ9hQ2Ums1WV0aMUSkHgFXLEYXoBSAiUYMlUBkHIolRZJsUcOEFLXlwGByDEMBTkIEX-CAXE8SAxCECqhCDDAZAAFZwMw60xdJiAgGGU61gcGhFfNfStRQhD8DAcjZQMEADVQNU3BocD0I0xCw0gvUIgjIP8P9U5YDAKDXSq2XhE0rV4GVaBw8KGgoFE0ByDjGh4wTN3KhonrjvDIDhLZ4RMPQEDwDj311BolmKIzIAAExkCSZAAAzs-xnOrBoJMACIwLzbAC0LaMi1O8QwNM2XM4TyrZcQUBRIMAySwkrDuFTmIaL4LU2IQxT2608B9iAKsu5oFBcFApv4-blvW7b3poxoDu-87GMgO4ngwNlHte7HIDx07_sYhoVDpxgnt4N7jt-wHScdvASMQCjZcJ3n1MgGbrMN7nleiy34es9lirtxX-fdyzRMk2TaAUwPSt1Bxc1NZk4zUD4zCQIMT0vUwb1Sewn3fQXMA8PHktMPtMBK7Nl1UJJq_r694kbR9X1c4wPDQHgADyKMQMwZ2jAbGh7QOrASWZQuB7SYAAKQAMqJy7i9FE9AYAAFkSA4xNGaTuU4oAQBQDjEc6YNDwAAGywKTlpc6wp5yYI0M9agkseg3UHs3WhAZGF8CkJLcWXB150KboHLG90_YAwAKJQJIXwpOxwlRCK1KaM-7EZoXV4q3FUy8mA32elvTan1JLuHqK0CQZwegAEc6Y9FeOca6wJzjvCMLowQTJg5QELD3FUAAFKOAwjEwFMRAcx5wJBOLDiPC2VsbYDBsXYn-1QBAlCmEwFxISPHhJmA4eYJizEwAsUbE2KjQmeKYJE70TBAGHTIMEUI4h5jfUAYcC4JMrAYGIM5Cg5xK4kygeTPAf8MS4iaigWATIMDuBKHSFUox0EwEwX-Cg7CUgQFYdYZK4zZHVWVjcEmszJijHODAFood4FoEQdlbCxA2k3CqGgQqFxXBBUEsJJeVBzmrCrBQVsFAenCkgLAX6dTzi00yLAdezzMStgGUqNxBidn4BBQiKxEhRjwrID0F6pUskAH10W4lRHWSc_zMDBTQG0-poJWm2PWYheAkwyqfMxOkNgcBv5MBGAIEc5xgV4tEsS9lVBqDnHnBzG4YTo4svwcKLysT4mJPNsk6OHxMESscSHaVrNZUDFeFuaGsAdlcm0LoAQms9rnDsOSuoVCbilO1ejREh1RXpgNpicuox8BqDUKJag9YAAk-BMGYhnLSsCAgM7dIuIXYNRKNwUQRDxe1G4nUCBdW6t23rfUIn9ayjcdQHV2nDTslOsAi4lwjVBd0qbMTZpFLmi4btC3FFhYG-UX8f4BobXUS18AJlyMzdG7tUbMQCqglGgdM9FGbzsOOoAA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

Each time user types into the input, hyperdom re-renders.

Read more about Bindings [here](api#the-binding-attribute)

## Calling Ajax

The above examples represent _synchronous_ state change. Where it gets interesting though is how much trouble it would be to keep the page in sync with the _asynchronous_ changes. Calling an http endpoint is a prime example. Let's make one:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

```jsx

  renderNameForm() {
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
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSiAbkZvX38mOApJWDgwiOiUC0zs-BR8ODgkxkYYRzSAuRgwDABXKAD8KAwKpgBBGyYGZiYuMkbcAHEuHggyAHM4AAoASkHVFi4KFtxmRfXRAB45CAA3AD590SYD8QBGJk7uuABeYGKclHEcKBJNM4AJb4kPKhf7SOJKACEBwsdwuwyuLAOGECXDAzzYAGI2ExyJ0IPgANavFZMZ5nJiLCjiCBwT4QRpTGAzea5Z5MCi4FowZZ_S6IgBytQo_KRVnhiOuFmO532y2Sw20ZFUo3GAowihgADE_IpSUMrpttrt-UdThLJdcutgoBbLUwAOriDABWlMSQkbZMMgamAAfmus3YLQCWRkGJAVEcIpATDQs2O8wj1NpKBa5lw6s1bDOMKDIbtiJh1pwhauBvtHJpdPTsizMCYADJG6KizKy5WzecAJqeqJcb2mJgog6ZYzzM6xEKKTIYGFj8hzCnAFM1jP1zQw9utyUHNAhijkXFkfFEkmrclV1NzHgAIWZuCWvKYxzgWFgcleq5QtIAMiQMETOZ71kPkEUrK5_gwE4GxRbBZB3IsLH3ChDzIDtd2lc1WyVe0V2rH84H_QDZmAh8mADNhiKAlBaJxARv1VWQQNwX9aQoFZcKQ7dwPlVQlRVahxhYtjMn1fYIDASlIW_eDH1WCtDR4Y0FSuATwKNHZKVNCh3wbR4Kled5Sjk0SKDA-0DmpGBAIww5OTsq4rPEJgLEc-zxDOesYWpdykV8gAVDA5igWYYB8zzEJ83A7Iimy5Fiig0BIORJHc_DUzkulFGsRZFmAb1fT0DlgtCsgYGK7xgpgAB9bYoCYTQL2XRCNmUrS9nAiCrJi1qiwoBK-t3bw5kCGAIDmcQKAjABWAAGHE4AIV4qpvOrcCgTRXL8pCBp2py9uAH1NU3Cw9qG-yEpXUqwtO86us7M7eoeyU-Je0Qmq4zCkpStLTTOvTCzelh1JYbpJBPJgbwoFinzWcDGlgKgrzpLLVNEb8_wAoCWLJDkuRgBV9jcTIRngXwyHMPGMBMDAIACMAeHwcQ9hAKaKHYOBEAsKx2AgFBgzIQlrH50hFAsE4ACZkIfPgQGBjGCKy6nafpsm4Ap8x7DgcgViJ8DMaI7HSNx9lmigcx0dBsmxlkcSNPak0HoOHLZjODK6RpRlpgoUjcgDRihLrX0dVwPVVgYgimMmH2_c4mFXfQuUra0HR9EMYwzEsBNam1lw3CoGhEBAVI_ACKd4hBSIYnBacqjIUv0n6dgq4KXn2HrxgK6UFBrBkMZFgUfAWk1Sh0F-4rypMPobBWN7dAMIxTAzIosg-coEGQVxyELzxi8QEKSEwKBFmS1KFNUMAd4AWmaRRoEkAQ2EBKAYN9_AUSFbk2GK3pcAgDAUBipvkptfDMkkFTqU-ECeGLAowUGvpyDAlMr5hwEC0GwsgP6W1TsqMg6AHxmVgXGPw4xr6kCgF0TmMABAUKoTgsgUDTLsXxsQ5K8hZDX2SqhJQAhbjsEcBkEgoU5BMFCpNCgcwuCSEgdUfBzDSYDT0IwAhsgiHUmIewQCQE-FzQEbIsgC8OAYCJNVbW5B847w8LQCsbA4D4H_uwXg_BiFiBALOfwLi2AmBgGgLRRJr6NBOGA2QMFcA_32Gwfc0A5BeJAD4vxJjCQqEVMo4YbBGj90aCeCA8AXGKVYGzWu8Q4ldCoJkFJIM0luKCQAERgFk6g-BclywEAUtgAABTANoLCkC4KUl08AYzVNEFErAOBr4_EAghJAhSylDIieBMZNpr6cG4Ag7uyhZlsHmRUkAIy3GdBsmQa-CT_GElWVAFocxZgDPKcMyJrgKiTOxjMp-IBdkPKWWzCgigoCnN8ecy51zbnbI-YMvZBzCnGRedM8JYLPmLKuN4wFSS7kLP2Y8s5STyGhXRZCrFqKAlBJCbgMJ-KYz8VwUYkBchkqODKOQSAcxzGGK3gXaxxdbGRhgD4eZcSyApRgCkpURjsVEkZWQZled2VWKLtvSmAQtEaPZFwAAji0CAXBFhRGVeIKIyxGAkwCP8X5UAHREsJAABSuTc5gqqYAaq1TAHVU0_kAsSQE9gtrZgGqNeQUmBUADCsBkEWs9dan1zAtoOqddqqIRzkEeqBd6kFZA_V4MUClNoMAUC1HqGyYhWbGgCCiEEnAJB2CjwoFEEZQSADKoTZBtP2K-PS_wSCZCDV8IkDECZQurIeXAkh-gQC1IAqAmBe342_qk1QQTDzCNLTAE4gCwGegIDAa-OUO4jI8MO0thQl5Z1wBYHODKHC1tUJ6DmIYW3gUgLAY6NDoj7jGLAbWV7wLBjQKFfAVqXTiFLRYL9Vw9UCD1SgLgOtX4upqjVY4OwiqvszhmWt0RXw1sNXO4Y0HhEwXvVcYU1A4AQADQIQQURP3FSow4RwUQNA4ZYKmu1XMhD7CnkwENxzw3nJtWmlYULOOmr-bxpJ_G7X5V9hQWApawTBErvUrNUQmqqDUCM4tObCOiC5DkCj_IClXHuQICw9B6Da0cH6AAJBYKFVxaylu6RMqZ4woj8n0AZ1sxnXJmbKBUGzdnRAOfY-9FghnLQuebdEGFkXcBudC41QL5Y-qxdLRvWFrmkuIkrb7cjriIJME03pmdwqEsg0Ql9REjHJSVeq41almhGtAA" target="_blank" rel="noopener noreferrer">Run this example</a>

#### ** Typescript **

_./browser/app.tsx_

```tsx
  renderNameForm() {
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
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0aMQWeGCE9DACAEIweALARgICTIRcMIgCVmj-AOaGTHEUhBlQ_smpFOlMWbEC3PkwAPoArmhQKWmZ2QC-vkww1KaCcjBB9VCC9FBi4gCCpAI9rExy4lryimQASmwDaADCirzdLNGVxOkAboSskhADAOJokRSZ4gC8yoRQuNlxJxDnl_W4NAAOUSoVeGh8OQEPz-oQgcAAMhhCHJMhEoq8gh8YF9oWcLqEUJE0HAUpM0GhCFIADzotAAPgErwA2gBdbKVe4LPB3B5PAAUAEojlC4vcKI0cvzKnE4tTUad6TLZXKJABGARjCYgpLPYCuWxkCQwKBQDDtekACRNZuUqgElpkKy4AEJqfh1UrRSqBNTCJJ7mBnhoAMQaATMMYQegAaz1QqZjP5FAk8KN1xgvJgj3KLwEpXqMEFFqBc3dhC9Pt9-AVldlgtxnSYnM2eB1MAAYnwuAmYt7xZKBNLvXLa8qVdTxkSoHWq3EAOoSC5VcRSDCNeKggD8vv8xHqgmssmDIFY1Ao4ZQ_lR5T1zJT8IANI4QAC26CNKz2gJ8LOfe6pxNP8VWAB84DIN9gVBAQADIYKHcd_zHEc53lX5gLnOIAE11wAcnueJsFEX00mYDJ6WWHRFCsQh3VI8pGVA1NwMg9sm0wica3QxCq2pFADwoZgIyYKNY3jYVnkZMCyAybM6TgIVv1ROBCBQWA5D1aT4SRFE0WJC0eLnS1CFOUJ_SJPBDM4_iKEEpgMM45DMOLQymLTbTkRvDI6QEHcNB0ryyCC8MUmkrktjpBF4QoRTEPdJz60bLoxVbNBIui3tlQgMAhxdaSLJJMhYHKFNhT7KsBzQJhcTiJtlUqqU4ryNTQi1Lx2z1A13AKqKrAMlC5RTGAUQc2VqVKUaJxTH9JrGlN6Xbd15qsuaJHpAAVfJCm6Ja1pWpaGUM3bhrkUbxpQDA5CkWa3PAgrwK4Eh-X5YBNySZ88gKIpn2qWSGiaAR2gkxiVpSiUqoQgbUIm0H_woU7qW4DJJBgCAMgkCg9QAVgABm_OA0HoPVfrqRooG_X8ltO2GptO4AEiSdoqdm3j4fpUCtqKJn8DZmnqxhqGVQbFagfY1CeYuq6MKW1TYD_YWoTqqExCkESBFkih5My70tMRTy9IxfM0ELDlvUYJgrAEe44H2XAmVELBCAgQQwGzegJGlTRbOIUl8CIYgIDIfcmBjEhA8YLh8FOAAmfB7o0BWVXy4k80IR3nat-BbZgMgACs4GYIVTaT5iyA83Tyh8zF3k-SolZS7k0G1lUGsh3jHv8dnpNTW57mzJ5fPzUvwvfJIuzQHthVC4fUqzHMMgU4t3Q7-zlUTwGjCbEB2kfEB0GwQF8GvHpKAQZAQHN-YKA4Ew-EEEQxEkJ0qKUex1E0Z_dEhW-zGmYg7QcE4f2xBIRGEoroMgJBZALH5Aoeg9QkgsDIJLKQz5uhYAEH_IUCtt6733jgPALhrCGk8GfBgzAr4cEQAUDAKB3j8hQWVSoYAKEAFoghcGgFIFIGhrRQFMo8eg_pSyFg0M-ckEB3jPhUhbVhgJsodC6EaG0GARS5DmKw0ohALYsInikeopA8BCNrkwJWyDiS9UEOVAQF0dB4FYYwU0JBcApEceMH2OJN5KJ6tFI2aibF8C2Kwi6tlFApDVMQagqQMCFDkAIQo6MKAZHuFIRRzYmDmLwJY_MchHxGEyWgbJ01rHEBRF5cJONIlpNwSAGhdCoBkDkKfOgF8KFsGvogEAAwtQES4JdYYoQNBCA8F4CETAamlNjDUPOBdxnn0vu0jg1iNAMxgBoHhtTsxyLyPwGAchWH-Gdpo7wIA8lQg0HAeg6RiBUHWf4uIFydkXiQC-LAMAUCTJjKwgYpw5F4FMmgMRyoND8WgHIO5Gg3kfOCDGMZtUzkPK6TAaBAwRIQHgHc6xiLwGKAhSAaOZA1RkBxnCwGCKXw_IACLItbGijFLysUvjGMNJgrCoWfNYcQKA9QMj-DxeMVgVggXeg0KQ1hZoUSWReRoAV8BnnkuxRQLgUA2XvI5VynlfLpUgFlUK05wKQBdXFZ5KVGzdXyoNVQY1krAXavNcKlUGgjzwCuRAG5_KCR6oVa8tVMKPWCotSKkA7KYUOMKP6uVDrZSQt9bGb5MBfmAgBRGvVddN41JkXIC61APDMEgBkGZzAWkLPYJ05Zp4YA8FlXipgl01kgC8eMnep5Ll5rRoWuZ5CAilpAOWiOAdYBoAAPI3IgMwE5KRGUaD6XIAZeLdhcD6UwAAUgAZSjYigujQQgAFkSB3ILDAb1MqIAoDucyRCGh4AADYN3Rq6biht3pWTHpAPnageL7jBEDY6t9NAOzfr4FIPFOKuAzI_fqoNOyNZ4oAKKrtvZB39rR6DPNCsbNZitG01JDbGXNTB80zOLW0nt5tLalOmq8e4ABHeoEB7j8lwhRiQuFBRGDI4IS0SqoDzljTGAACty3lOQqMwFo_RmAjGMbKtVdCuNGrhOsfY-OqxAhtiwG0bxuTAmhP-EBvbGjdGGO4WZdo2T6rdNMCU-kmdAyyA9D6HmaxM7ii4R-SaDAxBEEUFwuSn5q7_l4EncqZSssYCWgwFYbYxpYzocLN65igk0BSGmBAADpo6GxaNqIxWfmE2CRiSkXCCb3hyPXITGArDHrEF85UdpyWivOHwYfY-OaqC1ahOuCg-4KDBe9JAYqoIiv8QWLAGZHWVT7jUtGfjFwJBFfwBN2UzGUjMbINbGJpl-S1FqKiKqoJny4Wa3gXzAg3PRWs_ClsBd-HFEZXMNgcAx0WxSMyXC43Dun1O-9qg1BcKsjruShT_hSQCAvd6dBamNNMC058wTmqmBCm9ZDrjyrYcwvh8Jl6jwKCwCK46bQugBDUr6bhIGlQX2VFs3j-5VsBmg_B1WRlSc5UpHwGoNQp9qBbgACT4G9SqN8fWOLxJNWgIrVqJVbFwoZMWKod6IWZ7KANbOOcjLgHzgXsohdg5WkrqsUugtnaNYbtAMvBZkr17DU3RWxWm6WyLzzjxx3C5F7Kan8A4uYbdxvC3cufQA5Qv7wPtVsPtHD0AA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

When "Have a beer" button is clicked hyperdom executes the `onclick` handler and re-renders - just like in the "Events" example above. Unlike that previous example though, hyperdom spots that the handler returned a promise and schedules _another_ render to be executed when that promise resolves/rejects.

Note how we take advantage of the two renders rule to toggle "Loading...".

## Composing Components

Our `App` class is getting pretty hairy - why not to extact a component out of it? Like that beer table:

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

```jsx
export default class BeerList {

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
import BeerList from './BeerList';

export default class App {
  constructor () {
    this.beerList = new BeerList();
  }

  renderNameForm() {
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

  renderGreetings() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreetings = true)}>Next</a>
      </div>
    );
  }

  render() {
    return (
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSiAbkZvX38mOApJWDgwiOiUC0zs-BR8ODgklJ8_AIAhGFkAGQhMvNCowobm1ooqskYYRzSAuRgwDABXKAD8KAwKpgBBGyYGZiY3TNxJ_Ao_JgAKAEo11RYKcVb0RtwWtoBeJjIYEyZuu96T5I3tAY2uGQxrgAHIYRQwABifkUJzOGxYXAok1wzEO51EAB45BAAG4APgxoiYmPm2CghIRxNEAHVxBgAq0mJISCjnuCYAB-EkQMjsSYBLIyB5sKiOChsJhoXk4sgAcxFIEu10m5lBHMlFkp1KxFjJOG1OrWyrgKFVsjBEKYADJrUcidTsXjDUbRABNVlRLjPUxMDAk7bkOX42IhRSZDCYooUYzy_HGq6m83qiF_V0sKM4gkOljHNNG4Ams1qy0wG12ovYHqZfPEzPOjHHH4sP6qQHAgDiXB4vLlcDh62JSJRaIdTuzVLr4gAjJt5hUHsBijkUOIcFASJp8QAJdckdqRbfSOJKACEUZnLsd_vEXDAioAxJLyHMIPgANaLuEPeOHItXMYu0aChe1yJ4Y0mGA83xEEhgoKMMCvDMLCzK8m1UVsAWoYEBwxYdUXtScSUUDBeXxQtE1XCBAO7ED5Vybki3bC0OWhXBYVOAQmOw2QgJ7eiTk0KMSLIxtmyYP4_l0AwjFMNULA-e4KHsJwXDcKgaEQEBUlqQJjzDA9olDeJ-h09Jl3gQzOmjEpTXKSofkGYZdLGCZplmedckU3p4VUBZJDIfAmDlHgPn7U5B1EMZYCoJhK1uOBxIuSjWiaEgMFlOUPiYcCdhgRyqS2AIuDgXwyHMHK_RMUiAjAHh8HEdEQHECgKHYOBEAsKx2AgFB-TId9rF60hFAsXEACYLCrXA-BAdCqXi2QwKqmqmBKsrzBU8hvkYDEi1S9LMuyp4JigcxxMwxEeNwAAVLBYFwqkIDAI5FpmiKHXw0ciIzVCcyxCh7rLOYFjgRcLNNaalK3f660uGAMqQ9NMRjJH0xJS4mC1WGjRR8QYI5KNLjR5HibuuUoF5GAifxnG6wsVG6ZJBm10RpmUbQEg5EkEmdQo65ptNEj2EOQ5gDIDk9DijAKapqXvBlmAAH0USgTRTh_eF0Z1L7CO13HGZ-_WMbkXnjcxbw5UCGAIDlFrFQAVgABklOACEXBWQpV3A1axs30aJ02mddFHTfFjkhIZoOjf10PyMB2WXkjiho-Nx0Gdwf3qWOYOJLzdmGc57mzaJoGSfrCcdXm4l80utbrse4lntelK4DSjLew-D6iN18d8XbzKUCHiur00JgcAqyKhx4Ec9dxv6Y5JNABX2ZgX0pj8vw1-MixCigwsEpgcTgIG5EXfa28Ozvbi3bcMFxMt_WmqNl9a8gzf501mNuoHBP-keHTV1ELXLQOh9CGGMGYSwMohgqTUuQDSngtJmQCMZUI4QOhoISD8FByxVgYMiNZaw7B-iMCwSgYh2FDgKHwJMCElB0Bc0kFLF4bwVgi2OPNaSEC5KWAhmUCo8D3CaSQBTEgmAoCHCLpIbuLAwAIIALQTEUNASQAg2C7igA_EC-B_SwUgmwKWSxcAQAwFAKWJ9yoKLVM9H4mFVx7i1nFOCCiYwYHKvI9iAhJg2FkLo86oD_g3GrAESKnN5CyAUaQKA8x2owAENE2JASyD2Khj5GMTjwnAgUZzN-igBDTnYI4DIJBKZyCYJTO2FA5RcEkHY3aZBgmfDaCnPQjAmlKTiuIJx7AMqZQKU7Ip9SyDcN6R-RWW0RnIFcAgjwtBIpsDgPgEx7BeD8CcWIEAEZ_DrLYCYGAaAxnvgUWMXE1jZAP1wIYjEbBl7QDkLskA-zDkYA_CoX4bSNhsDGDIIE1B8AQHgOsqerBmr6XiI8-YVBMjvJbJ8zZpyAAiMBfljECoC2aAgQVsAAAKYHJBYUgXBIUMngBKEA8LRC3KwDgBRG4MqyBJdC8llLNn4tpZwbgFAFFYKZWS65VI2BzARmQBRzyjkKPYFASYcpeR8phRSm5rgKh0sOoypAoKoX8sVYK5qFBFBQDFQciVUqZVyo1WwLVCrWWgosqqhlVyLUgCtSypV4rXnvnla63V7qPxRMpl6gVxI9nGo9ScmAZy1SXMDSADCgTuGWLkJzRwZRyCQDlJMoRiD5mqFFDAHwWrHlkC5jAd5UlwG-vfKmsg6a4HTPUnMrSRUmC9Mxk8LgABHSYEAuCHCiK28QUQc6BXIG0bc-qoA0lDR-AACtK2VzB20wC7T2mAfaWoGqNS8v1pqF1DsYM24ATAADCsB3FTu3e-OdZrmBjyXSu3tURhXuK3Sa-dvJ93_EUFzaYMAUBDBGMtSK36xgCCiKcnAJB2D0L6JS05ABlC5sgsUYmPkDbcJBMjHrXB-LieUbWJn2LgSQKwICQjMVATAuG4p5QwnBiN-xSlgYjWY6xrICAwAUcLKIlKPDEbA4UWSUDcAWBgSmhwPHVCsjagKFDVJICwAlhCMDy8gSwBUpJqk_I0AbxnQycQYGLCaeJAOgQA6UAlVKQ_Q4SslY4lRJLaIQm1Q8eiMfPow64VtngFZ-JGzx7imoHACAo6BCCE6BJqWEWnBRA0B81Qu7eQdSEBiVhJ6z1kAvUc69C6Tg2rS-Og1WWPU5d5GLECFBYBgaPMEeITBkXfqiOrVQahKUgd_XJocv7kvCCIiC4kzKBAWHoPQFSjhOQABILA2uJOaFTNLDX0uBFEB0-gHT9dEINrGI2BFwCmzN0Qc2UuLw2zqJbyHoh2vO7gFbi81snaZtdsD9l7XLYOzqKDIFQv-fRu1nIeGDGLxbDjWs1I4s6lB-DiS8bNCw6AA" target="_blank" rel="noopener noreferrer">Run this example</a>

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
  private hideGreetings = false;
  private userName = "";
  private beerList = new BeerList();

  renderGreetings() {
    return (
      <div>
        <h1 className={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreetings = true)}>
          Next
        </a>
      </div>
    );
  }

  renderNameForm() {
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
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
```

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0ZN9BAEIweAAyEFbKqo4gzkGh4RQ-TEYw1KaCcjBghACuUIL0UGLiAIKkAqmsTHLiWvKKZABKbJloAMKKvExsgsBGAgLEaBAAboSskhCZAOJowRQQTADm4gC8yoRQuIZMA0Oj4zACObhoAHKEXEfrGkl7w2MTKMFoYRHr3VgCca8JABQASh2_QEc2qeFm80WK0BAj6uwGoJgFByaF2fxBiIEAB45KMAHyYrE4iQARgEhWKFyuq2ArlsZAkMCgUAwAF98QAJZmsyIOTkyepcACE2PwZMJCOJOMIkjmYFWGgAxBoBMxChB6ABrWmw1b4gR_CgScKMqYwSHI6FrAQUNA5GAAjlE6VnSouxFiwiS6VivEjH2IoEgtlGEFg1rUmAAMT4XFh8KxcxRaMNHtxBI9A2xRWeUED0oGAHUJOMBOEBFIMKiBExLjAAPw4xbEHKCayyRUgVjURIgAQoRZ45a0gDaxvCABpoic8FGNABdNkCfAF4li3PMtdY4ATuBkWfnesCABkJ7TUsLGYDWeJAE1qwByOa17CiHFWTDLfF1HSKKyEGKn7MEsBq7ia-6HlGoaXr6-D-tuQYwYWcJ7gepxRqe55oc88RWMh67wZml7BgiMHhi0eAJkSyaoui6ZcIQiz4uBpomjMcxWss4hNmhEZzvWsZoPGAICIgtoQWQ_FoJaCzcYCbJioxzFEqRAwwTBIBspOIDoNgpz4D8bwUJQNB0CAjAsD0HB-GYIhiJIgp_ko9jqJoTm6EktmCPZljWLYfJuc49LuJ43ggMCxhWWg2T0EcPxwiCdZXOJn7QjsAwUIQSxQIsMCpXa6Ugtw2UwAA-qiUAFcMyw7OR3RpP4AiZNkeQFEUXjfC8xkVL2LS1B5DTNOC7SdMwPSJQi-yPEc4QhBghDDksCXrNkWwwBlgwPIcA4vHA4klGgaCEFI2I_Aa6yjgukUDNJ1GXhAYCGmhc0LUtPyiYmxK0am174vNi3QmQwN-gSm3qRU62TdKP30bBnoIbe2YoG2FDMGqTAatquqifqEmmksyI_HACnNeEhAoLAci0i9cAA-9LzOvD0qcoQIxHLKuFoEjOL4CjFBo0wiE7nxlFoAAKhTsAKbeoM3vDamIgR9X3AcEzSZLlMwPdWKPYawo4XtZCwMsxqfR6sPgwIKuIrDF6-llWsUh1cBRrSIX7lzxlMyh2LGjAi3C56dpB1ifsSCuofBxI-JRmKxpR9mCeSzleXxzHPPx2gQfpwHcg5xQKAYHIUhR6xntG4xxB_H8wC1vW05Zan3TTiVhMVWgUDW7jYE87dyJ0fbKHriHfcj_nY--twSySDAEBLBIFC0gArAADMucBoPQtJt-VlXLquk-evgFAT8zw9-_nwDJTAikn2fw9XqfLFN7l3R38_R9Z4nAiKyhbJOllifIuJdELxyljANcisbbTR2mIKQmMBCEwoMTHWiJab02hCtW09oNphkvJZCIcw4BdFwAIdYhAsBMUEGAZE9AJAYk0ALYg-18BEGIBAMgrYmBahIJwxgXB8AjAAEx8z2hoP--MK54BtJQ6hSISHMFwGQAAVnAZggIbroMkq9QGyxsFrW2CGIwmltK6UwDgPA-AhypFMuZSyVQKA2R4E1XyjltC6ECtEX8nkIq-BcWYMoxAvFOHYcQJIRgfENBILIaofwFD0ByFcFgZAQFSGnJ8AQQTASkS0jpPSliCAew8F4exzBHEcEQDlDAKBNh_DSebBEYBykAFpshcGgFIcSGhuRQHZgsegso3QOg0NOQ6EBNjTjgIQJgcAWmnEenVfBjIeQYGhraSoLS7QzLgM04S4kcikDwIMoxTB6qpO6gkdZRcdB4BaYwFkJBcDiQeUUFheCznLK9lcu01y-CtBaUXAWihxKkmINQAQ6jcpyAELlBeFAlhzCkEs5ITALl4XbHIScRh0W_AiMadZxBFpLVBavcFKK8kgGqbUqAZA5B2OQBZcp1lEAgEyJSF8XBi55COBoIQJTwpGEpUS7UpVVHqKYGUqy7BWVfQ0DfDQ3SqXInmVlfgMA5AtMWBACgWzwrYoRBoOA9BhjECoIq9ZAwjVqr7EqrAMAUAiq1C0zIIx5l4HZtzEABqsQaBRtAOQFqND2sdYQbUtwyI-uiJkWJmRMYQHgBar6Vr3IeMUEGkAwiyCkjIKvCN6ko0aFdQAERgLGtg9AE3hXEsm6IhQA5MBaSGp1LTiBQByEsRYGaiisCsKMokGgwotNZItPA3bDh9u9QOphXAoBNodS2ttHau1IGiD2-AfYo0ppCsOt6Y7V0aHXZOrd0QqC7tHV6pVR7N3To7PAE1EAzXjt7Tey8waF1hq1M-jd_a30gGbZ--5uVv3HunQB7ULqYButOJ6kDfZjFnMpdM6oRdqAeGYJAJY4rmBSoqbKkEGhWA8HXRmpgxcYARtMTpKgllMPYclYyhxLKQByqZTwaAeAADyZqIBKKTdOrlcgeUZo6FwLlTAABSABlX9vqQDqNRHFAAsiQC1doHQnsPRAFAFrRweg0PAAAbLJ4kRb00gCJAuTTIA1HUAzXMMNr65O2ejI5vgUgM1RK4OKuzU6_1quQRmgAolJ4zfm5NpXoLanBIyyImKFWY8DWp0NMDo2o3DzHCGCCJQS9YcwACOOQIBzD-I-HLEhHwAiMFlgQnIKCzqLB-7UAAFdtnbdh5ZgIV4r2tHyL1nfO0NEGl3tcq9VpRvQBBtFgDMxrQ2tSteXbsZcnXuslcfPWmZg3F1tcWGN1FgmeVkFSOkG0X1BP5QEI-V1zIMDEGSRQR8UbXVSY9XgGtRI8TTK1pyDAVg2hMm1OJdTMAT0QTRmgKQZQICuZZLUoHMWKORpBK6tGGAqpXag5seZ1Yt4wBaVXJ7IIeiQ_Eo-ZwBSDI2LQ1QInCJqwUFbBQD7l5IAm3rGTlG1RYDirp1iVslNNTNfGBIMn-A-eInK-JcrUl4Do_Zn8MqZU8RogbldyneAntXa-49qryOETEPl5d2tlQ2BwF47M8So5ydqK1-T2n057c0EfAuEMUaRuLH2gIPTl5MnTYbXNp1i32uAhPZkurDWmsLd20wWuCwKCwDJwKNNShS1csfAAkEVmQSHcT5a0EPKvc--lLWrEL7xL4DUGoUy1AGwABJ8AnqxLOFnj8R2tDJ2e9vmvbwESxNpD0pf0Ebor1XgVDem-Ihb97nmQ_pTd7QGTndC_Hw8wH-fAYc_iQL7J0Olfk_pR3YWEo1vj9ES5_gMD3BY8--Flv1iV38Nb-P_UvFyVbIP9AA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

?> Since `this.beerList` is a component, we can specify it in place in the jsx. Hyperdom will implicitly call its `render()` method.

## Routes

Routing is essential in most non-trivial applications. That's why hyperdom has routing built in - so you don't have to spend time choosing and implementing one.

We are going to add new routes to the beer site: `/beers` - to show the beers table - and `/beer/:id` to show an individual beer. And, of course, there is still a `/` route.

First we need to tell hyperdom that this the routing is involved. We do this by mounting the app with a router:

<!-- tabs:start -->

#### ** Javascript **

_./browser/index.js_

```js
import hyperdom from 'hyperdom';
import router from 'hyperdom/router';
import App from './app';

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

Next, let's define what the top level path `/` is going to render:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

```jsx
import routes from "./routes";

export default class App {
  constructor () {
    this.beerList = new BeerList()
  }

  routes() {
    return [
      routes.home({
        render: () => {
          return this.hideGreetings ? this.renderNameForm() : this.renderGreetings()
        }
      }),
      this.beerList
    ]
  }
```

#### ** Typescript **

_./browser/app.tsx_

```tsx
import routes from "./routes";

export default class App extends hyperdom.RoutesComponent {
  private hideGreetings = false;
  private userName = "";
  private beerList = new BeerList();

  routes() {
    return [
      routes.home({
        render: () => {
          return this.hideGreetings ? this.renderNameForm() : this.renderGreetings();
        }
      }),
      this.beerList
    ];
  }
```

<!-- tabs:end -->

The original `render()` method is gone. Two other special methods - `routes()` and (optional) `renderLayout()` - took its place. The former one is where the magic happens, so let's take a closer look. In a nutshell, `routes()` returns a "url -> render function" mapping. A particular render is invoked only if the current url matches. The "key" in that mapping is not actually a string url but a route definition. `routes.home()` in the above example is a route definition.

We declare those route definitions separately so that they can be used anywhere in the project:

<!-- tabs:start -->

#### ** Javascript **

_./browser/routes.js_

```js
import router from 'hyperdom/router';

export default {
  home: router.route('/'),
  beers: router.route('/beers'),
  beer: router.route('/beers/:id')
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

Route definition can also generate URLs strings. E.g. `routes.beer.href({id: 23})` returns `/beers/23`. This is how a link to `/beers` page looks in our example:

<!-- tabs:start -->

#### ** Javascript **

_./browser/app.jsx_

```jsx
        {this.userName && <a href={routes.beers.href()}>Have a beer</a>}
```

#### ** Typescript **

  _./browser/app.tsx_

```tsx
        {this.userName && <a href={routes.beers.href()}>Have a beer</a>}
```

<!-- tabs:end -->

Apart from route definitions, there is one other thing that can be a part of the array returned from `routes()`. If you look closely at the above example, you'll notice `this.beerList` is also there.

This works because `this.beerList` itself a has a `routes()` and that's where our second path - `/beers` - is mapped onto a render. The pattern then repeats itself with `this.showBeer` plugging in the final `/beers/:id` path.

<!-- tabs:start -->

#### ** Javascript **

_./browser/BeerList.jsx_

```jsx
import styles from './styles.css';
import Beer from './Beer';

export default class BeerList {
  constructor() {
    this.showBeer = new Beer(this);
  }

  routes() {
    return [
      routes.beers({
        onload: async () => {
          if (!this.beers) {
            const response = await fetch("https://api.punkapi.com/v2/beers");
            this.beers = await response.json();
          }
        },
        render: () => {
          return <div>{!this.beers ? "Loading..." : this.renderTable()}</div>;
        }
      }),
      this.showBeer
    ];
  }
```

_./browser/Beer.jsx_

```jsx
import routes from './routes';

export default class Beer {
  constructor(beerList) {
    this.beerList = beerList;
  }

  get beerId() {
    return Number(this.beerIdParam);
  }

  routes() {
    return [
      routes.beer({
        onload: async () => {
          this.beer = null;

          if (this.beerList.beers) {
            this.beer = this.beerList.beers.find(
              beer => beer.id === this.beerId
            );
          } else {
            const response = await fetch(
              `https://api.punkapi.com/v2/beers/${this.beerId}`
            );
            this.beer = (await response.json())[0];
          }
        },
        bindings: {
          id: [this, "beerIdParam"]
        },
        render: () => {
          return (
            <div>{!this.beer ? "Loading..." : this.renderCurrentBeer()}</div>
          );
        }
      })
    ];
  }
```

Here is the entire example on codesandbox:

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSiAbkZvX38mOApJWDgwiOiUC0zs-BR8ODgklJ8_AIAhGFkAGQhMvNCowobm1ooqslTapmMAVypc8NC2QtHxtmSyRhhHNIC5GDAMEagA_CgMCqYAQRsmBmYmN0zcEfwKPyYACgBKM9UWCnFW9EbcFraALxMMgwExMbp_XovVTaRYXWbwF5vC4sLgUEa4ZjCFGiBFwFDiJQwR7nURk4bUda4ARIgEAPmR5PJaIxzE-3y-6wA4lweBAyABzXIAfiY7PxXDIVIAchhFDAAGJ-RRIgTilCSqk8xoUflC6E4smwpmaZ56d6idXYHqZC0aC6w1Sa5oYSQkMaPNxUSivUm4nispgAHkUGH5dOAXo8miDFlD4ZhjCdlNksvlStwKt9FpZmKeFpYQbkEAAbnSC6Ig_tsFBy4byQB1cQYAKtJhujHAuUwUVB_nsMZi6QwAFsKiOChsJhofnFwWjkDqkbmXBpmBsOmx_tjOtMwsWas4Xd7v17sVffHL1PdpgAMlvweLZYAmu6olxgaYmBhg9dyAK6ViEJFEyDBYz_QUGWAJcVzXGMLCfY8TQrFhoIvFAr1XG972DH9xC4MAAWAPEflkfF8I2F5NDpAAJDASxgb9p1-WMMDpY1yVjRCLWeRM4VRFNcG1PlBTgJFTwpdE80eCsi1LJDOPEABGS59gqIjihyAkcCgEhqJonSSHaSIaOHYCAEJY2UhSySDPCCIXABiKdyD2CB8AAayI2kGUedVORgYTdVEpggQoG4YGeaiUNEaVlknet9zY2SEPkniFhYWFYV0AwjFMFcLAhewnBcKMaEQEBBnSID4mM6IaqUfoqoCPE6s6Cw8X6JYViGdZNm2XY1NyCFGUuchrlue5cEea1IUybMcStX5_gCIFZpWjKmEdC4BR4ZjZAASTkcScwDPNpRGRRsGmpbDrkAAFDBcDlZ5Nu21F3XGE6cVzLEKxI2aSRi8hdIwOQBAOSQyHwJ5XnpUaz1u3BQuBbYoAWGKWAgMAniRlbSNwOAFrPMkkZRvHegJ_FIClGTEr3WbQoZWaUAgORQoBML0Nmo7MdEV6-c0JgcHMBGSauFr4F8MhRaBDATDDAIwB4fBxDpknyQAA3ECgKHYOBEAsKx2AgFABzIDzrFN0hFAsEsACYLFmuALAAEjQ74ebkTRNb5lgBfp0nud-FHHnlxWKTgaXzGK8gXmeQQAAY1E2s8OJNc16ZnKU9QNsWmTZgRBHFPRWEMX4jse57lBAe008zs9nWpWGmfz5kzuYdWNcfeTgHMsnRTYJoSDBvUUHHqc1XQpuAGEMUlCgISori0sDpgA7TitTTtN6k3hQS59wBel-J_0pOYPtFAFDICCIpHWdDXaAH0MSgIXxBgCABR1oiABZE8TkLCwdJd5kE0AsHKhhjBmEsBCfGDhnDIFcOQb0ngKrNUCGZWqkxIgxCwY1BYGDWo4IKB1T68Amo1HSJpeAbVCg0PxOUSohCqH1BDiQ9qEIuogh6ukPqWwdiqQOMNZavRRoSxuHcPw30g7fDgISEwI0gQgjBEvcUG8tp7w-mMREp8BLnyEP9ch-JnZA3piDEe4NvxwChjDHybcyTYyeP3YOZE9Hi3GpLKO41GJywVhAJWKs1YSF1vrQ2xtTbm0tibMoSg7aO2dmwDRGska5D8RHLg3iZYwFjmQF4qc9zp3JPoGKTcaRwygnzX6Pcyx91SUwQeIBh6j0FOPFAk9zzfCbgAFSwLAZeqUywFKNFvM0FZ1TyNMBCHefFkxSlkL0tA_T3HVK7rZbi9MgwUD6YxPYwiNJZC0utXo0U15bI_mDGye4tm4CuWec5TBgF-0rJ8Oka5YyvOeYWV5vSBRQH5DAD54g7nXM-I8kFtkLDhQhcGKFFy5Awq2WgEgchJAwtQqklAoZ2CPBJEwNmpcyDdlLtsv5ALS7eAwM_V-W0KkOL3Ksr5LzblMtshQBFrLOLeGvh_L-P82AAFZE5TjgLfYAlLqW4DfuCzl-52XotBQi4ARL5TwXlbK4M8roJUv-SCNVHK173PVYakmdlAgOWIsYgmBICJ4rZrS6ikyTCsQVUyD5Bru6cShSyk1_thmFKinzD5yLUUgo-Tsq5K8yzpT4uAnQ-goH5UsLOZYxVSooI8F4VhmDgjYPyHg3NBDqirGGOQ5GHCGq2wRLgShJaTjsDocbdg3DK0oGsDIWmCh8CXQ8OgFFkhCWgmODYF4pdgClp0cjU0ECE15RgbgMhOj8QOHTe4cqlVs3VrapWxdVAa0Yx4SW_hA1RqEnlAIatGpyGPCiBYKIYyLjOwvWWq9Oib1O1-JUB9LBZrPsna-qg77nYWEQGze9WgZ25WgQVBhZQKirtQbQRAfySCYCgDNftp8wAoIALSbEUNASQAg2AGSgAxXU-AfxxRGOuEApcji4AgBgKApc4AYBljhlc2MFjbW0lAXSo1xwUBw-FdjcBsOZgECMGwshKPmB43vAmK1RrIvkLIHDpB-PWHMAITT-x9YwAU3CJTYjwoqb8FSHDyLdZKAEEpdgjgMgkH-ezf538KACi4JIIzjATNtHZZnPzAQwV-nYGDOcAo7OJwc0ZyBYXPJUpyQ4cgCHM0VT9GwOA-BGPsF4PwMWmXtn-Hy2wEwMA0DxY8jh9YJZOOyAYrgNgDdRBsDQCMaAcgSsgDKxVjAnkVAOma2wdYHb1jQwgPAfLEkJD4JrsRkA-xxiThADCIbIAasABEYCjeoPgCbfAkAFZAAAAUwDWCwpAuBdcW_AZbzWxCGCwDgHDoMqTXZbLdprFpWtPagDhzg3BhOVve0tr7OI2B7BgOxnDPXKv_agCMAU_IQefbo991wFQXuWNkCj20aPwcgB1ooP7sO-tVfYAjpHixDtsBu3j-7ZcaFY7BjjmnC2Pv0_R6T_rbO6d3a5-VuHblcf84J9zqrNW6u4AayLgbmUtDxoMGxqUyLHCxLIJAAUuTUvroy4uGAPgbtdbICi2jCuyCQPF-rzXaakFlTQcgmWAQwtgqBFwAAju1rgN6XfiHA9DTxTAaIUGJw2QXZP7qU_5CjD3XviQxBDyT8Pnl4eI_5P7iWZwmAz1gOxsPvXPKR7T8wIWbuYCe4gN7qIkPofi9T1T_3jBFAou2Dk5Yqw0mjWb-sAQUQas4BIOweUlAojNZqwAZXq7IAQElixsaWTAGiJBMgzw_p5NUEUGcXimpIE4EAFTMagJgdfYoIqrdUDV-4zne8wBLMxzj7oCAwBw9i0fqgPC4CI6QudBUU1q4cG_hcJ9AOBQDPhaJALACqjAL3m1lKLAMVIAWSAOEsu5I9J8L3negzr7gIL7hqPAM5gxI8E_E_MWJiMStED_rIKPtEHPn0LxINsmHAAQdAWLPFNQHABAONEXJ0AAaXDwU4FEHXFtM1hTsXnnNiGSCotnrnmQPnpVkXlTqOhaFIcHqHsnh5AofyCSLqBQLAL3qZIWpEFts3lENvBcGoM1t3q3mAT9K3uIRWBJKTLdgIBYPQPQMVI4MKK7BYAzmSFeDAb9szlSFEFvL4fSkti4W4XBnAN4WESwP4YYmvI4XuK9tPtEEzqkTWoLHEaIMkUyJkb3kwkEVQTkWSIPrqFwfSkyFYTkBvjRs8kUshPTEISMjiEIVlPGpoJoEAA" target="_blank" rel="noopener noreferrer">Run this example</a>

#### ** Typescript **

_./browser/BeerList.tsx_

```tsx
import routes from "./routes";
import Beer from "./Beer";

export interface IBeer {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RoutesComponent {
  public beers: Array<IBeer> = [];
  private showBeer: Beer;

  constructor() {
    super();
    this.showBeer = new Beer(this);
  }

  async onload() {
    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();
  }
```

_./browser/Beer.tsx_

```tsx
import { IBeer } from "./BeerList";
import routes from "./routes";

export default class Beer {
  private beerIdParam?: string;
  private beer?: IBeer;
  private beers: Array<IBeer> = [];

  constructor(beerList: { beers: Array<IBeer> }) {
    this.beers = beerList.beers;
  }

  get beerId() {
    return Number(this.beerIdParam);
  }

  routes() {
    return [
      routes.beer({
        onload: async () => {
          this.beer = undefined;

          if (this.beers.length) {
            this.beer = this.beers.find(beer => beer.id === this.beerId);
          } else {
            const response = await fetch(
              `https://api.punkapi.com/v2/beers/${this.beerId}`
            );
            this.beer = (await response.json())[0];
          }
        },
        bindings: {
          id: [this, "beerIdParam"]
        },
        render: () => {
          return (
            <div>{!this.beer ? "Loading..." : this.renderCurrentBeer()}</div>
          );
        }
      })
    ];
  }
```

Here is the entire example on codesandbox:

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0ZN9BAEIweAAyEFbKqo4gzkGh4RQ-xjz-ApgArqx2UU74GVlJRjDUpoJyMGCE6VCC9FBi4gCCpALFrExy4lryimQAShiZ8ADCirxMbILARgICxGgQAG6ErJIQ5QDiaMEUEEwA5uIAvMqEULiGTLPzSyswAum4aAByhFz3JxpJ1wvLqyjBNBhCInCZYARxIEJAAUAEpLjM0oMsnCBNMrrM0jAKOk0FcANqIzFIoZwMgSRQwaHo4nE7YdPCIASoo4APjRRNps22OLxAgoEnC5PWMC2Oz2hwEAH5-YKyfTyi83jAAGJ8LiopkCoUKvBi7ESuBwy5c2YAX055thABpLbKhQD4lZOQBdE0CC1MRG6oGEKTI6GMFiTJndHS9ABquhVaEI-3eLFhHIx3OxuKuAB4uIQ9qzgEH2hQzRn8Nnc-7Pd62Ir9bsDkakzTMTz08y7Rm5EtWXbZhmJABGAR1Bqvd5HYCuWzkmBQKAYM2sgASM7nkQci5kPS4AEISwPuynaRnCJJtmAjhoAMQaATMOoQegAa3HLPZ0O1ZMFm22BvrAhOFBoOkMCwguPaYs8bTgSWhAHlyJadoscGYvCiKVhiPqjqq6qok2qa8lc0LtohyHwfUAJQKRpoAOoSCsAjhAI_q4gITDKjKGZ7MQmT8puF4gKw1CJCAAgoHsnYHOO-Ifta0SPHgWEaC6ZoCPgVHEiW5EzupmLAB-ZDyUq7wCAAZCZbaHvBJHgcSACagwAOTbKx2CiAIGZWJgBysmGuhWIQJaecw-zsnpcoGU8WGeqamIIV24GgeBYVCoZWGmeZx6nhU475O4jpoJ-Z5wgui6EIs9wnvlMGstFR74NZh6oRinqeiAZrWiA6DYE8-CQpQNB0CABaTBwfhmCIYiSJu4ZKPY6iaNNuhJGNUwCAAkpCHprvNsSAsCwmXCtJJZNt0TOLl3ggAiEwlKk5SVNUtT1F4EKAsmPy3P8gJrXIAAKhCxlwUpMp5Erujcfz3PlwPrZC4O_HcomAnATKNGgsZSBmG2AuyJz4m6RiIkGnnpPQFB8NC-X7UywBI3gKMCGjGNY5C7Jmo2nL6flxx01CVhkNzFaExi-zYrzP24ZyLZ8s86RcACaDvuF-U_f9gNNeawvcsi8CS4e0sEnaF0C4C1Lgcwc6EHITJiFITD0MySZsu9MX2mS-X_g8DKQBMcjXa7DFgMyXPI2QsAHAKHOWaaId4J7scFWQPtyJTb3O_lZDrP-RwAcr31yBrrsqTOuAuwHxOCNscDjKXJyEFgOaCGA2L0BIRHRzFAAGEgUBQxAo_gRDEBAZDcUwj4kCPjBcPgiwAEz4Nz-AACTJe7-dmp3Nkoe6AcJ570L143WLV8wuBkAAVnAzBwrC-IAAwEx3mK1Vy7XgWJHSGjT2_rEy0lylkhoFWf0AZvCUuBd-z8fRMlfGXU0BsLIB17CRYA2594yg0CEDAVsJRkHwTeLU4UfTDFxPSCgkJipxSQtvQub87Ts1dELL0GFqx4FIejSYlCo50jTHyTiXB9gCDgGgeg44E7bkztmUWAB9XEUAVISBgBAfYPdxwABZ773xUmpZhrV2qdUwDgPAvU9oJH6rQZAQ1mCFlGikcaFgpraF0KdDQvlFDLXsYICalhrC2FcTEFwfj3CeEuodLxx14ABPOjrMJvgImbTmmdUxeBCg3VKAxYMaBKj0HuNjOOTY_6sTlgrd0bF3gg0AmDREFA4xQD2DASpCwDjum4HGGAci0BQCadUpg6FigZPulUGoQ5nriEhPtVoQlqxdEWr0AYpJRgpAmCwF23EUD1IdtzVG6M_Qsxxp7fG8NPr3DgBSLAkImRwy1kOM-gFSbk0VjwzEcB0jaGNJzcKZzsCbVBDAcElCPyF3QrMW29tbxMEtinZ5swK4nxrh8UQDcIBNxbm3Nxvd-6IEHpPUe6Rx64unrPBe3MNB0Ldibemnsj4ovhWfGAl9r5MA-c1G5F09a8IIgIQk0djbczNtAthaBYFO1CtvRB7dkHuVQQnMk4d9gCmlBSn0AAVQgGyqRJiZFgnBEl9j4LIBoYs9V4rP1mOS4kr8X42jtPpb5FzARMLQjciGiNVXqtgByzEEAg7QnQXnemYc2AKokDC5sfCmC7w9Dc_CrZJVHlqRq0ZI5lTjknHlMxVgwLPwzAKGAVsdIaUAoWhNEhVIlqLRIVkWESwCgrbFOtar9j1ImLWqt29eyKrUtvWtaAS1tvzXIftFAUAYDkFIeta9KWJ2zMQaE1IGJyFkuUmAslanNoabJNpsj5EelFfAmKEqO0Nr7ceotQ6z1Hm4EIpRKi1HAAAKzaOEaI8c26OnyJ0fW-C-AKAXrNaaXNQ7gAruNX-79CbgPrpbTAMD_6pXnog_BE8Egzw5VidO8kRVaZZ3Zgue11VL29l_fBhDvaIMWtpHh6Cv7R3jp0rWj1MAqLAqMPojqXVjEEHEsUfqg1hrsEQJwCJPinFbgCe4vQV14kZNE7lNAEm5kz3k54jJzRiDRKHsQNJkmyAkFkB0aECh6By0mALMdUhl3_MZqQOEslabyb3ZcNqHGjE9WNlQfjNiRpCaOnJnWCmkluKU3kALaSBl3QqMMqYiIKQVMiWgMguUiIgHwGS20GJtkJaSzrFLi9kbpcRPlJk8mctDDy0vRA6wyVsecwYzjPV01klCV54MgmkDNowCgM4lMLPPLADYgAtJULg0ApDapAMuKA5Vdj0BPJBYCGhZJowgGcWScBCBMDgINp4PrLjoWnLODALtBIUEG4BTbcABtoC4EyN52g5sXDY8Ladkymyjp0HgQbjBZwkFwEyH79R-4wH2y9qmCR-QKfe3wRUg3R290UEyfsxBqDCIwPUuQAh6mqIoPsbYUhQcsNexDv9GXicREVU2YgVs9VI_vijwnLmQCde61AMgcg-NWIExQDg5RhzOS4GO6o9wNBCA8F4L4TAmfU6fO0xlzBWu2KE02DQK6NATdFmd_y_AYByEG3sFF53LoZdmBoOA9AFjECoOr-BZvan8BtxoLAMAUAy8fIN8oiwdt4HKmgJbnJgHpGgHIR3IBneu8IE-SX5oTfRHKAZ8o9sIDwBt3haIknQ9zzIP2Mg99o8eljxoT3AARGACe2D0GT5dH-h4NB1HzUwQb4e3eDeIFAdI-w9ih_qFkYSsfTdDS8INqFqSkDRB7_APvAfNAUC4FAJvLuW9t4713sfGgJ_OhAP36I6bh-6tHxNjfU_a8CW2yPv3a-QBH_9yf6wshzeW-Eofu4m_t9O8X5Hx83eX_H-JO_iPT4329S3-veN-f-YeH-gBnu3uaAvuIBk--eLUTOG2HQo61AHgzAkA-qV8CuXO3m7WKuAkMAPAE-oeTAY6MAku7Gp-QYWB8uUueBbWPOyuiIdeYw0AeAAA8lbhAGfKntPoLnIMLqHksoLkwAAFIADKYBmIZugwoiMAAAsiQDbvcqutPvUigDbjylyBoPAAAGwyHgFLQgCuhv4gBXzUCh7bCR6_6yEWE0Aqi2F8BSCh66aWFGE75VJkyqFATqG34Aya6h4ACikhhhphrKfSRgTOzen-GBTAdBV8iuPm1iW2gg1OiqJw2wAAjkHtsNCA5BkRIA5LCEYHCouLPlANRJAY-L9O3p3lcFkTALkRAPkQ5D3HPgvgAe7svg0SUWUXcmiAIMMLAJttUd0XUSvlcCpE0S0W0fXptl0UvvUXsP0SwoIcLmQBFvwDzE2IIY0gIA5J7jOBgMQAmBQA5LHp7pIT7oyPAp2BthqouBgFYMMEok-FqH4dvnKI8lIM0BAE4bON1h8ZDots1FcTAIsOTOjkyA5JCWcDtvIbkoNrOpcYiJMGgONocc4A1iYjxugVQGiRiMiNxBQDXsSJAOHMqLCSgPinILAIykScSOspsv9AKLCfgEyZiEUUyEUUlvAOjuVNCDIjIp2HiMqLJA5LiWgJcYcQ8RcaUeCVWNfNNgcWnm0GwHALwVtv_A5IyZKf1LKXqVQNQA5C6GhLHr0XsAzDoZiGCMMaMUwOMW7pMQ0XZpyPaRUXPs6Z_q6XsNSLsBQLALCRuM4g4KXoLg5IwhiC6LHhscGfAkBLYP_HaGnsSL3kyGlmoBYlKMvPgNvsSPJOSa7OfrCVQHvlbHgA5JAgwgWQepiBmapGoNmaEnmXWbMEWdytvGmaaKWYcbvuftWQBlAgHD2VyH2Q5KEhWYqFyQHKcbsGfMWVKvGfAJ8WCVKlavQs_OadHFajuZrFEVLmaMeUAA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

When user navigates to the `/beers` page for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. Since the `onload` returns a promise, the UI will render again once the promise is resolved/rejected.

A similar `onload()` method is implemented on the `/beers/:id` page. Except, if we happen to navigate from the `/beers` page, it won't perform an ajax call, but instead draw from the list of beers fetched previously.

This is a pretty advanced setup as the app will only call the api once, no matter which page user happens to land on.

Speaking of `/beers/:id`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

?> Note how we use a custom `beerId` getter to coerce `:id` param into a number. That's because all url bindings produce string values.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
