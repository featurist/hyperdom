const hyperdom = require("hyperdom");
const styles = require("./styles.css");
const BeerList = require("./BeerList")

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
