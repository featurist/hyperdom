import * as hyperdom from "hyperdom";
import { hello } from "./styles.css";

export default class App extends hyperdom.RenderComponent {
  private hideGreeting: boolean;
  private userName: string;

  renderHeader() {
    if (!this.hideGreeting) {
      return (
        <div>
          <h1 className={hello}>Hello from Hyperdom!</h1>
          <a href="#" onclick={() => this.hideGreeting = true}>Next</a>
        </div>
      );
    }
  }

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

