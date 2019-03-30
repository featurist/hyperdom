import * as hyperdom from "hyperdom";
import styles from "./styles.css";
import BeerList from "./BeerList";

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
