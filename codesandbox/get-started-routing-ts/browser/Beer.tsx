import * as hyperdom from "hyperdom";
import { IBeer } from "./BeerList";
import routes from "./routes";

export default class Beer {
  private beerIdParam?: string;
  private beer?: IBeer;
  private beers: Array<IBeer> = [];

  constructor(beerList: { beers: Array<IBeer> }) {
    this.beers = beerList.beers;
  }

  get beerId() {
    return Number(this.beerIdParam);
  }

  routes() {
    return [
      routes.beer({
        onload: async () => {
          this.beer = undefined;

          if (this.beers.length) {
            this.beer = this.beers.find(beer => beer.id === this.beerId);
          } else {
            const response = await fetch(
              `https://api.punkapi.com/v2/beers/${this.beerId}`
            );
            this.beer = (await response.json())[0];
          }
        },
        bindings: {
          id: [this, "beerIdParam"]
        },
        render: () => {
          return (
            <div>{!this.beer ? "Loading..." : this.renderCurrentBeer()}</div>
          );
        }
      })
    ];
  }

  renderCurrentBeer() {
    return <img src={this.beer.image_url} height={400} />;
  }
}
