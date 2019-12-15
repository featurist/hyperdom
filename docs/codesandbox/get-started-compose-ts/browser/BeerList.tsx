import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";

interface Beer {
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RenderComponent {
  private isLoadingBeer = false;
  private beers: Array<Beer> = [];

  render() {
    if (this.isLoadingBeer) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>
            Have a beer
          </button>
          {this.renderTable()}
        </div>
      );
    }
  }

  private renderTable() {
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
                <td>
                  <img height={50} src={image_url} />
                </td>
                <td>{name}</td>
                <td>{tagline}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  private async getBeers() {
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }
}
