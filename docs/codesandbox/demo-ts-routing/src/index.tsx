import * as hyperdom from "hyperdom";
import * as router from "hyperdom/router";

const home = router.route("/");

class Thing extends hyperdom.RoutesComponent {
  tech = "hyperdom";

  routes() {
    return [
      home({
        render: () => {
          return <div>Hello from {this.tech}</div>;
        }
      })
    ];
  }
}

hyperdom.append(document.body, new Thing(), {router});
