const hyperdom = require("hyperdom");
const App = require("./app");

hyperdom.append(document.body, new App());
