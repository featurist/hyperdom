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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtCIvYlcFJikZeSUmMGNFJgByINkFRSjGb19_JmBxHCgSTTCI6JQLOApJWDgUfDg4RLJGGEcUgLkYMAwAVygA_CgMSqYAQRs01S4yJtwmAAoASiHmUS4KVtxmCdVRJgAeRQwIMgA-NfXN8QBGJi6euABedMzsvYAJO9zQh-k4pQBCDYtTg7n1j9trt_uspqptGRIboDEZTOZcBZdk1HPYEMhXOQqDRECBkn4ArEQpFwqEYu9idV8akBuwXpEogVrOxqowifEUMzqHIJgp8K1FB50CQ5JI9EwyDATP0bNNwWQYYZjGZLEUSvBypUXG5sZ5cYgAOZZTBQCZoEWSGYMOZgLEAWhaimgkgEbCeUAAbjwIPgMEwAHIwVowNjivq4CAYKDiuAYMhwO0IiBgADcWkYjBQGSgWVmLCojgodoouDjcFtuEUAlaNlkvvMaahOn0HAw-AA1hgDTA0eRtViPLRrWIQHB8BH2Lx-HnRGwihh_NO2CYYGh2G323amh7E7IvbhQ4c2GhWtA5EuQCu1xuVHN9Ko2E0ZKNqPgIPBp8PZyB2UoL90qCKW8WHvOZHxgD0ABEYGfJoyDfD8kBnEcAAFMGwKALFILh_wwQCKEPAFWEMLAcDtLIMDGXD8MI9Zj1IqA7U4bgi1_ZQkLYAD4AIkA9CPVxYDjO0r3XDsmKgVoDV2ajuNo78KgTCiqI4kAuKA3j-PEChFEYkSN3EyTpJUtSeL4oi52KWByJISjZBk9SzLoy9V1E9t7NM_i9LEroIHcuSRy8zdt13XB9z8kAIXTBUW1jUZzVRNxIANXsFQxHVB1xL82CoHwuIvMgRRDCKm2igxAvKcgkrRft3BxTF4wCdcKHEJgriYLgAEdTy4CYoia8QonlNwiiYB5tKgAB1FyNwABQkqTmDazrupgXqtJ04TprE9h5t2QbGGGgJgCYABhQSyCm68OzmwzmByJaYC6iAeqiLoYCEwKDIW_aajIRQRXaHs6gaOBWpnf6mgEKJtxwEh2EFSgokcphtwoEgSCgKGIKjRMSCWfAYDtbYWWRjxcBdfILDhFVEWROo0SR1Q8YodhWgoAQvxYSBYDIDBBShk9RlgBnkZYfqBH6lAuDgDGvQmAB9eW5Ge3nBXFKJqYRJHomVoofpA5HpdlmAOcOOpsTgCByDgARBEZBxtftpwog0O9kZ226baEQ5JWlM73ourb2xuhbplFiUpVG8bLtckPdgmYAKAgChYCht5gniJhoP-qJNHlFg1GRiHAdNojcEBr3hCIlhOaOfCBAseh6DRRwAH4ABILHD9ZWnMAWGOs2zcGqI4mFA0fa_WeumEb5uFM77vRF7k3vero5J9HpglNkKG1Ss7fh8OUfx83muj83g-oYUwexkZtfR7hpPrdL0_R-L0oBBLYNz-Pn_REhU-rtf5ESAWPKKuhNCaCAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQE0IrwACgBKc1q6-pgKKLQmAQAeCQBGAXjEgDlCLhgAXmAJKxs7AD4ACSXbFUUBNZlcrgBCAfwRlcN--yM7IxA7ABoQdGxcAghM4MoEZBBGFiqOCY-IIRGJJPsdDttupNBDdAFjDxgQIUsRHDsXERSAijDlIVwyCRZJkmgp6FEZiwyCgMHIpPcBJUsCjSK0Whc7o9njg8G4PF4fH46L9mBkKBxEABzGwoQhQJo0ultGqXMCigC0kS40CkiGcIA2UAAbt0IPRCAIJjAojANAykmgIHKGXBCEw4OrXhAwBcbkwjGRFtZbCq6qxqBR1RQ0G64Gq0Fw9VFSHhzbhfbcHiBpRhZVAyHIvsK_mKOOFxg0BFxaTEYPqhIL_CBM49iIR6ABrQiSmBkABWcGYxdFAMQIFD-qY01tSH1Pcj7kI_BgcnV7wgkaodo6Gjg9EdxC3s4ndV3FCXFA0eo0WBgKDbnfV4SNnrwJrQ28up6eUWgciv-q3ve7YdhoHQPDuIDhMS4RMPQEDwABJ76ni8KzhoABMZDDGQAAMYGXBBlwaM-AAiMAwWw8GIceHTfvEMBuuqQEPh26rEFAUSSu8AEaAkrDuJ-nT6r4Ho2IQxS8SA_HwJeID3HRKEUFwUDMXerHsZx3H-uh0mEAJckKV--ruJ4MDquJkm6TJgnyYpGhUBZGASXgUk2YZ9kgB4sh7gecnXnpBlCZ0N7qSBbn6bJwXfixIHqvEEARUFdnGaFwGPs-r5oO-SVRc2hHXJyICupkNLUD4zCQJK_aDkww7_OwY4Tg5MA8DJUlMLSM7XC2Xl7pVEDVQOQ4_CWo7jpBjA8NAeAAPKHhAzBNnqyG7hgvT0DAACyJAAdGNpGcJfEQCgAEANqKd-8AAGzRSFUGKARwkALqHfdA7UFJDTth5qUgB9ABiP18FIUmoXkH13Wejr0P5Aj7baBVMHYRWxZ2FVMFVNX1aWY5_O4AhthQEgCLMXQAI6_g0TQAORExINMtEY-OCGsylQAA6mFnYAApae8pMU1TMC0xI7NqelbEcVx7yM8zS3VAIJSwG6XOS3zMv9A4ZMNJTEDUzTDFMWjUv80wcv-kw1ZyLWZDBKE4hkxO1swHqNPPlYGDEJSFA029z4UBgGBQG7MBGnKnrrWgm3qlwJB-x0VRoLqAg0643KvPg7zhOVVAJ5c60UMQUQUCtimQLAU4zG7KBRJksA1fnwn03q9NkA0g7GiLAD63dyPrVcwAyNMZ3gfup_37gW3URF1B3wcmmXxnpGwcCLe6epnWnA7j2nefD181A0894FvdL2lwJvilMkrKtMGrrEa9prRvXUN9sypD8gU_7xNMAFAblgG7PY2hdACHItWGmdgmaXFeh0a2tYl7CTQLWS-AgLrGTqMhYSBk9T4DUGoQ-AB-AAJPgV-wkBBRFwEgyhwlLJ4Ddo5BhaAaaXU6H6Ohs9KHYM6LggQ-DCGiTIRQ4S1DXboPYcJXhdCWFu1MrAJyLlWFSI4aInhqj6HOWKG7USSjihNzoZQr2AClq0KMZQhBXg9QI00RwuxnCjEn0wVcYyziZ49TqnYbxQA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtN3ApMpM-SUmAF4mLgBHAFcILgAKCWlZBWUQAEoAbkZvX2BxHCgSTRCwmCiYmHiQFAsfSVg4FHw4PjTMskZFEjlI2BQYR3YSXF5i_CgMZqYAQRsmBmYSsjlZAHEuHggyAHM4WNS51RYIMCZYgEIKcQgGq-W1mA3tuH350VEuCkjcZgAeOQgAG4APkObyYP3EAEYmGMJnBgrl8oUgQAJJFMMDGRRMFGJQKKM4_CxQkELMHgjB-LhgYIAcgAxLSmOQxhB8ABrBF7EJApiXa4oW4we6PHbFCi4SIwTRAgBy_QoRIwpPJRP-wNBRRw5gOZPePC-v3YctMfLyZBQlqJxs1qm07QWXCWslOL1BH0N4MUGE2KrBwH5DSdy1wIoomx2e3tbyJ3t9dq0On0hmMZksm2WjnsCGQrnIVBoiDzZB8fjxyWKEWicQSAWSbAyWXIpZm7ErpWrFTY1Ws7AbbUY_iSShQveocliCnwkUUHnQXUkeiYZBgJmmNj2jbIugMRlM5lwNQodXgjWaLjcBc8RcQWwKmCgsTQC7dCzA-YAtGAMIpoJIBGwaJQACGz4JS8pSmwS5TLgEAYFAS5wBgJYfgexxtPajCCuirx8gqH4SshcDvrgigCJENiyGB5gYUmBjsBgHIYFsMDZuQF75h4tC4WwcD4LB7C8PwupvLxFAYMMwlsCYMBoAxHIfssAKobIIG4FBoJsGg0RQHIUkgDJcmMeyKgLPoqhsMsMjOmQ-AQPAwm4WIIBDvi-njFQPimSw5kLJZMAAgAIjA1nLLZ9ktAITmsCAAACmDYFAFikFw7kYJ5FAaXqWlYDgH4FBgIZpRlWWiYYuVQB-nDcBQH6ufWSAxR58CZSAeiaa4sDIR-hnyeyVVQJEWybMVLWlaIbBNHA-UkIVsijV5bUdeIFCKJVvXGQNQ0jY1bDNYt7XZSAtSwDNc3qbtID7a1h1lRtHILTdHX3f1rKPeNzkvYpAUqbganvSACZkPaO7HchcjPlmbiQFsbHbrml5cUWPEgFQijsM1-lkF0MCmSDyYvY05Aw9mHHuIWxalgxlztmUcS0tT4i0qkTYlr4KKrVAADqsl9QACoNw3MKEVblLEtIrWtPW85tGPbWQzOs6WwBMAAwl1ZA80ZHIC_LTBFCLHZi7SYwwN1X1y0LisOp03S9P0gzDHAxS4bbMACLSSk4CQ7CzpQtK3UwSkUCQJBQB7AXwahJBfPgMAft67AB6oHi4P-TC0tUe5poeGb9NmycLDHFDsJEFBRaCkCwGQP7uxn2lLL0DiF28jMCIzKBcHAYcgbEAD6ff_N8tdLrS2cHgHGf_D41s-YHXc93X0UKtQcAQM2AiCJnzej9mji0hoZmB5bmxwJvoIrmu6tm5rMs64Lmx7IHLCXzinNa_zD9kLEAYQBQsAe1xHWIIwVOi0k0CzBYahA62x6Evd0cCz5CFBCwaKbwMoCAsPQege8AD8AASCwz8wSRHMB7BKeUCohlpCg_WxDUG0JYBgpgWCcFTUIfQ0QpC67CD1OSNB5ImBUNkB7E68dhG4BoXwsEvlBGiAEeSCRHsppnWoZw8kPtwwbxEnIsEsD6gCAlJBaR5Joy6LMeSQ-pjQRWP1ombcmhHFAA" target="_blank" rel="noopener noreferrer">Run this example</a>

#### ** Typescript **

_./browser/app.tsx_

```tsx
export default class App extends hyperdom.RenderComponent {
  private hideGreetings: boolean;

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQFiNAgAN0JWSQhwgHE0GBgKCCYAczhEARQMDFhCJkMmWoEezLxu3v6huAAKAEpzebqIMAENgEIKCQhvc66evoHhnZqmOueFvqi0J429l4EAHjlmgA-b4_P4SACMAniiQAcoQuDAALzACRWGx2QEACTRthUigEmJkuS4x1--AhwKeoOev0Ikh6YERGgAxBoBMx4hB6ABrZHbASIwECM4XMhXGArW7rAXCtBRGAYmHpMmESnUv74AFNNU_LazF4OKy4XZUl49CjvJ6_YiAmHYYWophkZ1km36552eaeuZUxbFfmPM1vD5_LiEAaA4Ai7x-5Y3NbDbZ2MlhiPu73ekB2AA0IHQ2FwBAG4WolAQyBAjBYVQ4Jj4ghEYkkRJ0-Lx6k0Ld0AWMPHrAhSxEc-JcRFIPaMOVbXDIJFkmQ2CnoUQRLDI4zkUmzAkqWAHpG2eqMWdz-ZweDcHi8Pj8dErzAyFA4iEGNhQhCgGw3Uge8zAD4AWkiLhoCkUYNGxKAmlueg6SVeUNG3JJGg_bc4GmOAAMLA5Zm9IwxRxE06lYagKAAig0Aw_80C4UYolIPBYNwXDjxzEBXwwd8oDIOQyzvKtHw4cJoR6AQuAwOQYhgZwQCEG9_BAVjc2IQgeUIQYYDIAArOBmH4h8a0QEBAxkph4RgDRwPYvosIoQh-BgOQAIGCAyKoRD5g0OB6EaYh3KQIjni8uz-EsmSsBgFAVJ5ADwiaLC8GgtAPNNGSUCiaA5DCjQIqi1TuQ0L1s08kBwnncImHoCB4DCky6g0KduwCjQACYyHBMgAAZCqpHMSrigARGByrYKqaoCuqZPiGBpgA3Lou5ADiCgKJBgGbKQASVh3BSl4NF8TCbEIYoNq2-AKF2oLNAoLgoDmyKFqWla1rmZrNtac7LvqkB3E8GAAKOk63rOnaQGK1KNCoAGMGOvBTo-0Hwb2kAPFkbzfIu4GEcxpGrvm_L4e2nHvhyh78oAzlCc-sGSZAfGYrihK0CSqnQa9Iw7BPH7pjkcZSyrSBBm03SmH06t2CMkzIZgHgzo2pgJIsxSmEzNiqAFiAhZ0vSKwEwzjJKxgeGgPAAHk_IgZgFNGSavIwd56BgABZEgwoo-Vce-qAIBQMKAG0QRk-AADYvquprvgAXU9mSdOoDaelU4mIZAOOADEk74KQNsavI47D4LGnoTHRndizeo5rn6e5HxmEF4WxcEoyq3cepWgkGUegARwynoNgAchUs5-62IwW8ETEbqgAB1MmeQABWegZO5gHuID7_uJCn-68pi5bVoGEex6t6oBBKKYmFn3fuUXg-ngcRFXjXjfptm6unrvo-fXEyTYDIYJQjiEfiZH-MBRj9zilYDAxBVwUH7rjOKFAJhQHATAFod1dIO3-mGYg8D5hVDQGBAQ_dXBnkLPgYswQyx4KpPbCgxAogUBtt8SAsAzIInAelTIf8dI0JeEPCQowBFkB6LpKCMANgAH1JEAg-OZbc_cyF4HgcQgE7gv51D6r6eAkxoLMNSukNgcBLZMBGAIP2JDeEKOodYqg1B-6RyKvMfeL0zEB1SruM-F8r4LVvi9bYMdPGT1uj4_KfiBgbCjK5WA4DCTaF0AIIa4l-52FHlSaO8wf5SX0WaKSbjA6TReETUY-A1BqDLNQAA_AAEnwDHF4URcA5PVAIQGeBwFQzaWgfugdNGBy0aCQpzxikCFKeUg6tT6nPEaWA8xvTnhDNBF08Bv1YDQ1ht0-ZmipkvEWT8ZZxCDrrOKHwlpdRoH9Cts0s5dQsleFLnKcuNz7BbJealF4jj3lvI-ezFWrE7B2CAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtN3ApMpM-SUmAF4mLgBHAFcILgAKCWlZBWUQAEoAbkZvX2BxHCgSTRCwmCiYmHiQFAsfSVg4FHw4PjTMskZFEjlI2BQYR3YSXF5i_CgMZqYAQRsmBmYSsjlZAHEuHggyAHM4WNS51RYIMCZYgEIKcQgGq-W1mA3tuH350VEuCkjcZgAeOQgAG4APkObyYP3EAEYmGMJnBgrl8oUgQAJJFMMDGRRMFGJQKKM4_CxQkELMHgjB-LhgYIAcgAxLSmOQxhB8ABrBF7EJApiXa4oW4we6PHbFCi4SIwTRAgBy_QoRIwpPJRP-wNB2gWWtUXCWsllGEUMAAYkNFNzXqJjqd-TcIHd1hRNjsXqCWB8vr91SryeDxtgoL6_UwAOriDC-a5MSQkL5MMhGmAAfnBm3YkV8FESwTYVEcFDYTDQm3-21zIDtKEi5lwhuNbCBRPTmeDYKJAZwbbewCrNYNSaYADIh-CfQBNOO0rgJ0xMSk_HzGbZA_xJJQ-DBEpfkLa83tXBr9utJzRqwFArWqiw-zWqHULPXLXCW0Ge77gxQYTbduZVp-rE6Lq7KkV5ggeAoASexpmrgFqgaCRJfj-95aDo-iGMYZiWKW_T2AgyCuOQVA0IgRFkD4fh4skxQRNEcQJAEyRsBkWTkJRMzsLRpT0RUbDVNY7AsW0jBrviKCCdQcixAo-CRMalDoF0kh6AmMAmNMNh7KxZC6AYRimLWNTZvUjTNC4bgkZ4ZGIFsBSYFAsRoMpboLGAxEALRgEa0CSAIbBolAAIbPglLylKbCqVMuAQBgUCqXAGAUR5tbHG0D6CuiVr5hQHkSklcDuXBAiRDYsiheY6WMIw6APLgAAy1w5KoznyLIHmkFA4zsOYAidd1lVoe0ZC1bIjWURKBwLK1z4ec5FAUEoAiQuwjhMHAJBQA6TBbVs4gUFsXCSFVw2jQ1TV8nIeg1dgY0XZcU0sOwGByGWWzLQADKtJ16RwGAchgWwwPh5AWcRHi0FabBwPgMXsLw_CPaI0MUBgwyI2wJgwGgz0ch5ywAilsjBbgkWgmwaDRFAcgYyAWM4_97IqNq10LGwywyPqZD4BA8CI1aYggGJzFIKwIDjFQPjMyw-iqOzMAAgAIjAnPLNzvMtAIAtiwAApggYWKQXC0xL8CFiArNvBTWA4B5BQvbIJuRmbZNkmL-u25w3C5cLShO5L5uW8jriwElHn07j7IeewUCRFsmz-y7Fvk64zR2yQDuk6LbCm1LyduxIFCKFA4fY5H0ex_H7TZ-Lzt50Hgu1LA6eZ4n9cpxHjNt4HHdl4zHVbd3rtW3Tfd4wTRO4CTQ8gKhZBar9iVLM5jiNOQkBbCDumEZZENkVDlYwIoMfO7TZBdDAzMLxhnccmvZAb_hYPuKR5GUc9D2hHR5SxLSH_iLSVIbEKK-BREXKAoYx7sgAAqV02NxMocRaT7WLqXBmeMY5x02IA4BlFgBMAAMKhzIJA9BMC4HMCKF_HiP9aRjBgGHW-UdMFVxwcNTo3Rej9EGMMOAxQrQcJgAIWkBMcAkHYApCgtIg4E0WptYRCs4opTjAQGAHkvzsGkaoDwuA_JMFpNUAy2FcAWFwqvBwWiFhxgoBmCgWtQSQFgImY0wjKZLF6BYhuTB_4CH_igLgG0goVAAPrBP-N8JMqlaRGNrNI_R_wfBsJlkHAJm1gr2LdgqagcAIDsQEIIAxnj9H4UcLSDQLNVAsM2HAfJoIyDqUIcQ0hkdYFYLIHsLx9SNJgOLs0xmrSq6xF7BACgsBhG4iYkEZWnRaSaCAQsNQQcOE9CEUjD0KyalCHdGssEAcBAWHoPQEpyYAAkFgvFvH7K4m2Jd7bPlpNs2WbsWDazeHspgByjlNDgGci5ogrlbOeeBbZ5I7myGEU3NRYLcAPKBW8J5IYXkgrBNC4R3yW73L-eScRzo8k7MRUwZZ9QBASginCsEYEQyUrBOU8k1LaVMC1NfTQmggA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr34DgkmFCgYBAX2WqBGsvjgUpsOGXpw4BoyMYalNBORgwQgBXKEF6KDFxAEFSAWDWJjlxLXlFMgAlNnC0AGFFXiY2QWAjAQFiNAgAN0JWSQhwgHE0GBgKCCYAczhEARQMDFhCJkMmOobm1pgBKNw0ADlCLhhR90ah2dqBHsy8bt7-obgACgBKcyO6iDABa4BCCgkIby-unr6BsN7jU5nUwT0KFE0HNro8wXUADxyZoAPjh8MREgAjAJ4olNtsALzACRWGx2FEACTJthUigElJkuS4bwR-GxaNBGLBCMIkh6YEJGgAxBoBMx4hB6ABrYl3ASElECT7fMi_GDnAFXBXKtBRGAU9bpNmETncxH4ZFNM0Y26zeF2I6OphHE7FAkwABifC48pB8OerxVPw6Gv-lyBDy54L6UJh6J5Vpt5oECISKCsKIA6hJWgJvgIpBgoQImFsYAB-VMDYhRQQeWRCkCsagUMUoAbIobEgDawYANM4QKs8B6NABdBz4FFs9OZhPw4DBsgjjblgQAMg3qaTAE1iwByHql7CiVN7ZiDFE5HSKdyENkXoZKpdfbyrj12NlJ50p7-ohM7ThX97ECUE3TwP04QhONXgTBEuEIAZkwxV9VQgtBNQjG5bhA7k0O8DCPW9NBfVw-D8EQ5C4SA0FnWdIwQDsfsQHQbA1nwTtgkoBBkBARgWCqDgTD4QQRDESQmVvJQ6XUTQpN0AJjB4USBBSYhHHpFwiFIJSjBvXQyBIWRMmuBR6CibYWDIcY5CkQdKiwNTSDuWimJYticDwNwPC8Hw_DofjmAyCgOEQQYbBQQgoGuWypGBI4wGCgBaSIuGgKRRg0akoCaAF6D5I19Q0QckkaaLBzgaY4GStZnlmBimDVGkozqFsKGSig0GqpLSNGKJSDwArcAaxjmJACKMCiqAyDkHjAoEkKOHCPFjy4DA5BiZYNCEfz_BAMaWOIQgZUIQYYDIAArOBmAW4KhMQEB_SHMttg0LKJr6WqKEIfgYDkZKBggDqqBKo4NDgehGmIUGkFasEIZ-_h3qHLAYBQY6ZWS8ImlqvA8rQMHow0FAomgOQUY0NGMZO6UNCdftwZAcITPCJh6AgeAUeeuoNAMxRKZAAAmMgsTIAAGem6MZ0ENBxgARGBWbYDmubhnmh3iGBpmS6nMelZLiCgKJBgGQWElYdwifhDRfBqmxCGKc2litkAZZtzQKC4KBdfR_XDeN02XThjQLfgNs3bhRHPBgZKHadkOQDD133YR5t7YwR28Gdy2I9T3nmyZSHoYjj7k7zqOQD12mc_D620-rrHJVrlPK8bg2cbxtACZbiOnSMOx3JAKrMnGagfGYSBBium6mDuwT2Ee56NFYHgw8FpgNpgKXnSHqgBKnmfbr4xaHqepnGB4aA8AAeRhiBmH20YNYh4s0HoGAAFkSBRrr9XzocUAIAoBRj2BMGh4AADZ64e0UgdaM44AEaGutQQWPQToV2JiAFBnoMF8CkILfmXAZ6oMjlgvYUpS66mKnRAeQ924TyYIfa688lqPQEu4eorQJA6h6AARzJj0a4B5jqfAPLcIwHDBCUi9lALMftaYAAVA4DF4TAAREAhEHgkLI32NMsZGxNgMcRkjH7VAECUKYTB5H6OlMooxcwHCEmOOowRMBhFax1u3AODiTEuiYOtTasAyDBFCOIZxz1Ak7AEAeHGVgMDECshQA8qccYUAmFAUYB4YAtB9jdKEH9kqIWICko4VQ0CZRia4TyHEuLjyoKU0ExYKC1goM_OEkBYCvWiQeUmmRgnXUafCUREhRgjLID0G6uV3EAH0ZnImhOWQcvTMBeTQCkmJyJ3B-LqMxV08BJh5XadGdIbA4APyYCMAQPYDwzw2bchpyyeLUAPOOBmRxDFByuWA6MjkLFWJsfrexQc7gAL-TI72gKlEqKYNcJcwNYBZMZNoXQAhFbrQPHYCRoJEFHECVtY58I9ReFGD8_CC5lTh1GPgNQahnkVgACT4AAfCEchKUwCHjngLJVA46Z2KAeCleEwR7OjHUDW8Jc7UtpXtJlLKwRsuuRS8VyqwRcrQFk9wMc-VZ3Waq0VHL4aGvVVku2OqBXyu5Ak_oj92WGrqPikl1Dt5ivNMK7k7qwRvNdcK71uyB5jTsHYIAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtN3ApMpM-SUmAF4mLgBHAFcILgAKCWlZBWUQAEoAbkZvXx9JWDgQsJgomJh4kBQLXPyUfDg-NMyyRkUSOUjYFBhHdhJcXkL8KAx6pgBBGyYGZiKyOVkAcS4eCDIAczhY1KnVFi4KSNxmeJnRJgAeOQgANwA-XbOL8QBGJiGRuGDgavgUcRwoCRNLcABIAkhMMDGRRMEGJQKKACE5wsL3up0e5wwfi4YGCbAAxGwmOQhhB8ABrL5bEK3JixCjiCBwP4QeZLGArdYFUIUXCRGCpYEPR5MABy3QoItEKIw6NFKKudweGVU2maMy4c1kYowihgADE-ooadMzvtDsdpZcbvLRRdhtgoHb7UwAOriDC-ZlMSQkQ5MMh6mAAfguq3YkV8FES-JAVEcUpATDQqyu6zjjOZKEi5lwuv1bFuKIjUZdmIsjpw5bOZtdTCzLNzOuDTAAZG3pQqlTX6za7gBNf0Aci4gdMTGx5x8xnWt38SSUPgwKJn5DWdOAjZzeYLME0ittXft5zQUYo5BJZDJlOp22CdO3ax4ACFObhNkKmFc4FhYHIvm3ZkABkSAwdM1jfWRhQxetRBBDBrhgScU3fY8FQsM8KAvMhewwntj3VV0tyZFkQLAiCoNwJgwzYUDwNWNYUGY4kBG3LV5lwKjgOZCgtiIisCIxVUZnVVQONkbjeNNB4IDAelEW3bBZDgbY63NHhLSaM4xIxC0jnpa0KD_ZD3nqL4fhZZTcB4nwYNdc5GRgcC8JlPlXLORzxCYCwPLc8Rbj3FFGT8lgvNuAAVDA1igVYYGCgL0IuCx3OPBLnLkVzHLQNpJD8kjs2sllFGsWJYmAQNgz0BtotisgYGqiASufAB9Q4oCYTR703JK9k0gyTjgzzUtgobHMy3qTyatY_BgCA1nECg4wAVgABmJOACC-JropgNrcCgTQfNCisKAm0a4PG25gCDfUDxS86hsxM7ruMmK4vul7JrClLcBOkS4K6gSMIoHK5Dy60UpM8sAc6xhVBGSRryYZ8KCoz8dgxeZYCoBtSPQd84G00QgLgejKPfQo-QFJoHmyIo4F6MhzEKDATAwCBfDAHh8HEcpFoodg4EQCwrHYCAUEjMgKWsCXSEUCxrgAJkwwm2FhlglMJ1n2c5hmmfMew4HILZaYxUnycYqjCjADAoHMYndL67VcBkvT-qtUbzhK1ZXvxpl2WWChGIKMN2OoTi9yNXATW2Nj8Yk3AOS5DZ-JRH3cJVR2tB0fRDGMMxLDTbojZcNwqBoRBXHIHw_HhZJCgiaI4gSAJknVpp6YmdhG-KZuyjYSprHYDv4bIBcERQYeI9iBR8EifVKHQXLqvqkxxhsLYRN0AwjFMPMqhjGo6gQZBq_cSukBikhMCgWIwckNTVDAcgKAAWltxRoEkAQ2DBKAkLB3wNiCUAo2DVTGLgCAdtqq_mZm_PMckmi6T-OCTGmtJRvz5BgZmL8Y4CEiDYWQwCHY5w1ATWQtlfB1hyvIWQb9SBQGGELGAAhGHMNIWQFB1kqENmojQvonE345WwkoAQzx2COCYMbWKcgmCxQWhQNYXBJDILHhQmyvEGxyD0IwDRvDGToKYOwcCEFxGrUkWosgO8OAYEpLtI25Ay6vw8LQOsbA4D4CgewXg_AjFiBAMufofi2AmBgGgExlI37zGuAg2QSFcDgIeGwM80A5AhJAGEiJdiKQqFEromYbB5gyG1NeCA8A_HqVYCACe7ckDVOGFQHweSWD6FUEUmA1wAAiMASnzDKRU-pVS2AAAFMBOgsKQLgGTGnwCTAUs4KSsA4DfoCcCsgZlejmUkjESynRv04Nwd-tSlCbKafM5JrhYA4LflkyJFIDlQEiGsVYZztkgAWaINgJ9VkUQ2fUtgszmkfMuYtRQUBbnhPuY855ryAUgCBRc3ZgSj4wF-esxJ8LEU7MWZkqFOS3nAs-QEu5OSGGxUJUi3FpKokxLibgBJlKWlwy4bnAwcC5A5UcLUcgkAmIOCcWfcuriq7uPjDARQ7BZkZLIG0GAeT1Q2JpRSHlZA-WlyFS4y-9MTGGNCE3UosRhy6vEMOVIWQa6-BBBQcFbp8WUgAApPJecwfVfdDXDjBRC5VMKXVmotczahTAADC1yyB2uyY651qxOq9xKHEYcQxnJkEhZGh5UrYVkH9RqVo7ROjdF6P0HkRjc2sKYMOGJOASDsEXhQYcnyYkXhIFAAQw5Ol2wQf6AgaKSrsHraoDwuAf7lsqHvQuuALDF25Q4ftMx_SCyjAIKpkBYC3TLcOM8cxOgzuJcYr04gBAmpQFwGRSFYgtRalcI4VVy1jrzPW8tP463mvyeJeAzakJLoeJKagcAIA1wEIIYcRsH3AYcI4YcGhX0zAzS64WQgHhrxDWGiN9ynWZq2LupD1rbX2opOhl15Vg4UFgK2uEbcgg9NaMOLqqg1CfNzR0MtVT-T5EA9KKpZxzkCAsPQegRtHAhgACQWF3WcZsrbxkrLWZxYc0o2mjU4yTOZPG-O1HqCJsTogJMIYuqIJTooZOyFbT8dFsmkoKbggZx4RncCtp-bZ2dT1q3BwA_4oajG2N8LAXpnSFnjxQdFMDdQaoyG6E0JoIAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0aMQWeGCE9DACAEIweALARgICTIRcMIgCVmj-AOaGTHEUhBlQ_smpFOlMWbEC3PkwAPoArmhQKWmZ2QC-vkww1KaCcjBB9VCC9FBi4gCCpAI9rExy4lryimQASmwDaADCirzdLNGVxOkAboSskhADAOJokRSZ4gC8yoRQuNlxJxDnl_W4NAAOUSoVeGh8OQEPz-oQgcAAMhhCHJMhEoq8gh8YF9oWcLqEUJE0HAUpM0GhCFIADzotAAPgErwA2gBdbKVe4LPB3B5PAAUAEojlC4vcKI0cvzKnE4tTUad6TLZXKJABGARjCYgpLPYCuWxkCQwKBQDDtekACRNZuUqgElpkKy4AEJqfh1UrRSqBNTCJJ7mBnhoAMQaATMMYQegAaz1QqZjP5FAk8KN1xgvJgj3KLwEpXqMEFFqBc3dhC9Pt9-AVldlgtxnSYnM2eB1MAAYnwuAmYt7xZKBNLvXLa8qVdTxkSoHWq3EAOoSC5VcRSDCNeKggD8vv8xHqgmssmDIFY1Ao4ZQ_lR5T1zJT8IANI4QAC26CNKz2gJ8LOfe6pxNP8VWAB84DIN9gVBAQADIYKHcd_zHEc53lX5gLnOIAE11wAcnueJsFEX00mYDJ6WWHRFCsQh3VI8pGVA1NwMg9sm0wica3QxCq2pFADwoZgIyYKNY3jYVnkZMCyAybM6TgIVv1ROBCBQWA5D1aT4SRFE0WJC0eLnS1CFOUJ_SJPBDM4_iKEEpgMM45DMOLQymLTbTkRvDI6QEHcNB0ryyCC8MUmkrktjpBF4QoRTEPdJz60bLoxVbNBIui3tlQgMAhxdaSLJJMhYHKFNhT7KsBzQJhcTiJtlUqqU4ryNTQi1Lx2z1A13AKqKrAMlC5RTGAUQc2VqVKUaJxTH9JrGlN6Xbd15qsuaJHpAAVfJCm6Ja1pWpaGUM3bhrkUbxpQDA5CkWa3PAgrwK4Eh-X5YBNySZ88gKIpn2qWSGiaAR2gkxiVpSiUqoQgbUIm0H_woU7qW4DJJBgCAMgkCg9QAVgABm_OA0HoPVfrqRooG_X8ltO2GptO4AEiSdoqdm3j4fpUCtqKJn8DZmnqxhqGVQbFagfY1CeYuq6MKW1TYD_YWoTqqExCkESBFkih5My70tMRTy9IxfM0ELDlvUYJgrAEe44H2XAmVELBCAgQQwGzegJGlTRbOIUl8CIYgIDIfcmBjEhA8YLh8FOAAmfB7o0BWVXy4k80IR3nat-BbZgMgACs4GYIVTaT5iyA83Tyh8zF3k-SolZS7k0G1lUGsh3jHv8dnpNTW57mzJ5fPzUvwvfJIuzQHthVC4fUqzHMMgU4t3Q7-zlUTwGjCbEB2kfEB0GwQF8GvHpKAQZAQHN-YKA4Ew-EEEQxEkJ0qKUex1E0Z_dEhW-zGmYg7QcE4f2xBIRGEoroMgJBZALH5Aoeg9QkgsDIJLKQz5uhYAEH_IUCtt6733jgPALhrCGk8GfBgzAr4cEQAUDAKB3j8hQWVSoYAKEAFoghcGgFIFIGhrRQFMo8eg_pSyFg0M-ckEB3jPhUhbVhgJsodC6EaG0GARS5DmKw0ohALYsInikeopA8BCNrkwJWyDiS9UEOVAQF0dB4FYYwU0JBcApEceMH2OJN5KJ6tFI2aibF8C2Kwi6tlFApDVMQagqQMCFDkAIQo6MKAZHuFIRRzYmDmLwJY_MchHxGEyWgbJ01rHEBRF5cJONIlpNwSAGhdCoBkDkKfOgF8KFsGvogEAAwtQES4JdYYoQNBCA8F4CETAamlNjDUPOBdxnn0vu0jg1iNAMxgBoHhtTsxyLyPwGAchWH-Gdpo7wIA8lQg0HAeg6RiBUHWf4uIFydkXiQC-LAMAUCTJjKwgYpw5F4FMmgMRyoND8WgHIO5Gg3kfOCDGMZtUzkPK6TAaBAwRIQHgHc6xiLwGKAhSAaOZA1RkBxnCwGCKXw_IACLItbGijFLysUvjGMNJgrCoWfNYcQKA9QMj-DxeMVgVggXeg0KQ1hZoUSWReRoAV8BnnkuxRQLgUA2XvI5VynlfLpUgFlUK05wKQBdXFZ5KVGzdXyoNVQY1krAXavNcKlUGgjzwCuRAG5_KCR6oVa8tVMKPWCotSKkA7KYUOMKP6uVDrZSQt9bGb5MBfmAgBRGvVddN41JkXIC61APDMEgBkGZzAWkLPYJ05Zp4YA8FlXipgl01kgC8eMnep5Ll5rRoWuZ5CAilpAOWiOAdYBoAAPI3IgMwE5KRGUXPXITGAABZEgdyCwwG9TKiAKA7nMkQhoeAAA2KNjqum4obd6Vkq6QD52oHi-4wRA2HsvR2W9fApB4pxVwGZV79VBtaPQZ5oVjZrMVum5tIbYy5qYPmmZxa2k9vNpbUp01Xj3AAI71AgPcfkuEEMSFwoKIwcHBCWiVVAecsaYwAAVuW8pyEhmAqH0MwEwxjZVqroVxo1dR3D-Hx1WIENsWA2jSNsYo1R_wgN7YobQxh3CzLtGsfVaJpgXH0l9LkAMsgPQ-h5msap4ouEfkmgwMQRBFBcLkp-YJGJKRcIJveHImdIRWGPWIGZyo7S0DcIELhZw-DD7HxzVQVzUJ1wUH3BQSdypIDFVBNZ_iCxYAzKCyqbDKRsNkGtjE0y_Jai1FRFVUEz5cK-bwGZrzylTN4cVuSjL_DiiMrmGwOAY6LYpGZN5_OpXvOBcK6faguFWR13JRx_wpIBBbu9OgvjAmmBCc-ZRzVTAhTesm0R5Vs2YXzeoy9R4FBYDWcdNoXQAhqV9NwkDSoZ7KiqYGRF_sAzRvjarIypOcqUj4DUGoXrW4AAk-BvUqjfLdji8STVoGs1aiVWxcKGTFiqHeiFnuygDW9j7Iy4C_f-7KQHY2VqI6rJDvA1mjUE7QNDwWZLcewxJ9ZsVJOkvA4jKO8dQOGdxGu7Yf9ojye1RFoZAbKFYcCH5zz0xRht7tHaEAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtN3ApMpM-SUmAF4mLgBHAFcILgAKCWlZBWUQAEoAbkZvXx9JWDgQsJgomJh4kBQLXPyUfDg-NMyybKYAIRhZABkIH0KI6Li2Svaunoo2DMZGRRI5SNgUGEd2ElxeQvwoDHqmAEEbJgZmJmzcSPwKVaZY1MPVFgpxHvQO3G7e0LIYEzbX94obk0WNoyKouGQ5LIAHIYRQwABiq0UNzuxxYXAokVwzHiaNEAB45BAAG4APnuohY-K22Cg5LxlJYAHVxBhfD0mJISFimGRYTAAPxMfEQMjsSK-CiJYJsKiOcYgJhoUVEsgAcxlIEez0i5lwMLhbCYFnpjIJFhpOFNZsO2rgKF10P5TAAZC7rhSzYSSdabaIAJrcgDkXF5piYGGFPmM6tJ_iSSh8GHxVQoMbVpNtT3tjv1_JBfqpFiJZM9olSBZtwDtDr1BpgrvdNewox8lcpKZLvqYk2OILB1EhuAA4lweKK1XAUUdKRisTiy97SwyCeIAIwnLb1YLAarwFDiHBQEiaUkACSPJCYYGMiiYZ8SgUUAEIU-vux3I-IuGBNQBiI1yE2CB8AAax3FFgkzWIayeSFRw6CgJwKUI00iGAK1JKElgoFMMA_YVix9Cle2BKZjnBIdpwpOdsQ9Fd8UUDBRVJatswPCB4LHJD1QKIUa0op04URXBkVuAQBMHWQEPHXibk0FMmJYkigSYEEQV0AwjFMPULBGN4xnsJwXDcKgaEQVxyF6eMnz6YoBjKBIAmSCYmhaPcUKKEpBgqVM8n3OoGl7aZZnmGBFmWVZ1lCTZtgKfT_lRVRtkkZomDVHh9KnW4Z1ESFYCoJhm1eOBVIediek6EgMFVNV9MKNCYCaCkWi4OAVjIcxCgwExmN8MAeHwcRynECgKHYOBEAsKx2AgFBxTIUDrDm0hFAsYkACYLBbXAgrKor2J2zyer6op2qs8KHHIQFyMpGtKuq2r6tCMAMCgcxVP7CipNwAAVLBYGovEIDAa5itkOAcrLWiFxXKkuzLDsKABhtYu3XcpRqHb_lPRHGXxR4YBqgi_QJ3AScLAnxGNCnSceLD-RTem8bp8RSX-tUoFFGAmbZln8YsNNafNQnif5qkKDQWZJGFyk2OeI6UCY9hYliYA-ThPQiowTnua1iAmIygB9LEoE0W4oNRQsbRh-jrbp8nxcpig5Fl-2RUUNU_BgCA1VGzUAFYAAYjTgAgdwNnWYBN3AzZpp3ScF12E5tAnXfV_MmeTuH7Yl9Pkd1r4FKTt2vUFx2c79VIU_N9tKcFqW5Bl_mmZRinO2IldSNESsvvRH6gcpEGwYquAqpqid9KhldbaXUlx9qlAl475dKU0JgcC63LZx4ec7dThHK-FNAJUuZggK5sCIItzMawyigsvkpgiTgFG5B3e6x8eyfXlPM8MGJA2SMO0UwnzGuQYW8t7SCT-ijeSeMV4EW7mRPsWgdD6EMMYMwlgVRLCMiZcgZlPAWRaDZZIdlvKORAGQpQrkshWV8PsdgFCHLlEqNYdgdDQRkBoYoFAHDByxAUPgSIcJKDoGllrL4PwmE3F7JpTBOlLAeVqPUAh7hzJIE5iQTAUBYiN0kNPFgYBCEAFpXqKGgJIAQbALxQEAUhfAkZsLoTYFrXYuAIBvS1q_Tqpi9QgyaF9A8l4rZFRwqYtMGBOomNEgISINhZBOI-mg7hLxWy-FylLeQshTGkCgFsCaMABD5MKSksgwTsZjCKrgMJ2ShymKluAxQAg1zsEcEwOAJAuZyCYFzP2FA1RcEkEE8i6SDK9BdnoRg4zEqPDCewGqtVWlB3aaMsgCjFlgSjkZcg6iiG0FymwOA-BPHsF4PwMJYgQBJjWJctgJgYBoC2aBUxkJiT-NkIA3AbiKRsBPtAOQ9yQCPOeRgMCKg-zTOOGwSEMgITUHwBAeAlzt6sGoY-FySB0VbCoD4SFwJoXXPeQAERgPCyEzRkUNAEGitgAABTAtILCkC4MC3F8AFREtEP8rAOBTHHhqrIdlbJOW_LxLy2kpjODcAoKY3hIq8Vcr-a4WA0TTGgpedKqAkQ1SikVWKkA3LrmBQFY9YV2K2AcvxUalVo1FBQA1U8rV7AdV6tBJakA1rlUSpuZjGAZqhU_M9d68VlIHnOvBaBA1NrjXos1VGvJXMY0-vDSCyNYE3kwA-Xqb5KaCVqVSQo3xcgpaOFqOQSAapdkbOQJZDRxC6CqFlDARQrrRXArILMGAkKNIYITWBCtZAq34LraZDwXgGFMEWfM0I_RSixCDDO8QQZq7NCnWeCgDqmQZtAgABTdaKFhC6gz2sdQO15rrdWilXfQzqmSmAAGE1VkB3WCsCB7r3MHXnO-yJ7NhEzIE699l7D1kFvdwmYcwFhLBWGsTyuUoPFKYEGd5OASDsDERQIM3L3mXG6QIIM2a3r-O5AQANyscOqA8LgaxKHKjaWwbgCwuDy0OCo8cbk40JS0opJAWAGtkNBhPhCBY7G43LoEMulAbVumANiEbI2RJsT8i1sJrBeocMoZfthtdhKBxdPschtFOFqBwAgFZAQgggxGS0zZhwjggwaChaoK97rJpCApNIp9L630vM_e6m4cbvObu3bugLoo1ZIQoLAQjD5nJBDJTMIM5tVBqG5VBsKvG8RnHyFZssaK7qcoEBYeg9AjKOAFAAEgsHGykjpCNMv5YKocQYyz6AK3jJVJWyuqLgDVurogGueaPoVm0LXZCEb3IG1r_MOujadhN3AhHTVLY47nDDSFLNXPtplvLNTXFHxQdbOulJnNmjrudwtFT0GaE0EAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0ZN9BAEIweAAyEFbKqo4gzkGh4RQ-TEYw1KaCcjBghACuUIL0UGLiAIKkAqmsTHLiWvKKZABKbJloAMKKvExsgsBGAgLEaBAAboSskhCZAOJowRQQTADm4gC8yoRQuIZMA0Oj4zACObhoAHKEXEfrGkl7w2MTKMFoYRHr3VgCca8JABQASh2_QEc2qeFm80WK0BAj6uwGoJgFByaF2fxBiIEAB45KMAHyYrE4iQARgEhWKFyuq2ArlsZAkMCgUAwAF98QAJZmsyIOTkyepcACE2PwZMJCOJOMIkjmYFWGgAxBoBMxChB6ABrWmw1b4gR_CgScKMqYwSHI6FrAQUNA5GAAjlE6VnSouxFiwiS6VivEjH2IoEgtlGEFg1rUmAAMT4XFh8KxcxRaMNHtxBI9A2xRWeUED0oGAHUJOMBOEBFIMKiBExLjAAPw4xbEHKCayyRUgVjURIgAQoRZ45a0gDaxvCABpoic8FGNABdNkCfAF4li3PMtdY4ATuBkWfnesCABkJ7TUsLGYDWeJAE1qwByOa17CiHFWTDLfF1HSKKyEGKn7MEsBq7ia-6HlGoaXr6-D-tuQYwYWcJ7gepxRqe55oc88RWMh67wZml7BgiMHhi0eAJkSyaoui6ZcIQiz4uBpomjMcxWss4hNmhEZzvWsZoPGAICIgtoQWQ_FoJaCzcYCbJioxzFEqRAwwTBIBspOIDoNgpz4D8bwUJQNB0CAjAsD0HB-GYIhiJIgp_ko9jqJoTm6EktmCPZljWLYfJuc49LuJ43ggMCxhWWg2T0EcPxwiCdZXOJn7QjsAwUIQSxQIsMCpXa6Ugtw2UwAA-qiUAFcMyw7OR3RpP4AiZNkeQFEUXjfC8xkVL2LS1B5DTNOC7SdMwPSJQi-yPEc4QhBghDDksCXrNkWwwBlgwPIcA4vHA4klGgaCEFI2I_Aa6yjgukUDNJ1GXhAYCGmhc0LUtPyiYmxK0am174vNi3QmQwN-gSm3qRU62TdKP30bBnoIbe2YoG2FDMGqTAatquqifqEmmksyI_HACnNeEhAoLAci0i9cAA-9LzOvD0qcoQIxHLKuFoEjOL4CjFBo0wiE7nxlFoAAKhTsAKbeoM3vDamIgR9X3AcEzSZLlMwPdWKPYawo4XtZCwMsxqfR6sPgwIKuIrDF6-llWsUh1cBRrSIX7lzxlMyh2LGjAi3C56dpB1ifsSCuofBxI-JRmKxpR9mCeSzleXxzHPPx2gQfpwHcg5xQKAYHIUhR6xntG4xxB_H8wC1vW05Zan3TTiVhMVWgUDW7jYE87dyJ0fbKHriHfcj_nY--twSySDAEBLBIFC0gArAADMucBoPQtJt-VlXLquk-evgFAT8zw9-_nwDJTAikn2fw9XqfLFN7l3R38_R9Z4nAiKyhbJOllifIuJdELxyljANcisbbTR2mIKQmMBCEwoMTHWiJab02hCtW09oNphkvJZCIcw4BdFwAIdYhAsBMUEGAZE9AJAYk0ALYg-18BEGIBAMgrYmBahIJwxgXB8AjAAEx8z2hoP--MK54BtJQ6hSISHMFwGQAAVnAZggIbroMkq9QGyxsFrW2CGIwmltK6UwDgPA-AhypFMuZSyVQKA2R4E1XyjltC6ECtEX8nkIq-BcWYMoxAvFOHYcQJIRgfENBILIaofwFD0ByFcFgZAQFSGnJ8AQQTASkS0jpPSliCAew8F4exzBHEcEQDlDAKBNh_DSebBEYBykAFpshcGgFIcSGhuRQHZgsegso3QOg0NOQ6EBNjTjgIQJgcAWmnEenVfBjIeQYGhraSoLS7QzLgM04S4kcikDwIMoxTB6qpO6gkdZRcdB4BaYwFkJBcDiQeUUFheCznLK9lcu01y-CtBaUXAWihxKkmINQAQ6jcpyAELlBeFAlhzCkEs5ITALl4XbHIScRh0W_AiMadZxBFpLVBavcFKK8kgGqbUqAZA5B2OQBZcp1lEAgEyJSF8XBi55COBoIQJTwpGEpUS7UpVVHqKYGUqy7BWVfQ0DfDQ3SqXInmVlfgMA5AtMWBACgWzwrYoRBoOA9BhjECoIq9ZAwjVqr7EqrAMAUAiq1C0zIIx5l4HZtzEABqsQaBRtAOQFqND2sdYQbUtwyI-uiJkWJmRMYQHgBar6Vr3IeMUEGkAwiyCkjIKvCN6ko0aFdQAERgLGtg9AE3hXEsm6IhQA5MBaSGp1LTiBQByEsRYGaiisCsKMokGgwotNZItPA3bDh9u9QOphXAoBNodS2ttHau1IGiD2-AfYo0ppCsOt6Y7V0aHXZOrd0QqC7tHV6pVR7N3To7PAE1EAzXjt7Tey8waF1hq1M-jd_a30gGbZ--5uVv3HunQB7ULqYButOJ6kDfZjFnMpdM6oRdqAeGYJAJY4rmBSoqbKkEGhWA8HXRmpgxcYARtMTpKgllMPYclYyhxLKQByqZTwaAeAADyZqIBKKTdO9RqI4oAFkSAWrtA6E9h6IAoAtaOD0Gh4AADZf3SiLemkARIFxSZAGo6gGa5hhtfb63TNBoxGb4FIDNUSuDiv01Ov9aV6C2pwSMsiJjKXga1OhpgdG1G4eY4QwQRKCXrDmAARxyBAOYfxHwhYkI-AERggsCE5BQWdRYP3agAArts7bsMLMBIvRe1o-Res752hog0u_LiXktKN6AINosAZmZaq1qXLy7djLkK8VmLj560zMq4uvLiw6uoq5XIHlZBUjpBtF9Sb-UBCPldcyDAxBkkUEfFG11aMMBVWW1BzY8zqxbxgC0qu22QQ9DQF05bzgCkGRsWhqgV2ETVgoK2CgNaiSQBNvWcSj4UbVFgOKt7WJ4viXi1JeA-32Z_DKmVPEaIG7Lce3gbby28RWHGwWiiUL2Y_cvJUNgcBeOzPEqOR8YPpzU9e7T0y1BHwLhDFGmrix9oCHk5eTJzWG1tadZ1_LgIT2ZLSxlrLHXRtMFrgsCgsBAcCjTUoUtXLHwAJBNpkEk2eVE6TDyzn3PpS1qxC-8S-A1BqEZw2AAJPgE9WJZx6-HiO1ogOz2u4x7eAiWJtIehN-gjd5vLcCrtw7xETuuc8wD9KT3aBAc7rj4-Hmfvz4DBj8SOPgOh1J_D9KdbCwlHO8fgMHXthxISYo2npWKfbws_hj7gQ9f1ImKFWydvQA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

Next, let's define what the top level path `/` is going to render:

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
const styles = require('./styles.css');
const Beer = require("./Beer");

module.exports = class BeerList {
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
const routes = require("./routes");

module.exports = class Beer {
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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZsAFgE92MXABMSAWzYimAXUYBfRiE0AaEGlwkA7nFkB6DO3YoAVnAAeREKUrUKtN3ApMpM-SUmAF4mLgBHAFcILgAKCWlZBWUQAEoAbkZvXx9JWDgQsJgomJh4kBQLXPyUfDg-NMyybKYAIRhZABkIH0KI6Li2Svaunoo2VKzyXuNIqgLQ_tLyytn5iabGRRI5SNgUGEd2ElxeQvwoDHqmAEEbJgZmJmzcSPwKE6ZY1IfVFgpxD10B1cN1eqEyDATG0QWCKN9VNoyKo1vBvr8niwuBRIrhmMJMaJUXAUOIlGVHqIqUUyHJZAJ0cEAHwY6nU7G45gAoGAukAcS4PAgZAA5gUAPxMbkkri02QAOQwihgADETop0QJpShZXTcAKOhRhWKEYSqUi2ZpUno_qJtdhRj5bRonkiUdQ9Z0MJISHNYm4qJQfpSiTxOUwADyKDDCpnAAMeTQRizR2OIxjuuW4RXKtW4DXB20cvFfW0sCNyCAANyZZdEEcu2CgtbN1IA6uIML4ekwfbimGQlTBJRHhew5lLEsE2FRHOMQEw0MLK6LpyBtZFzNmh2wmcmx3MW2zyxZGzgj8eQ8epYCSZuFUOmAAyJ-Rys1gCavoA5FwB6YmAwSMfGMUUmX8JIlB8DBkxA8gRRZYANy3HMYCTCx3wvS06xYJDbxQe9t2VZ9XwjIDxC4MBgmAYlgVkEkKJgMBvk0JkAAkMCrGBAMXEFkwwJkLWpZNMNtSZXQzJ5dVkA0hVFOB0SvIocRLeJWwrassOE8QAEZnkuepqOqeBSRwKASFYtizJIJgwGMRQmDYxJAkUABCZNdK0qkyL8Si1wAYjYJhyAuCB8AAa2oxkWVibVeRgWSjXkwoKFeGBUlYnDRHlQ5xlbE8BLrETNLEpoWCRJFdAMIxTC3CwRlwewnBcBMaEQVxpl8CCXL6YoBjKBIAmSDYpjIGZfXmXqSkGCoLGJEbkTIbZdn2Q5jlOBZ9KuAoGtZZ5Oted4TliB1QTGQtCXtWExkKU64TKpg3SeEUeF42QAEk5EUoswxLeVIkUbBcFi_DTs-gAFDBcCVDJ00WrEJrRC6qWLfE61o07YiUqlyHMjA5AEK5JGaL4fmZPbryu2RCjIPYoE2fLRAgMAvips6fDo3A4GR687VBkEUv5x0KE5klIFpNTeepU6QhZU6UAgOQQmCUI2c-rKqVhxnyqYHBzAp3mWi4OBjjG7jQgwEwY18MAeHwcRJal0QAANxAoCh2DgRALCsdgIBQccyHC6x_dIRQLCrAAmCxTrgCwABI8KBMG5E0Z2NdELWnZvZOBdCWJLetooTemGAmvIb5UkEAAGNQHuvITLRtRml1pY0vYNtlFYEQRpT0VhDBBCGoaVNgXQb5vr2k3AGTJxCM9R0ttfrTDgFctmmElNhOhIfHjRQA-gq1fDp4AYVxWUKAaljiprDOs-PRvRCtZ0HqerEPVkc_cEv6-eY_lSzBRyKBFEwOABBqJswVtGF6AB9XEUBNB-BgBAEUbtqIABZq7VyQRYJkb8tBNCqoYYwZhLANThE1ZwyAOruDarQ3o3VkhTX6uUJhSgFpG0RptJYM1VjcM4Z1MBFA8jwBYcsb8lRjIkjqHAb8WsWi7UWH1ZYQx6oggWlsHYewy5rROGcUIFxtowmFntF4bwPjA3_jnEkcAyQmCUQOKEJjgbSgfu_MI3DvqEkXgSNkGMQQKWxqIXGu8CaATgMTfApNZad2pMzL468hZc2sdeI28BTb6wtlbCANs7YOwkO7T23tfb-0DsHP2tQlAR2jrHBa2c2abULrk4umSy4OArg_BuWV9BZWnrPWJwSUa_SAavJJud6KbwHjvPeooD4oCPjYnUn9cAABUsCwBvhhTS9dqRP3KtaOs2o7GmAaq_OGmY9TrLQJs6xi9HbeVEozCMFANncSMYZYA0jOZwkysvF54gYD4y8seF5uAQXXgBUwPBGdvIAiZKhZM8LYX1nheskUUBhQwCReICFoKATQrxd5CwqUiWRhJYC4FGcXloB2JIMluFGkoGjOwWIWMmCK37oOZU_dXkYqxf3CAMCYDwNwFAR6c84lTxGUvbOcLwUorZC8uQDLebANAYC1B6C2AAFZq5BXAfgaiQqMBwIQbg1VSqSUqsVcJCgKrgDcrQkim1y9IX2rjHyzFkJ0IettXC11crQXkT8jRbhnNSSUXZYrCVrETkmH4pa4S1qk0nlJbarpvMrT7OTRQWlch6VZSRW8kFt8tLuMITofQJDaqWGXIcJqLVyCBk8O1Fo7CHLKOmgNEAHbBFjV8KiXA4iZodrmojXA_beh3HYCOntlRrDsE0WQDtKBF0eliAofAAMPDoDpVy5xM7vj92AJ4uY1MrREOrTVMhuBx3npJA4JtdDW0MMHROudbDnLJHvVQSdjRJLLR0QcI4-jNohjJMqAQQ6dSI3KBYCYk83pc2gxO2D574N1LSEh06qHz2NVRJhwJFhECKwmJWsgxCb11W-bI59LbaCIAxSQTAUATp0p5mAZtABaMASpoCSAEGwKyUAuJGnwEBHKkQYBsH7jcXAEAMBQH7nADAY1uNbmZk0J6pkoDmT2rOCg3HUpqbgFx_MAhIg2FkBJ8w2nJI_JuiGWl8hZDcdIHp6w5gBAecuJ7GA9nFqOd6KlPaLm9Tcdpe7JQAgdLsEcGAkgmKlaYrQRQEUXBJCBcYMF3w9rm65ZvHtdg-MVwili9XeLgXiElYiqa9pcByD0Y8LQEMbA4D4AU-wXg_ADbtdeacXrbATAwDQLV8K3G6RVg07ILi_6kNiEMNEKAcghsgBG2NjAEUVCuiQ2wOkMg5TNAgPAXrSlBqQRSEJkAlx5jzkRHtkAU2AAiMBDt0mO6dpAfWQAAAFMBNgsKQLga3bvwHnAtgeAOcDcbxnqUHXZweydtGwaHUBuOcG4EZvt322Bg6dCASHbALhArINxjb42MdQEiCKYUCO7vI8JMT-osOwmyHp0jwnKPe0UEUOjinW2JvsGp7T5EuObuI4J0TkAxlWf43Z-L_HEPucC-24ryXyumfrdG5T0KHOpcq514LybMBptbjm_r-7EkyCVWrap2ktLHBVLIJAEU5dKM0Naq-tr64YCKGF4jtbZAdgyZAFoKtBhVfhWd67xtnvm0tbbUIkrBKu2sO_Cn8Q8jRq9DYrzqAbYjcRXBiL4Un7vxuz5-TovQvS9kGz80IRp7T6wDU4Xzbxe6-PXLyTtT1eO-15p8KBvWiVq6NAxtQoIZlowAEN-KbOASDsGVJQb8SGpsfCS3P03SmNO-gIDAbjLK1-qA8LgQTTBJEx1IXVetTuHAn6eBNccFABBKUgLAJ1c-0CRFpPsB_kOmeAgmeyyjWomZQsCsClYeIQ4_c341Gsga-l-lYPgDe5USGxsSWXEb-touU1AcAEA0wPckiABl-VC3448j0SGwuQ-Y0PctokI0ILepO7e42JetBx6DBzieefOrBgu7BouWMRoFAsAc-TkQ0QQr22w34L8TwagSGQGohBsrw-Q9BrYQyUo4OAgCG9AVC4o8cFgkOVI943-WAMOcOiBdYvS6hWUd22h9AuhsiBhRhogJhQgGcGhVIFhM8l-su3h34Gc1hUsnhog3hc-sicueoj-2cS-RoRBUqx4ih8AWoaUKKOa5oWUlBGRhIlBFUVamgmgQAA" target="_blank" rel="noopener noreferrer">Run this example</a>

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

<a href="https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKARgJwPYHc4zQegEMAHYgOgBc4APJUAYwwDsKYWkQIBbYjNCgAQAqAYTgCAFgE9ieACYYuAsJiUAdENNloFXDQG41Tbr37DR4uBSmxxKxQI1l8Vm_DL04cA0ZN9BAEIweAAyEFbKqo4gzkGh4RQ-xjz-ApgArqx2UU74GVlJRjDUpoJyMGCE6VCC9FBi4gCCpALFrExy4lryimQAShiZ8ADCirxMbILARgICxGgQAG6ErJIQ5QDiaMEUEEwA5uIAvMqEULiGTLPzSyswAum4aAByhFz3JxpJ1wvLqyjBNBhCInCZYARxIEJAAUAEpLjM0oMsnCBNMrrM0jAKOk0FcANqIzFIoZwMgSRQwaHo4nE7YdPCIASoo4APjRRNps22OLxAgoEnC5PWMC2Oz2hwEAH5-YKyfTyi83jAAGJ8LiopkCoUKvBi7ESuBwy5c2YAX055thABpLbKhQD4lZOQBdE0CC1MRG6oGEKTI6GMFiTJndHS9ABquhVaEI-3eLFhHIx3OxuKuAB4uIQ9qzgEH2hQzRn8Nnc-7Pd62Ir9bsDkakzTMTz08y7Rm5EtWXbZhmJABGAR1Bqvd5HYCuWzkmBQKAYM2sgASM7nkQci5kPS4AEISwPuynaRnCJJtmAjhoAMQaATMOoQegAa3HLPZ0O1ZMFm22BvrAhOFBoOkMCwguPaYs8bTgSWhAHlyJadoscGYvCiKVhiPqjqq6qok2qa8lc0LtohyHwfUAJQKRpoAOoSCsAjhAI_q4gITDKjKGZ7MQmT8puF4gKw1CJCAAgoHsnYHOO-Ifta0SPHgWEaC6ZoCPgVHEiW5EzupmLAB-ZDyUq7wCAAZCZbaHvBJHgcSACagwAOTbKx2CiAIGZWJgBysmGuhWIQJaecw-zsnpcoGU8WGeqamIIV24GgeBYVCoZWGmeZx6nhU475O4jpoJ-Z5wgui6EIs9wnvlMGstFR74NZh6oRinqeiAZrWiA6DYE8-CQpQNB0CABaTBwfhmCIYiSJu4ZKPY6iaNNuhJGNUwCAAkpCHprvNsSAsCwmXCtJJZNt0TOLl3ggAiEwlKk5SVNUtT1F4EKAsmPy3P8gJrXIAAKhCxlwUpMp5Erujcfz3PlwPrZC4O_HcomAnATKNGgsZSBmG2AuyJz4m6RiIkGnnpPQFB8NC-X7UywBI3gKMCGjGNY5C7Jmo2nL6flxx01CVhkNzFaExi-zYrzP24ZyLZ8s86RcACaDvuF-U_f9gNNeawvcsi8CS4e0sEnaF0C4C1Lgcwc6EHITJiFITD0MySZsu9MX2mS-X_g8DKQBMcjXa7DFgMyXPI2QsAHAKHOWaaId4J7scFWQPtyJTb3O_lZDrP-RwAcr31yBrrsqTOuAuwHxOCNscDjKXJyEFgOaCGA2L0BIRHRzFAAGEgUBQxAo_gRDEBAZDcUwj4kCPjBcPgiwAEz4Nz-AACTJe7-dmp3Nkoe6AcJ570L143WLV8wuBkAAVnAzBwrC-IAAwEx3mK1Vy7XgWJHSGjT2_rEy0lylkhoFWf0AZvCUuBd-z8fRMlfGXU0BsLIB17CRYA2594yg0CEDAVsJRkHwTeLU4UfTDFxPSCgkJipxSQtvQub87Ts1dELL0GFqx4FIejSYlCo50jTHyTiXB9gCDgGgeg44E6Z2zKLAA-riKAKkJAwAgPsHu44AAs9974qTUsw1q7VOqYBwHgXqe0Ej9VoMgIazBCyjRSONCwU1tC6FOhoXyihlp2MEBNSw1hbAuJiC4Xx7hPCXUOp4468B_HnR1qE3w4TNpzTOiYvAhQbqlAYsGNAlR6D3GxnHJsf9WJywVu6Ni7wQaATBoiCgcYoB7BgBUhYBx3TcDjDAWRaAoCNKqUwdCxR0n3SqDUIcz1xCQn2q0IS1YuiLV6AMUkowUgTBYC7biKA6kO25qjdGfoWY409vjeGn17hwApFgSETI4ZayHGfQCpNyaKx4ZiOA6RtDGk5uFU52BNqghgOCShH5C7oVmLbe2t4mCWxTk82YFcT41w-KIBuEAm4tzbq43u_dECD0nqPdI48cXT1ngvbmGg6FuxNvTT2R9kVwrPjAS-18mDvOatci6eteEEQEISaOxtuZm2gWwtAsCnahW3og9uyD3KoITmScO-wBTSnJT6AAKoQdZVIkxMiwTgiS-x8FkA0MWeq8Vn6zDJcSV-L8bR2n0l885gImFoWuRDRGKq1WwHZZiCAQdoToLzvTMObB5USGhc2PhTBd4emufhVsEqjw1PVSMkcypxyTjyqYqwYFn4ZgFDAK2OkNKAQLfGiQqli2FokKyLCJYBTltirW1V-w6kTBrZW7evYFVqW3jWtAxbW15rkH2igKAMByCkHWteFLE7ZmINCakDE5CyTKTAWSNSm31Nkq0mRciPQivgTFcV7b629qPYWwdp6jzcCEYo5RqjgAAFYtHCNEeOLd7S5HaLrfBfAFBz2mtNDmwdwBl1Gt_V--NQG13NpgKBv9kqz3gfgieCQZ4coxKneSIqtMs7swXHa6qF7ew_rg_Bnt4HzW0lw9BH9I6x06Rre6mAVEgVGD0R1LqRiCDiWKP1Qaw12CIE4OE7xjitz-LcXoK6cT0kidymgcTsyZ5yY8ek5oxAolD2IKkiTZASCyA6NCBQ9A5aTAFqOqQS6_mM1IHCWStM5O7suG1djhierGyoHx6xI1BNHVkzreTiTXGKbyP51J_S7oVCGVMREFJykRLQGQXKREQD4FJbaDEWz4uJZ1slxeyM0uInykyOT2Whi5aXogdYpLWNOf0RxnqaayQhM88GATSAm0YBQGcSm5mnlgGsQAWkqFwaAUgtUgGXFAcqux6AnkgsBDQsk0YQDOLJOAhAmBwAG08b1lx0LTlnBgF2gkKADcAhtuA_W0BcCZK87Qs2LiseFlOiZTYR06DwANxgs4SC4CZN9-o_cYB7ee1TBI_J5Nvb4IqAbI7e6KCZP2Yg1BhEYDqXIAQdSVEUH2NsKQIOWEvfB7-9LROIgKqbMQK2urEf32RwT5zIAOtdagGQOQvHLH8YoBwcow5nJcFHdUe4GghAeC8F8JgjOqdPjaQy5gLWbGCabBoZdGhxui1O_5fgMA5ADb2Mis7l10uzA0HAegCxiBUDV_A03NT-DW40FgGAKBpePgG-URY228DlTQItzkwD0jQDkA7kATuXeECfBL80xvojlH0-Ue2EB4DW7wtECTIe55kH7GQe-UePQx40B7gAIjAePbB6BJ8uj_Q8Gg6h5qYANsPruBvECgOkfYewQ_1CyMJGPJuhpeAG5ClJSBojd_gL3_3mgKBcCgI353zfW_t876PjQ4_nQgD79ENNQ-dUj_G-vyfNeBJbeH771fIBD9--P9YWQZuLfCQP3cDfW_HcL4j4-Lvz-j_Ejf-Hp8X2dSX-Pe1-v-oe7-ABHuXuaAPuwBE-eeLUjO62HQI61AHgzAkAeqV88unOXmbWyuAkMAPA4-IeTAo6MAEubGJ-QYmBcukuuBrW3OSuiIteYw0AeAAA8pbhAGfCnlPtfLiDkgALIkDW53IrpT51IoDW7cpcgaDwAABsoBtIhe7iIAror-IAV81AIe2wEeP-mIGg2hKo-hfAUgIeOm2hyh_eoMZMYhQEFBLKvSjOTeH-6BTAtBV8Cu3mVim2ggVOCqJw2wAAjoHtsNCA5AERIA5LCEYLCouDPlANRBAY-L9G3h3lcEETAKERAOEQ5D3LPvPv_m7kvhkTEXEbcmiAIMMLABtskcUWkcvlcCpFkTkXkXXhtkUYvukXsOUSwgLnIELmQOFvwDzE2AMQ0gIA5B7jOBgMQAmBQA5DHh7uTGjkyA5DAMsHPgIaIjAANjOksYiJMGgGNlMc4PVsYtxmgVQIcRiMiNxBQNXsSJAOHMqOsSgHinILAAyrccSFEUyFEYlvAGjuVNCNItIp2HiMqLJA5BcWgEsVMZ2FYH0dHlWNfFNpManm0GwHADwZtv_A5D8TCf1AiYSVQNQA5C6GhDHqUXsAzLIZiGCNUbUUwPUa7o0RkbZpyEyQkbPmyR_hyXsNSLsBQLAOsRuE4g4CXgLg5IwhiC6DHgMULk8c2ELvSXaKnsSD3kyKlmoOYlKMvPgFvsSPJCqTFGfusVQLvlbHgA5JAgwsafupiNqapGoHqSEoaY6bMKaVytvJqaaBaVMTvmfnaf-lAgHP6VyIGQ5CEtaYqL8cgnMbsGfGacgkqbYFqA4UepavQs_FSdHJavmZrL0kYG1GaGaEAA" target="_blank" rel="noopener noreferrer">Run this example</a>

<!-- tabs:end -->

When user navigates to the `/beers` page for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. Since the `onload` returns a promise, the UI will render again once the promise is resolved/rejected.

A similar `onload()` method is implemented on the `/beers/:id` page. Except, if we happen to navigate from the `/beers` page, it won't perform an ajax call, but instead draw from the list of beers fetched previously.

This is a pretty advanced setup as the app will only call the api once, no matter which page user happens to land on.

Speaking of `/beers/:id`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

?> Note how we use a custom `beerId` getter to coerce `:id` param into a number. That's because all url bindings produce string values.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
