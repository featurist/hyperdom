import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";
import BeerList from "./BeerList";

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
