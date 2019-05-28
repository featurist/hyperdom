import * as hyperdom from "hyperdom";

class App extends hyperdom.RenderComponent {
  private name: string;

  public render() {
    return (
      <div>
        <label>what's your name? </label>
        <input type="text" binding={[this, "name"]} />
        <div>hi {this.name} </div>
      </div>
    );
  }
}

hyperdom.append(document.body, new App());
