import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { RowndPlugin } from "../../../src/index"; // Import the plugin

const app = createApp(App);

app.use(RowndPlugin, {
  appKey: "key_m2t3xiunrzlakpcc80ho5nrq",
});

app.mount("#app");
