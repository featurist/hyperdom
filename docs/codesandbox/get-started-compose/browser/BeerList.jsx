const hyperdom = require("hyperdom");
const styles = require("./styles.css");

module.exports = class BeerList {

  async getBeers() {
    delete this.beers;
    this.isLoadingBeer = true;

    const response = await fetch("https://api.punkapi.com/v2/beers");
    this.beers = await response.json();

    this.isLoadingBeer = false;
  }

  renderTable() {
    if (this.beers) {
      return (
        <div>
          <table class={styles.beerList}>
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Tagline</th>
              </tr>
            </thead>
            <tbody>
              {this.beers.map(({name, tagline, image_url}) => {
                return (
                  <tr>
                    <td>
                      <img height="50" src={image_url} />
                    </td>
                    <td>{name}</td>
                    <td>{tagline}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    if (this.isLoadingBeer) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <button onclick={() => this.getBeers()} disabled={this.isLoadingBeer}>Have a beer</button>
          {this.renderTable()}
        </div>
      );
    }
  }
}
