import hyperdom from 'hyperdom'
import {hello} from './styles.css'

export default class App {
  render () {
    return (
      <main>
        <h1 class={hello}>Hello from Hyperdom!</h1>
      </main>
    )
  }
}
