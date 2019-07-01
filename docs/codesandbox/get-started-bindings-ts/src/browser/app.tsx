import * as hyperdom from "hyperdom";
import { hello } from "./styles.css";

export default class App extends hyperdom.RenderComponent {
  private hideGreetings: boolean;
  private userName: string;

  renderGreetings() {
    if (!this.hideGreetings) {
      return (
        <div>
          <h1 className={hello}>Hello from Hyperdom!</h1>
          <a href="#" onclick={() => this.hideGreetings = true}>Next</a>
        </div>
      );
    }
  }

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

