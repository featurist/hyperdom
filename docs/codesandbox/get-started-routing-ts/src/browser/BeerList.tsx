import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";
import routes from "./routes";

interface Beer {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RoutesComponent {
  private isLoadingBeer = false;
  private beers: Array<Beer> = [];
  private beerIdParam: string = "";

  private get beerId() {
    return Number(this.beerIdParam);
  }

  async onload() {
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  routes() {
    return [
      routes.beers({
        render: () => {
          return (
            <div>{this.isLoadingBeer ? "Loading..." : this.renderTable()}</div>
          );
        }
      }),
      routes.beer({
        bindings: {
          id: [this, "beerIdParam"]
        },
        render: () => {
          return (
            <div>
              {this.isLoadingBeer ? "Loading..." : this.renderCurrentBeer()}
            </div>
          );
        }
      })
    ];
  }

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

  renderCurrentBeer() {
    const beer = this.beers.find(beer => beer.id === this.beerId);
    return <img src={beer.image_url} />;
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
            <th />
          </tr>
        </thead>
        <tbody>
          {this.beers.map(({ id, name, tagline, image_url }) => {
            return (
              <tr>
                <td>
                  <img height={50} src={image_url} />
                </td>
                <td>{name}</td>
                <td>{tagline}</td>
                <td>
                  <a href={routes.beer.href({ id })}>show</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
