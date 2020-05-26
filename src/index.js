import "./styles/main.scss";
import runApp from "./app/app";

// Freecodecamp Test Script
localStorage.setItem("project_selector", "heat-map");

runApp();

if (module.hot) {
  module.hot.accept("./app/app", () => {
    runApp();
  });
}
