import * as hyperdom from "hyperdom";
import * as router from "hyperdom/router";
import App from "./app";

hyperdom.append(document.body, new App(), { router });
