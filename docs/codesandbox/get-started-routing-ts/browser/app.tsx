import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";
import BeerList from "./BeerList";
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
