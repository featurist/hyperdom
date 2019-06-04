import * as hyperdom from "hyperdom";
import { hello } from "./styles.css";

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
