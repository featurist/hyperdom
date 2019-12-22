import hyperdom from 'hyperdom';
import styles from './styles.css';
import BeerList from './BeerList';

export default class App {
  constructor () {
    this.beerList = new BeerList();
  }

  renderNameForm() {
    return (
      <div>
        <label>
          What is your name? <input type="text" binding="this.userName" />
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

  renderGreetings() {
    return (
      <div>
        <h1 class={styles.hello}>Hello from Hyperdom!</h1>
        <a href="#" onclick={() => (this.hideGreetings = true)}>Next</a>
      </div>
    );
  }

  render() {
    return (
      <main>{this.hideGreetings ? this.renderNameForm() : this.renderGreetings()}</main>
    );
  }
}
