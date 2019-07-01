import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";

interface Beer {
  name: string;
  tagline: string;
  image_url: string;
}

export default class App extends hyperdom.RenderComponent {
  private hideGreetings = false;
  private userName = "";
  private isLoadingBeer = false;
  private beers: Array<Beer> = [];

  renderGreetings() {
    return (
      <div>
        <h1 className={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreetings = true)}>Next</a>
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
            <div>
              You're now a <strong>hyperdomsta</strong> {this.userName}
            </div>
            <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
              Have a beer
            </button>
          </div>
        )}
        {this.isLoadingBeer ? "Loading..." : this.renderBeerList()}
      </div>
    );
  }

  renderBeerList() {
    if (!this.beers.length) {
      return;
    }

    return (
      <table className={styles.beerList}>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Tagline</th>
          </tr>
        </thead>
        <tbody>
          {this.beers.map(({ name, tagline, image_url }) => {
            return (
              <tr>
                <td><img height={50} src={image_url} /></td>
                <td>{name}</td>
                <td>{tagline}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  async getBeers() {
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  render() {
    return (
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
