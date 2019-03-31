const hyperdom = require("hyperdom");
const {hello} = require("./styles.css");

module.exports = class App {
  renderHeader() {
    if (!this.hideGreeting) {
      return <div>
        <h1 class={hello}>Hello from Hyperdom!</h1>
        <a href='#' onclick={() => this.hideGreeting = true}>Next</a>
      </div>
    }
  }

}
