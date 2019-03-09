import * as hyperdom from "hyperdom";
import styles from "./styles.css";

export default class App {
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

  render() {
    return (
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
