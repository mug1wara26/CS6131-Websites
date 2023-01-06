<template>
  <v-app>
    <v-app-bar
        app
        clipped-left
        color="primary"
        dark
    >

      <v-toolbar-title>
        App Name
      </v-toolbar-title>

    </v-app-bar>

    <v-navigation-drawer
        permanent
        app
        clipped
        mini-variant-width="100px"
        mini-variant
        absolute
    >
      <v-list dense nav>
        <v-tooltip bottom v-for="item in routes" :key="item.name">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item>
              <v-list-item-icon>
                <v-btn
                    :to="item.route"
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
              </v-list-item-icon>

            </v-list-item>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>


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
