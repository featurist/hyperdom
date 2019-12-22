import hyperdom from 'hyperdom';
import routes from './routes';
import styles from './styles.css';
import Beer from './Beer';

export default class BeerList {
  constructor() {
    this.showBeer = new Beer(this);
  }

  routes() {
    return [
      routes.beers({
        onload: async () => {
          if (!this.beers) {
            const response = await fetch("https://api.punkapi.com/v2/beers");
            this.beers = await response.json();
          }
        },
        render: () => {
          return <div>{!this.beers ? "Loading..." : this.renderTable()}</div>;
        }
      }),
      this.showBeer
    ];
  }

  renderTable() {
    return (
      <div>
        <table class={styles.beerList}>
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
                    <img height="50" src={image_url} />
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
      </div>
    );
  }
};
