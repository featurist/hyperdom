import * as hyperdom from "hyperdom";
import { hello } from "./styles.css";

export default class App extends hyperdom.RenderComponent {
  public render() {
    return <h1 className={hello}>Hello from Hyperdom!</h1>;
  }
}
