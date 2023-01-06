<template>
  <v-app>
    <v-app-bar
        app
        clipped-left
        color="primary"
        dark
    >

      <!-- The nav bar icon is only present on mobile, where a temporary overlay will appear on click -->
      <!-- This is not needed on desktop, as there is more than enough space for a mini nav bar-->
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        CTF Notes
      </v-toolbar-title>

    </v-app-bar>


    <v-navigation-drawer
        v-model="drawer"
        :permanent.sync="isNotMobile"
        app
        clipped
        :mini-variant.sync="isNotMobile"
        :temporary.sync="isMobile"
        mini-variant-width="100px"
        absolute
    >
      <v-list dense nav>
        <v-tooltip bottom v-for="item in routes" :key="item.name">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item>
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

                <v-list-item-content class="ml-2" v-if="isMobile">
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-btn>

            </v-list-item>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>


    <v-main class="mx-8 my-6">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: 'App',
  data: () => ({
    drawer: false
  }),
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
          name: "Notes",
          route: "/notes",
          icon: "mdi-note-edit",
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

    isMobile(): boolean {
      return screen.width <= 480
    },

    isNotMobile(): boolean {
      return screen.width > 480
    }
  },
});
</script>
