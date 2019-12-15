import * as hyperdom from "hyperdom";
import * as styles from "./styles.css";
import routes from "./routes";
import Beer from "./Beer";

export interface IBeer {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
}

export default class BeerList extends hyperdom.RoutesComponent {
  public beers: Array<IBeer> = [];
  private showBeer: Beer;

  constructor() {
    super();
    this.showBeer = new Beer(this);
  }

  async onload() {
    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();
  }

  routes() {
    return [
      routes.beers({
        render: () => {
          return (
            <div>{this.beers.length ? this.renderTable() : "Loading..."}</div>
          );
        }
      }),
      this.showBeer
    ];
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
