<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >

      <v-toolbar-title>
        App Name
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="flex align-center">
        <v-tooltip bottom v-for="item in routes" :key="item.name">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                   :to="item.route"
                   class="mr-4"
                   text
                   auto-height
                   depressed
                   rounded
                   v-bind="attrs"
                   v-on="on">
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </v-toolbar-items>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: 'App',
  computed: {
    routes(): Array<{
      name: string;
      route: string;
      icon: string;
    }> {
      return [
        {
          name: "Home",
          route: "/",
          icon: "mdi-home",
        },
        {
          name: "Login",
          route: "/login",
          icon: "mdi-login",
        },
        {
          name: "Search",
          route: "/search",
          icon: "mdi-magnify",
        },
        {
          name: "Feedback",
          route: "/feedback",
          icon: "mdi-message-alert",
        },
      ];
    },
  },
});
</script>
