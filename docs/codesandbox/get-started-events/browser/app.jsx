import hyperdom from 'hyperdom';
import {hello} from './styles.css';

export default class App {
  renderGreetings() {
    if (!this.hideGreetings) {
      return <div>
        <h1 class={hello}>Hello from Hyperdom!</h1>
        <a href='#' onclick={() => this.hideGreetings = true}>Next</a>
      </div>
    } else {
      return <p>Now then...</p>
    }
  }

  render () {
    return <main>
      {this.renderGreetings()}
    </main>
  }
}
