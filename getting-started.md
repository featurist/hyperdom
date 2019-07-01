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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JMYBJ3DDZGk2OLcHAIORWWwAIwoAAM6pkDJAVgRr3yiqQbIAEio1JotExfDAtCQmAApCpa6UgLQYCxK8yWGx2THOsQgPVvGECBhpAMCoWevFlKBHb22ZJMSaTEiqMj--QgNAAV2g6mjpXw5Vz-fjEN9jl0aVM2qs6asZHwEHgrLDuTYmGwUEmnG4fI55u0nqgGCoAszAcHXJ0RrYo_HFGrLFrLqsEmtDeozdbRvbWZjxZ7ucssFwI7H8CXIDkq4DBJgSkBJA0IaEBjIhmxpkDBD-AOBNQGnOdhyTgawqXIGkPDpVwBRiM0ZyYQYmC4ABHPMuAACkURCLTYABKABuRg4PeYBligKASEMZDUJgDCIGwtgUHhCglFgOAUHwOAYWItYyFtdQc1gFAbHYF9eDo_BR14pgAEELiYfcuG9XAAHEuB4CxiTgLCCOUh4jjAJgsO8CgFAgLjLKsTSYG0shdIM_dci4Cgc1wZg9gOHZcnSBRlR6WS4EGCicGoww4mNcK7TAAFLVNTkLW8JZlV83JPG6BQuDAQYAHIAGI8qYcgZIgQlQv05C4iYCyrLsY4YDshzdLoihcBzGBIoAORsChGgwdL0gaW5fNonABkM8NRDcjyvPYOJuqBWrljIFB1saBajK_GsBJYVSrFwUznKM2bPPSN0LCG4A6q4g61Ga_JHL0gidoyhpLrINodp2nFf1-f4gRBMEEzAyC3FpFxyHg6cLTo9DMJgHD2Tw4cQH4ptofeRT2HhhjEeR1iQMIkiMzIWHtBQEDqHULDNHwHNOkodBUSUaQmDIGBAQUi59Ixv6fn_IGgIFDj4G43jweg2hEGJajMCgLDNiUE60jAKDJjAZloCUAQ2GiqBxXyfBul6zqZAUl4MCgdm4GqOB-TUCAwFJnbGDsGKppYKhrD5dr7fV3AtAEHMLjUE2Bld79DEMIA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVGD9MxwCqkMTKZGo8nsOAQGhY1EARjwAAYuTS6WJmA81l4WUhUbzqCixDxsOpWWJLjBtNYoOLJSBBesbtikRKUaiCRxiHKQH9tsEhhpFbpPlwKhV0ON6Kq9WJMAJoARjaagiE3R6LVdlXJdSo-UwYI7LdQKBB4KydXrUTpOo72AR0DxjWw6ATnWriCn4CshcaAMx4ACseDZwZRod1_LJABEI_RmNHY1quAmXSbAsEKm6NLB2FnsDmjSA6fW1QCYJ1jug012ANoAXXkinkP3V2wOR1OMHOE3G1000JMcPMCIgPHGS424i42DgXGTqfTPC4YCOX7E76PT8xAAbnkW97yJbs32CDAuEUb9f1RPB7gLWA4CkGQQNaRUII2ZgwGwIQNlYF9XwAQUmLhFThAhXwAtMMzwAAlNsjwAYQze9qDMbs6XGVZ-nHbgdGGGAAHFOHSdQUDgbEonQWAIlAtxdU4S12AkmApOoGSAAoAEpeN1FEIDALhdIAQmIET0JE5hNO0mTDJ7RNOGIAR2AlXS6UTFELDmVxfN8qw2SyNgZAAOQxGB8mAJooAwRQbAACRg9AEIzLhksLBieAsxo2UCoK9QsTIdE4MBRgAYlqGhWAgQFYoMrh8hsLhrIgWzRIcrwdNffJ2vYAQYCSiLqLibAiqC2YBimvV9OUxN4OCPIjKCtyPIlCxxhsCKTnappqDwY64h2xa9S3ENWhRNTmHYZqXK4DbPK4VIZWoGxgA69DbqPHrpLgAzFDiaV1Bsc7Lsunc9n3E4zguS1tFIC9YTMRhwIfLgnxfN8cs_DK_xAeigJAZSMcgijxgJpDYhPLCVOJxiTzbXT0woAQ0loPAOk6ZQuG444uEpgyFu3FRd32Q44aPFDOjQjCyGMVH4SQNAsFwXSeecukwFhCoCJ4aBOmxMRUqgckvAoTIxuGmkhdWXA-bgCJKTOUzlMu-RdDStb2uoql2Bd3X2B4bEBEmI8rbyD2xdUUgTEgFBwUhBRyEvNGER7MQqDvaAjwAeXWZlqC7R6xEhDyggAWQmVliCGmBaWM1EoAgTBWRXMR4AANjt_kMzENcm8TMQIU0Y1OH-Sdh97MeyinpdOmNRmeGT8eQBntUCVWChJ2xevhs31EjnQYgmwgUdRXL7ZazgzcxcURQgA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdRgF8Qh6SAhl1MAB4oFFLVCIhSlahVoAeAIQARAPIAwgAqAJoACgCiTPaOAHyMnrFQCcxMSTAY6qmi6RQQFLBx4RgEOEwAyhiWaCTWngD0-YUwOaKeWjwYTPgKpXA8ALxsAKrBAGIAtAAcbEwNbY0KmdmMcp616kptLJ7qEBJMEOrDIBjs7GxxjfsSqXK7cPi4EOwUTHAEp5_4DWi4JAA7gNcA0LFZbAArPgga4NJ4vN6LP4kLapJYOFKMExmdgYfAAawwAHMYChoeRnK4qDREHQ5GwyBhOvxWCBlKoNNpJqSKJM4BRSlR1JM0OCLMSYbI0mwJGo4BByKy2ABGFAABg1MgZICsCNe-SVSDZAAkVGpNFomL4YFoSEwAFIVbUykBaDAWZXmSw2OyYl1iED6t4wgQMNKBgVCr14spQI4-2zJJiTSYkVRkAPyEBoACu0HUMdK-HKeYLCYhfscujSph1VgzVjI-Ag8FZ4dybEw2Cgk043D5HIt2i9UAwVAFWcDQ65OmNbDHE4oNZYdddVgkNsb1BbbeNHezsZLvbzllguFH4_gy5AcjXgYJMCUgJIGlDQgMZEM2NMQYIfwBYE1Aac52HJOBrCpcgaQ8OlXAFGJzVnJhBiYLgAEd8y4AAKRQkMtNgAEoAG5GHg95gGWKAoBIQwULQmBMIgHC2BQeEKCUWA4BQfA4BhEi1jIO11FzWAUBsdhX14ej8DHPimAAQQuJgDy4H1cAAcS4HgJTgbDCJUh4jjAJhsO8CgFAgbjLKsLSYB0shJQMg9ci4Chc1wZg9gOHZcnSBQVR6OS4EGSicBoww4hNcL7TAAErTNTlLW8JYVV83JPG6BQuDAQYAHIAGI8qYchZIgQlQv0lC4iYCyrLsY4YDshzJXoihcFzGBIoAORsChGgwdL0gaW5fO_WtBJYNSrFwbrmRgcZXy0KqXOM0y6usxrmvyRy4Gcoypp4DyvNGg72jHHshtyAB1Pp3ispglBIDymCZToAH50gsdhc3eDjVFOKhrBvJgxUsCVAcs7jcxBOaWVhRpvt-q7hounAUeADaUBhtQ4ZgJgADICfSUbQmevKuFeoEmG6TwBQBRy4hnS0o0aenyGJGrMah7HYfmwwbh88a_OG06IyYYWJcmhj1JWoy3OO9J3QsIbufq6a1G23T9Ml3I1e4jXZvmxbcGWwjdeG5WyDacbxpxP9fn-IEQTBRNwKgtxaRccgEOZ7R6IwrCYFw9l8JHEABObH33iU9gA8YoOQ7Y0CiNIzMyD9rQUFA6h1GwzR8FzTpKHQVElGkV6YEBRSLn0yP7Z-ADneAgVOPgHi-I9mDaEQYkaMwKBsM2JR9rSMBoMmMBmWgJQBDYaKoDlfJ8G6XrOpkRSXgwKAK7gao4H5NQIDANPxsYOwYsMtIgb5dr9_H02BFzC41BXgZT8E9B7NwAAZKyKLkLUDQahJikGoucAYAgwFjnYO_Iwn9sBqD_ghdqV8WBAJmqKEgFAKDaAECqdg1gPgkCgMcJgpDiT2GJFwJQH905fyQf_Wq6hpQMN_kwiyaCmB4nUPsRy-D1SELoSYQwhggA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVTCXdQoOAVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFgqSBBpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREB441XG3EXGwcC4qfTmZ4XDAR1_MQvyZH8xAAbnkB8nyJPtP2CDAuEUP8ANRPB7iLWA4CkGRwNaZVoI2ZgwGwIQNlYd8PwAQUmLhlThAgP2AjMszwAAlTsmQAYSzJ9qDMPt6XGVZ-inbgdGGGAAHFOHSCk4GxKJ0FgCIIP1ISBlErgBDOAA5DEYGxAlVmoFBVPpThrXYaSYFkky4AACgASgE_UUQgMAuHsgBCYhxKw8TmGs2zKWc_tk04YgBHYKV7PpZMUQsOZXHi-KrA5LI2BkPS0nyYAmigDBFBsAAJeD0GQrMuGK4tmJ4LzGg5ZKUoNCxMh0TgwFGABiWoaFYCBAVypyuHyGwuF8iB_IkoKvDskbxvYAQYCKnS6LibAmpS2YBk2g1HNU5NdzDVoUQs5h2GymAylXHhhrCoYPPsiapsCmTZpClyUoiqKYri1Kkr-ra2EwYIbAAdRyDZJq4Tp0Cirh0TSAB-LgLHUcYBA2ItnVGOhNBnLgyQ0ClcvXZ7lFRbSmUusRNyQ-o4mB0HAfi4BnrwKmLv0rgADIedRpKAE04YAck4BGTjfVGjJoFAbCYn8jTiGWTLGtm_I53T9MUbb5iO5rUdiAHXL2g6DX1xCTq4M6mTuv7vuizyWdSOVqF25N1cmvAbast65Kci2Us9rCfcu672FuxzA5a2JZXUXb9rnHdWn3PYjxOM4LmtbRSGvWEzEYKDny4V930_GqfwqwCQAVrNcOoIuYOo8Yq9Qs9Jnr-Ra54PBz07ezMwoAQ0loPAOk6Cm-OOLhm6cxOFBUA99kODPTwJTpMOwshjHz-EkDQLBcHs8fQvpMBYQqYieGgTpsTEUqoEZLwKEyValtpGfVlwCm4AiKkzncqpI68hdBlU-uNOi1J2B_3PhHbEAhJhMhfnkIBe5F6kBMJAFA4JIQKHIDeAuCJ-xiCoI-aATIADy6xWTUF7PdMQkIopBAALITHZMQRaMA6QmzEFACAmB2TrjEPAAAbB_QUdcQCbm4cmMQEJNCmk4P8GcMiBzyLKMo1cnRTTdxwQokAqiNRGQGjObEHClqGNREcdAxBWwQAnOKBh2x6yW2oEdJQihFBAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeDA0jDxGQKkASNRwCDkVVsACMKAADG7LUY2HEmRjhg7bGwABIqNSaLRMQowLQkJgAKRmnocWgwVkdMTIcUS7STxl9mJsAgYRgc-smFHT7Em-GmVOz3KYnk8JFUZFzDjQpmg6kr1emne7oMz1JzIDkUStcVbcTI-Ag8FVxYGbEw2CgnnYZksZE8ThccDcHm8vmGKsDICgGCo-vbxlXOA3XBOuvVYe06cv14rIEMy5Ar81HRz0_eBv3HX9jDiCQo2nag5wXWwl3kfkpnXTtM1gXAPyvUCghYCcvRAQUYCUEl3HUQshBCMhwjISJonxQliTJNQVihdhxXiKVyBlHI5UyfUGlDQCmFOJguAARy7LgAApFGE8M2AASgAbkYASsX1JRYDgUTxJgKSIFktgUEZChtPgFB8DgGxVM-MgY3UUxYBQBJ2HcXg9PwS8bKYABBaEmCQrhh1wABxLgeCscw4BkpSguRLgKFMXBmDkkttgRf4BkGBQnQOHy4FOYAtJ0pIcCgEhQiaIMKtjMBiQjEMNXDfJXidbKBlyfYFC4MAIQAYkechvIgIViri0SmiYGSKAUCA4CSMEYAimAorIGK9KcUwYCU6rkRypgADkEgrDKurYzrBhWLLkTsoxaLkEK4lwI7lRga53C0SakJYJKUrSg7Blu87tkvNcroGAB1I4sQWpglBIFKmCVAIAH5BisdhTCxczVAhKh4m_Jg0FiaKCfmxbTHJN6zwZLGcch67wZwJnfsOpg5oWlBqbUWmYCYAAyQWgcOwFgSZsWssqJGAHIuBR0kmH2XJ9WJDamgA8My1WNXyHMabgC5qmafe0J4Ql0WOe-HGKHIJgRqgMbBQm-LTmm42UB1AAhNbcFivamCBOAsFgcEjcplAFoAGRIXpot9tR9tBjnRCDDAbWVkm_atsXCVt8hJe2G7LZTphaNTiPuZjuOgQ2xPcCYDG2Fj-ONpQDvHgET3nrUBvo4Wig4ornKLcRO61Ie-y_uoF7-8Hn7kQgMAZvyT3sFteL2Zn5LUsngZHoy_7UpmoGhlDgXvIwGzitKyyN9wAf9WT1OhjeXoi6GXAi4BOanh_wYc0mj81WEA3O2wgHlBFE7MgMBQEKE_msb-Vt4HvCZkMH4fxwFV0Wg_RaKZ2AyRksAFG71pCc2gVYGA5D_AihgAAfRSlAcubtDbgJ3gDU-ZcxZOAAV1CgHxuGp0xlocwDQYAQHMMkCEABWV0jx8TFVoaKRhuAoChH_uw0eaxBHCOtgIpowBUYwHNjovhEC-hG0obA0xBitEAiQQA-6ejQh7RQWsTBV1QEX2ys48u09lZwCULOJgPs_YBwShlOIsAqCc0jng_eohPY1zbuYBuW0fAwEnsiDS-k4DuWsALMSGASSpixGAHghw5L_goBQdgcBEArDYuwCAKBsZkGFC0qy2gVgSAAEyEnCcpRJLB17hL0iUspeSCknHFOQOK2SMrJLgK3OuaS_Z6TABgKAJxEmHxnqFReR8eCcPSmLFMVhDGe3mnEVa61NoYx7rPPm71PoeEmt3SOvdwqRWGBtAOpiLlkF8XssIvIGIECYqScklJhyJDpNxLIsoMjkEElrbQelJLSRgNU9FQF7q5ICuwTFBlsXVNMuxYZ9k8UoHYrPGSmh8CmACJQdA7IlDkNgSSfy0I4r3XoiARiRJoWsTvotayCBkAoqRXxJA5hKqYCgDJTBW85BuEoJ4LZWhoBKAEMGHANphj4H2CdHaMh_Lom2eQkO1g9RqGXpPQ-5UoCVUiaM06u5nCuC-gIUw0I1DGt2WCtsZB0B-yfliJCiwNBqE8KQF1UITgCHjZeepWTg2MDDWoCNnNG5RvIrGxYtTtACCdOweI2ISBO3UEwJ2UiKDmC4EoR19ks2P0HpzdQhg205r_khKs6g1mltdOWltdFQgTqAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVbBg7CaCqkMTKZGo_owdhwCA0LGogCMeAADNyaXSxMwHmsvKykKi-dQUWIeNh1GyxJcYNprFAJVKQEL1jdsUjJSjUQSOMR5SA_ttgkMNErdJ8uBUKuhxvQ1fqxJgBNACCazUEQu7PZariq5HqVPymDAnVbqBQIPA2br9aidJ0newCOgeCa2HQCS71cRU_AVsKTQBmPAAVjw7JDKLDeoFMH6ABFI_RmDG49quInXabAsEKu6NLB2NnsLnjSA6Q31QCYJ1juh0z2ANoAXXkinkPw12wOR1OjNiE3G1000JMcPMCIgPHGK424i42DgXBTaYzPC4YCOP7ET9GW_MQAG55HvR8iS4F8302QtYHfP9M1RPB7gQ-ApBkMDWnUOh2DAf5uAAIRgRlezpdE0mxAlVmoFBwL1DI0HUGAaOIOiGLpe9gRgAB9AR2CgdjOMYnc3GoJUoI2ZhCKEDZWDfd8AEFJi4JU4QId8gPTTM8AAJQ7RkAGFM0fSTaAovVxlWfpJ24HRhhgABxTh0nUFB33yX9cDyRiURsgZ7K4AQzgAOQxbhvLkEB_K4QK7LoIY4AAGXQZwPNI8jvMIqA_LpBLgswMimWxZT2HYbBOgsLL2BsLhvM3Ri6U4K12FcsivHouAAAoAEorKTThiEEyUerpJMLDmVwk0mnR2SyNgZAitJ8mAAlOkQ3RggwRQbAACR29Bf3_Lh9qLXSeAAQkadkZtmlELEyHRODAUYAGJahoVgIEBNb-oa-qeuIRy4F0JyOvc7qGq4DiBBgPq9rCjS4mwe7JtiaaJq4Pq4vElqjPYFaYDKFceABvsUWG0auHGvVJqx-nZosNhiq-bGHoAdRyDYIHfTp0EErgqJgAB-LgLHUcYBA2QsnVGOhNGnLhMEuDy1rXEG-eUVFQsZYmxA3RQ6nR5nYlZ4JTaTYAtbBvWicirgADIndpjnmcZh6HqmgYra9lEAE1BYAck4YWTlfCXaJoFAbB079DTiaP6Pqm3Qbwe3ifE_2Mc9nPHvdYhiBoLhvqgX6AX-gb8nq228FxWresRrg-jgbBMFgEY075vA-bSjL6Nqvb3f9_bsAZSPisZEezcL4vqD93PfZnxGZ-7sG-_SvpB5KrhxbEfvt5QPAT9qbE69a5h2FqlK-eIfrs7NvOUVx2dWipwmb7vinsYgMBaaunXKeTI8CwHoiDAalN9TU3YNQOK9Z37QPSDTOm3sMgd24IpZakU1obS2sA2-BJh5M0miDZoi99SeDqjPUhOgTY0MoSDGwxM4hMIYY9JhJRgTl0kqwnQFDHrxGoSQyh8QmjOAoZ4DobwRHWyASVMGMpxg9R6sAYWkUdbMR4TAHWPEQQCSElwRQ1dU7sK4DAsaZiOHCPzmglwkseAoA_DACAKA9BrUrFyY2ew1p6P4oJKAxt6isJaLInOngXDABFooEJAivYRJsDbbhrEYnxFCbY0RHE4kv3gV7Yxj9vbxGkX7Vh7dfDY1fqGRBb5Ogxi4A3BRP8mZ103gPFAtUYZwxgM1JmJgCTmPgOZPIMNsDHFlBsMA6RsjjRAHoYg4w4CIFiKecYEA8DS2oECVZUhMyxH6AAJgOAosQlSkzyMZF5V8YzvADLgEM0EEIaD9R6Wc9OrSj4dJyr5bpb8JIfzak0oayDYFuxEakWUC917g2YJDLqnk96w3TpffWkVSbsHJgNc-SLCawo8k3VJMp1Cm1OUY7cu4VD7n2IcE4ZwLhWm0KQK8sIzCMEgk-GCr5tIXW_CdFCgFuWZhwtQNl0FVLjF5QBEAaEzxCvkPHPSZ4Ow9QzBQAQaRaB4GkTrSSxwuBiv6pUvcexDw0pPHgzC0gyDGGZfCJAaAsC4B6tIyBdIwCwgqIRHg0BOjYjEIdKADIvAUEyMjeGNI9WrFwDrNu1A4D4kZH_MSrRtpQAwINWGGkqSVVjW69F2IBCTEZMG_K1B8bUE1SVQhGw-xRHTIyCoVBU0TDyNiRtbAFk_NLcmghd9YbsHTbWq-w50BF0zNidk4xNCbHQOXAgXBy5uOICgTgnQk0SQrYyKtsMCC0nLT2_pIN01_AIEfcdXJJ1rr3KQEwkBj6PIUOQa8LKER9jEFQB80BGQAHl1gsljQmbGYhISCSCAAWQmGyLpu6kxiHLpgNka4xDwAAGzhoFIKkAG5oP9ghJoE0nB_jTmw-qXDZRCMrk6CaeVPBwRwDwyAYjBoOK_WnOfdg8NGNiCOCOlsEBxxiiA9sOspKu0KEUOJoAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdSeUhadgkE4yBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ez2zIWN1FMWAUASc1DT08T8CvWymAAQWhJhkM0nx8AodwmFk5SsuRCgFE89BXNwDyvKYMgYBJJgguqkKivUow6LkLgR1wAA5ZUYGudwtCKkrSwMihTFwZh5PGgEEX-AZBivddFqWpgAHUjixTymCUEgprqgaAH5BisdhTCxCzVAhKh4h_Jg0FiKxzFu8q4BQUxyX688njW7YVhWnB_pYYAyoqr61B-mAmAAMlhwrkXWwFgRBpbKgOgByLg6tJJh9lyfViTIcwmkAiNy1WInyFJrLwY-yG-oGuj1oGeFUaR0RlJZ1mwfez7voGuGEfpyrgv1Hm2ZWBbkTCgjPiMbq4lwABxLgeBeuBRuQlguEm6bEbmwYZaNgEFGdA4UrgU5gG03SkhwKASFCJpg0duMwGJSNQw1CN8leZ00dyfYFC4MAIQAYkechkogIUbdG04mkK0XyriNXXOGEnEqYJxTBgbmml6hIKFWDB_vZxFZfa-Xwt16hle15E9ammbOZ2NMyCaPmKrTmAM417OmFO0Wlahgaho8UaBFHhu1AHrPzC17nVlTKxFrlpg6LohiQCYolSXJFZmpqiguJ4rJZQyRysXJ7R9J84y_IU32PxAMLNOxCzdIfwzfP8sydsrI2Tsu1RgkVopijiu4Xg-lkoYFSifEKY05AIKUHOJgOpmrLzGgMOIsAqC535tgO0NdRCi08m5EgvQXrNX0nnGAYDxqf2fOaawMNxIYBJGmLEYAeCHH8skCg7A4CIBWOxdgEAUAXTIMKSR1ltArAkAAJkJFVUBpViHqP0lwnhBk4BsJOOKcgbUFYDAoXAKhNCSZ0PEmADAUAThkM6orOeuByhYFgE3caEAwApy0XaYqOtRAtwNrNVmxsOam22HsNAsBLYIOtrbb-VkSEtQlmjNmZV3iZKWkMXAuTkZlT-pzCJAIypFwGqsCppSylDAUE0Dx5goBWBgNUhptTkZrAKZ0gG2TeiFMGBQH4fxekDB7h9NJH1UzsFkrJYASoAjSFziKFp9Vln-BFDAAA-lNKAoRipJ1wWU9aoS27RJOfkwZEShgfAuSc7Y_hzANBgBAcwyQIQAFY3SPHxDbTZopdm4H2SU-5ly1h3IeXUigfQFnM2qZCqFrNbndz2M01poQEXXLyd07FLBlJjNEAcyWdS1gjNydUzxmxamV3-pvWutcupuO8QMXx_iKqUOoUCGxVUgmczOZExEVjuXmBQGK2lyJQhMBwCcY5AwBXhORSbS5XYKD5WYDHFp8dgCJ2TqLLB6iipSqBHAKl4IJkoE5dY8wzUXbBgwLafGj0qqrFVeq3JFqx7uKpUaml0sonrXpVvCcYReSMQIMxQ-bF6zigvnxWgn876Rm8n_J-gjFJvw_jfdKmUU1GRMgFCRMJ35MKTSgDiDdZKaHwKYAIlB0DsiUMs-qjUMqzOUmFXe-8WJHyAR9EBcbsi0EQM0kgmAoCyRGXyowbhKCeHsVoaASgBAhhwLaYY-B9jF3zjIdK6IHHLNNdYPUahfHtRcQ7KATtjl3V1PuVww0BCmGhGoTdTjQ3hTFukrEyFFgaDUCaEgV6oQnAEKQYDIjGEfsYF-0-udcDHL_crTwiw1XaAEM6dg8RsRAbBEwFp7yKDmC4Eoc9CtYPIJhYYCjQlinIWrOoEVGG3RYbI_RUIHGgA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVKg8cboPIVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFghUPRpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREHJq424i42DgXFT6czPC4YCOP7ET8mW_MQAG55AfCkiS4F8302ItYHfP8s1RPB7gQ-ApBkMCIMfaCACEYCZAAZCACV_f9UNiQiSLImdwLcahlSgjZmDAbAhA2Vg33fABBSYuGVOECHfICMyzPAACVOyZABhLMKSY2g-3pcZVn6KduB0YYYAAcU4dJ1BQd98l_XA8gYlE1IGTSuAEM4ADkMW4Uy5BASyuGsjS6C4TAiPYUjyNMpjji4GiArogAKABKBj6U4a12H0oivGoYyYpU_UUU4YgBHYKVIvpZMLDmVxk2KnQOSyNgZCctJ8mAAlOkQ3RggwRQbAACTa9AKJQzri3EngAEJGg5MrypRCxMh0TgwFGABiWoaFYCBAQajL8hsLhIuIbS4F0HTksMtKTK4Yh2AEGBoo6orJq4ByhLu4qzwml7Sru2K51abKZPYOqYDKVceAy_tfty_KduergSoGN7yosNg_K-aHkwAdRyDYyK4Tp0Dyrh0TSAB-GH1HGAQNiLZ1RjoTQZ18y4jIa9c9rI5RUXspkAbETdFDqeGXqR4IBYNYBWYOzn_ucrgADIZahrL7th-ZUfKgBNPGAHJOAJk5XxhgkjjSmwxO_I04kNmgUG2sX9rwSWAd3RXJtmOHVZu1XbbI-3HOluXzrtvzaIJJ2XdiD7Fa-sMfq4BLmHYUG7pyvKCuh1I5WoGwvYO7TmGO1LjK4EnxbwOOuecoH2BB6KuGxEuy6SgyC7gGLFDiWV1HhqOGx3PcVAPfZDhOM5qP8wLiEva9YTMRhIKfGDX1Ewbvz6gCQFNrMcOoOfoNg98msQ1eqIPzDpBuOLt9Mdh2KCML_MylFCZgbFDaMjyMjQdRn_g1Y0o8h9gQwAAPp5SgC_C6b9e6MWYvPNiHEoBcRqu-cK49BJ007EvL8ElpKJXko-JSGx-xeVsmRYi6BnBGXClwUy7EoAWVUupWyQdmTYl4uwdg2BOgWHCttUyW4L6_USonRWEAwA7RLqQ8hfQ0rhRrmDA0ydIbKxsGQihaU8AaNdvMDyDZBJ0O4PI8GKcFb3RhhHUxU0PTEGIDQLgK0oBrQBBtGuW0A7e1xOFFuN0uB9DgNgTAsARjZzwJItRKBwq3WdvdTq2BGT62YarKaBwKY2Mzokvs9c_olH8bAVuqstEi27gaUOXAnYMJsj5Bu2SAkwGEcmURO1hol2YQdWAaU9pyOhoo6gOjSkxyMZDQqUTPA5O4NxWqzkGonwOsw8ekTTGeCaM4EWxULorIRntfm6Spp7RsADOIuztkw12dkz-TEDk6HWUktZ-T4hLJaFEnZHQ3iPNFs0_yB1ZTjEipFYABNnLsw_g4pi7MAEghAewEIigXE2yOd0kxFjVnsCuUrYgDzEULIfCgD8MAIAoD0A1Ks3I-Z7AamC4BoC-b1COS9NFKKXZ0uAE_Nu8R0UYtWS4MWwJgUwBZXSmlMN4jIqOUU0x0KSlh2IM8kWBzRldw8mU_UxCfJvk6LGLgHiPl1INBIuAqjpHhPvqZC6V0BEGhMORTgcBFJ5Goa-Y4coNhgHSNkQq69rHjDgIgWIZ5xgQDwOTagQI_VSCzLEfoAAmA4HyxCircTMj5drsAOu8LHeANrQQQhoDFM1KJdX6soUasy-iFVQP3HsI8w9TxKm0KQKeph4RqDws-ReH5l4oWQmvDe2Z3K4RYlwfi4wj5iDQueLe8hu14HPJ2SKmYKACDSLQPAzz2YhQHZMGKUdy2HiHiec40ysJkGMNPRtiA0BYFwJFZ5nT9RgFhBUdiPBoCdGxGIbqUBGReAoJkR6V1aQDtWLgdmfjqBwHxEyURDFFWtSgBgB-50hLUg4aBu9VdsQCEmEyb99DqDQdmXReDUQMxMlJOgWDEw8jYioORz1MAoOtGXWPAjF1COrnjiOdA1iszYg5OMTQmwyPDC4A4_FxAUCcE6PRxijHg6UwIHSagMmIrkU2UQ5wBqePcj41J_cpATCQBQOCSEChyA3hngifsYgyR-vHAAeXWKyUDiY7piEhHlIIABZCY7ITUwAU8mMQDjMDsnXGIeAAA2f9gpN4gE3P5gcEJNCmk4P8Gc8WNSJbKKl1cnRTSTsSwWQ0ECKAzjrpdPzLmQBHE462CAE5xSue2PWPpuG-6KEUEAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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
          return this.hideGreetings ? this.renderNameForm() : this.renderGreetings()
        }
      }),
      this.beerList
    ]
  }

  renderLayout(content) {
    return <main>{content}</main>
  }

  renderNameForm() {
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

  renderGreetings() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreetings = true)}>
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

  renderLayout(content: hyperdom.VdomFragment) {
    return <main>{content}</main>;
  }

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKAdAIwIZplATgYyVHwHsA7AFxkqRGAB0yACJ-kAB13hgrjcSYBtRixZtqANzYAaEaLYALAJ7sYuACYkAtmzkBdWc1YcoAVwDmEMnyRC5YkBVwZrYEri0BaXKcoQtMLpGeowAvowgodIgVuowAB4oChRaUEQgpJTUFLQAPACEACIA8gDCACoAmgAKAKJMyakAfIy5jVAtRm0wGOqdoky5FBAUsE3VGAQ4TADKLupoJPG5APTDozD9orkBFBhM-AqTcDwAvGwAquUAYp4AHGxMK1urCj19jHK5i-pKWyy5dQQCRMCDqc4gDDsdhsJqrIESTr2QZwfC4CDsChMOAECE4_ArNC4EgAdxOuBWsQSKAAVjY4StUejMS9CSRfp1XikOhEohwMPgANYYcwwWlwcjpTJUGiIOhyNhkDABfjGZSqDTaTyiiieOB7XBUdTeEimYZkcwyBUgCRqOAQciqtgARhQAAZ3VajGw4kyMcNHbY2AAJFRqTRaJiFGBaEhMABSMy9Di0GCsTpiZDiiXayeMfsxNgEDCMDn1kwoGfYk3w0ypOe5TE8nhIqjIeYcaFM0HUVZr0y7PdBWepuZAcii1ribbiZHwEHgqpLAzYmGwUE87DMljInicLjgbg83l8wxVQZAUAwVH1HeMa5wm64J116vD2gzV5vlZAhhXIDfTUdAvL94B_Cc_2MOIJGjGdqHnRdbGXeR-SmDcuyzWBcE_a8wKCFhJ29EBBRgJQSXcdQiyEEIyHCMhImifFCWJMk1BWKF2HFeIpXIGUcjlTJ9QaMMgKYU4mC4ABHbsuAACkUESIzYABKABuRhBKxfUlFgOAxIkmBpIgOS2BQRkKB0-AUHwOAbDUjTyCEgAhGA1AAGQgITxKkmSYHkkAzJc9zPJ_ZSHOsLFiTNeB9J84y_NMlYopvFT1PbMhY3UUxYBQBJ2HcXh9PwK9bKYABBaEmGQzSfHwCh3CYWTlKq5EKAUTz0Fc3APK8pgyBgEkmCC7qQqaidPiMZL4CalrSwMihTFwZhhDmlgprgJJtD85CBjW6g4lwAQZtOJpZt23auAWpamDajr2riABxLgeCscw9IAfhu9qNq4EdcAAOWVGBrncLQZoEW6fv2tQntc803rG1bRDo87QmUyCBkhzrgtvOaaIIia9r-tyMCUU0KFk6Vsmanb5sW5gdjTMgmmAKnKFCVZUysLY6LkX6DsBgIQY8Gbacu-nGuRAEEX-XbcivddZfOgB1I4sU8pgycWvqgc-3IrHYM0brDCEqHiH8mDQWJXtN76UFMclBcCEAGQNs0le2FYFZwD2WFp86sYdtQnaYAAyUPBhlypTQAci4PrSSYfZcn1YkLSaQCI3LVZU_IcxTuAQPHaBjmVhlqXkYrv2i-DoGw4j3J9gULgwFOYB1ux3ANubmAwCa0ImmDDBbSTy2utWDAmhRuWy-BWWwqMXnJuh3BYZei04FF5Fxeu-SkcBOeq8GBRnQOEq4Db7TdKSHAoBIAfg1vuMwGJSNQw1CN8leZ1fcGJuW4hAAYkeOQYqEAhRt2OqdWSWN7owDXvDPS4knCmBgMpAeR8WD_QSJWJGAJ2Ie3hIfOa9lF5hF5IxAgzFSTkhWMNHqFAuI8SyLKDIjksSZ20LFQyvl_KcOAqQzS2ILK6W4UZEyAVzKWQ2jZOyaUhHrTEbwxK61UoTUytlMUeUCpILPhgUq9CQqzTkDqMeagACS6gt5zR3swf6pgtDYFwDAu22ALHqAmM4LQC8CbpRYPopQc4mDkDvr0axmM7aeTciQXor1hr6RQYEPxogFHwHytYGA-kMAkjTFiMAPBDh8IoBQdgcBEArHYuwCAKBDZkGFFU6y2gVgSAAEyEi6nZVqriOlZJySMAycB0knHFOQRGXSOpRJiUCC08TxJgAwFAE441knrXCaIWxdgkYdzcV3WS_t1kryOs1E6Z1zoHKugzGWhdIlwGibEmZXUmCfTYHc6Z5gUAfMeBDO2_M1DlCwLAfuRDERH2ngMNGGN1nkysjsvZR8rZZlemU05ZzQTqAEIISG0h7xdUsZ45UbB8ZnMIqi35h1GrHILpgum10D6ImuRM25Uy4mPOeSAV5r0PkoC-V9DqZLSiLV-hQYaQLZ4grwUwMFyMfGiCJUvImB0BW4CFSKmmyIhE7ISd0u0KBIBZlkpqk5OyUBgjEqcZB2rcCWJlXtC5gx_DmGxLiYAxr_AihgAAfUWlAUIzxll8xXv8tAgK1U2J4BLPe506W_yGACzJxV9EX2AFfGFXUGEYIlQCNq7xf4DCGLgXNcs2pPELXmtqTQnarHLdSstCgmj_PMFAKwMAq11prdsYtfrM2eycIW1tObqVDB-H8dtDKNo7I2qmdgsk9lgmxUqAI2K9iNubdit1oovW4B9ZSlFqLzkRvbWWgth6i0fG7Xu-1WhHVvAgOYZIEIACsbpHj4jbuuz13rQglpPXmtYZ6L2oqGH0YAC6YClwoP-gDUaIMs2XU2_q4HINQbLX0RuDQAHt2heOrqSQW6zvUGjAecAFCkgngyGDP7BhrGPee0QNq92EcHWsYdMa1hxsIWK-eyy6IMRAExIkNC2L1nFMwvitAhH8KUfFPhikPwgEEewiS0LcBSYkfwpKym1FzkUxVdgqmEqSI4lpxg_CUAcX2rJTQ-AHHZHQOyJQ86BrlWhE1bFwAlPRRU2jNKvH-MsVoR3OkonsjicU1NFT3keHSYUh_Jp4XjMZXZJo3K8R8qGl0chEjAQBDhZQFNfyKwVKQQnTl5TeXoUFYnUVuQOzSuefK9FSrHSViIDBCpMIPm-R-cExSFNMjbLBdYYgRtJBMBQANfZ0NLA3CUE8PMrQ0AlACBDDgW0wx8D7GwagmQ5V0QLOxXAA8eo1AQDAGlJeN8oB31OWbXU-5XCgwEKYaEagNsnHOxNTuDDTmLA0GoTwpArtQhOAIQHV5SkwA--lL7RinA_Yov9xYxTtACGdOweI2ISBNvUEwJtd6KDmC4EoKHjAYdCQg4YMnWJi3IWrOoN5qO3To6h5EUIoQgA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

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

<iframe src="https://codesandbox.io/api/v1/sandboxes/define?embed=1&parameters=N4IgZglgNgpgziAXKA5lA9gIwIZQHQAmeALgsiAMboB2xMtSIBMFU2ATjAAQC26BAV1hcAOiABUeCnDhiR1EAF8ANCAjVmADzwALYjyhJQVWvWKMAPHoMA-efKsxsBO9RHELxCMVg2AChwUMFBcAMrYGpjomhYA9F4-MK7uFjwwxNhcFDoccOkAvGIAqgAqAGIAtAAcYlyxrnE6Ti721BZRBACeyR4EEABuXBAEhSDYAA7jYjZxff3Jbh5wFOwQ48RccOwUo1sUsZjs6ADueeyx6loksiAzscur6w0H_N2tjfpQrkqq49gUAGtsCgYHgAFZwGhGSg0OgMRAgYDyLiiEDUbBpMSIVEg4gVOAZdh0AgVI4CLzUFAVUhiZTI1H9GDsOAQGhY1EARjwAAYebT6WJmA81l42UhUfzqCixDxsOp2WJLjBtNYoJLpSBhesbtikVKUaiCRxiAqQH9tsEhhplbpPlwKhV0ON6OqDWJMAJoARTeagiEPV6rVdVXJ9SoBUwYM7rdQKBB4Oy9QbUTpOs72AR0DxTWw6ATXRriGn4CsRaaAMx4ACseA5oZR4f1gpg_QAIlH6MxY_GdVwk26zYFghUPRpYOwc9g8yaQPTGxqATBOsd0BnewBtAC68kU8h-mu2ByOpyZsQm42ummhJjh5gREB441XG3EXGwcC4qfTmZ4XDAR1_MQvyZH8xAAbnkB8nyJLhX3fTYi1gD9_yzVE8HuRD4CkGRwMgx9ny4AAhGAmQAGQgAk_wAtDYmIsiKJnCDqCggiyTzKjULEdC2ITEAmPkZVoI2ZgwGwIQNlYd8PwAQUmLhlThAgP2AjMszwAAldByXgABhLMn2oMw-3pcZVn6KduB0YYYAAcU4dJ1BQD98j_XA8iYlFTIGCyuAEM4ADkMW4Fy5D4kyzJ8zASPYcjKJcwzjiI6LYuIAAKABKfj9R4uAMuM_UUU4YgBHYKV13pZMct0LMYFS_tk0KzsmWxPL8hsfKGoaoqSqlYgrLgXRrLskiKScrgAH4uD6ii8E4a12ECtIylXHg8uxaaBrm5h2GGhzKVyzKKoa3cCoNRR0rpU6UQ2vAovo_NTs3DyuBO-ktrI7BOi0tKbzMbEVJ_PAADUfzKdhgTSWh0o6g1utKrhUjlagbGAX7aEUOJZXUGxnte7Kmp2-zRoOmHGuK-HUqOlELDmVxOupnQOSyNgZEWmB8mAAlOiQ3RggwRQbAACT59AON_QXi1UngAEJGg5On6YsTIdE4MBRgAYlqGhWAgQEOda9rUpuqzmF24muBc4h2AEGB0oFqmGv8hSHeps8FeTWYBndrhDrDVpGvmtnlvYVbofqrg4alSmroR2mXYRtgoq-eOUQAdRyDYKK4L6Sq4dE0kmix1HGckpuLUY6E0GcuEwS5HI59cNuUVE_KZNmxE3RQ6m9j3YkT4Ie4NYAbtbhagq4AAyCeuGj-mDRpr2U4NABNLSAHJODzk43wRgkjkpGwAazI04j3mgUHa4f-rwUe2ZOufXbjmOUTt-Or5m2_x6nhHldVjmqrusyXQqsMoC0FtgRkO9AFxGwDYe-DVPbzCOr7BsO49wqAPPsQ4Jwzi0WSgxS815YRmEYCxGCcFlKSx_GLFMVCsy4WYvhchb4PxcyQjQriGFuZYWkDcJiZCNg5Q4SAbi31eJZXUHQdgokghJSZDDYY2JqACB4FFdgz184wGxHvRyz0MhoHUFohCqxKTPQfMCGAAB9EqUBtFW10WgtwhlNBCS4CJMSUAJIsw_HRGKDF5JV07JQ78alNLaTgHpfChlaAwy8uZOgQw4CkXQM4RyviLauSgO5cK3kEmALgNiaS7BwadAsL49qLktzPTiZFaKABJAgARwY8DsSYlAGTQpZU8hFBJuIa71IIHlcOkcuD-RUWoo219AENKaRiFBL1_YsM6LGLgNAMDOCGUdG6FFkmpMpOky21sYBdINCYSinA4AGTyBk7Axw5QbDAOkbIlMQB6GIOMApsQzzjAgHgEu1AgQ_KkFmWI_QABMBxoo3HmddKZUKbl3O8BHeAVzQQQhoBlE5sKZo7JSX0fZ0UMmiSyccuciycqbNOiM8qMcAFQrqvHd67AWrQzaqTemIzZ4P2prTd-A1cV7JQOkyaYhdn4pQHgSVtR1rXyZSUbAmBYCgMQYPZMMLjoO3OpdTqdKmQMufjXOu-1dRL0UVwRu_Vm7ugGbM7MIBtwGvnBygmLKLaXyXpypePLF4Gs6nyvAArxXCtRGKxykq8DSqmrKgmOkSpzWIL40BXqEaxCfty9VyZ4GZvSkdJ6ZKnEB22pS5MEAwAz22UkvFaTophwdiMhe8xQ2UnDSq56DZ5IkvZWTHqM944NtVfPD0xBiA0FWbGKAusAT61Ze1G6uJfEHS7n0OACrYAjH9YG6tTJ7a-oNOAyBmRAFLziEOkdyMl7-rlau2qr8DUqoduq-BeNC1MljcUswiba2nTORsQBGSbr5LwJADQqU_1ssAQGggFt8iWzhUyBp6r60PnaXsDmEHzEgmsewKAXd6i40WTUhJV7FU3vZaWme0sANQrwLASkfUv06vSD1NtCyC2wyYxTB2nhr3MykmzDmbCsKAJSjuuengmjOAHdTK2Un559W7sm8TNg2ZxD6rJ6TOgbDyoMYZVTmnFPyfqMe-I7AB16eaGZ4gHQ3i7v9YB2U4xUp1SGAQZumjm76InYZZuGGrE2JejOrtzryZR2TdJ0zYW5MtF3WJ5Dn4YAQBQHoDmVZuRd1Q8AXzWGcMKZiwg-I0XuWdU8C4YAmiMYFfUwg4gpXPOGIqzVqrHtGuRY9r_GAatgC6vYMAjrznhgBYFnAHQJwYFNfnpVyLqmIt5YzcdW9Yn4jWcHqp693t5knROvuPYR4cGniVNoUgRDTDwjUEwl8LDPx0N_ChQCrzrsMIEbBS7PF2DCKPjwWIr3Hvna4LJcYwj0LngYfID7eBzydlSpmCgKizC3VeG5mAiV_sZWbsACOYi3vnSYttw82CTznCqkd8gaM7xndcRQjH2k3u3doSEz732wpOMEgRdx4kYYjbSNiV7s0xEvNiGIC69J8nc8x7z7S_P8mC-1f05qVOpHi7oJLqFsREDDEFzuHHGCdv49wYJgavDju3kYIgNAWBcCgdeAxv8sIKiiR4NATo2IxDCygIyLwFBMhOxtrSP7qxcDNxXdQOA-ImSlqYnjXmUAMAw0rniK2EQ4BgBWtiAQkwmSe-ydQSPwn_H9iiBmJkFQqDR4mHkbEJe2AfNJdn1ot18GUStjDAv20RzoGHVmbEHJxiaE2OgCdUGJ1JeICgTgnQI919z431z8h6_3Q2PJ_sfwCDiq79yHvE-FAYNICYSAEr0UKBJ8Q07_YxBUEfNAJkAB5dYrJg-JiOmISEJUggAFkJjsitjbGXGoJ2YHZDSp1GIPAAAGwFgDigSziPQ_6ogQiaCmicD_AzgwFiBwFlBIGridCmhg5wHgFP72IUAzjrRHIoEgCEi4imgACioQVYeBIARw7erYEAE44oT-2w9YrGW2ig3BQAA" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<!-- tabs:end -->

When beer table page is visited for the _first_ time, an `onload()` method is called by hyperdom (if provided). In our example, it performs an ajax request to fetch the data. This way, even if the page is then reload whilst on `/beers` or `/beers/23` the data is always going to be there to render.

Speaking of `/beers/23`, note how the `:id` parameter is bound onto a component property using `bindings` property. This is very similar to the input bindings we saw earlier.

?> Note how we use a custom `beerId` getter to coerce `:id` param into a number. That's because all url bindings produce string values.

Learn more about routing [here](api#routing)

## Testing

We've touched all hyperdom bases - there aren't that many! - and this is definitely enough to get you started. To help you keep going past that, `create-hyperdom-app` contains a fast, _full stack_ browser tests powered by [electron-mocha](https://github.com/jprichardson/electron-mocha) runner and [browser-monkey](https://github.com/featurist/browser-monkey) for dom assertions/manipulations. It's only a `yarn test` away.
