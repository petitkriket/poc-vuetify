import { createApp } from "vue";
import { createRouter, createWebHistory, RouteComponent } from "vue-router";

import "vuetify/lib/styles/main.sass";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components";
import * as directives from "vuetify/lib/directives";

import App from "./app.vue";

const vuetify = createVuetify({
  components,
  directives
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "index",
      path: "/",
      component: async (): Promise<RouteComponent> =>
        import("@/pages/index.vue")
    }
  ]
});

createApp(App).use(router).use(vuetify).mount("#app");
