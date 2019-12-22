import hyperdom from 'hyperdom';
import routes from './routes';

export default class Beer {
  constructor(beerList) {
    this.beerList = beerList;
  }

  get beerId() {
    return Number(this.beerIdParam);
  }

  routes() {
    return [
      routes.beer({
        onload: async () => {
          this.beer = null;

          if (this.beerList.beers) {
            this.beer = this.beerList.beers.find(
              beer => beer.id === this.beerId
            );
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
};
