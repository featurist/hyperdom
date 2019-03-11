import * as hyperdom from "hyperdom";
import styles from "./styles.css";

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

  renderUsername() {
    if (this.userName) {
      return (
        <div>
          <div>You're now a 💪hyperdomsta {this.userName}</div>
          <button
            onclick={() => this.getBeers()}
            disabled={this.isLoadingBeer}
          >
            Have a beer
          </button>
        </div>
      );
    }
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
      <main>{this.hideGreeting ? this.renderBody() : this.renderHeader()}</main>
    );
  }
}
