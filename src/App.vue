<template>
  <v-app style="background: #6EB3D8">
    <v-app-bar
        app
        clipped-left
        color="primary"
        dark
    >

      <!-- The nav bar icon is only present on mobile, where a temporary overlay will appear on click -->
      <!-- This is not needed on desktop, as there is more than enough space for a mini nav bar-->
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
        CTF Notes
      </v-toolbar-title>

      <v-spacer/>

      <v-btn outlined @click="login=true">
        Login
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>


    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        :temporary.sync="isMobile"
        :permanent.sync="isNotMobile"
        :mini-variant.sync="isNotMobile"
        mini-variant-width="75px"
        color="#1E5471"
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
                <v-icon color="white">
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


    <v-dialog
        v-model="register"
        max-width="300"
    >
      <register-dialog @close-dialog="register=false" @open-login="login=true"/>
    </v-dialog>

    <v-dialog
        v-model="login"
        max-width="300"
    >
      <login-dialog @close-dialog="login=false" @open-register="register=true"/>
    </v-dialog>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import RegisterDialog from "@/components/RegisterDialog.vue";
import LoginDialog from "@/components/LoginDialog.vue";

export default Vue.extend({
  name: 'App',
  components: {LoginDialog, RegisterDialog},
  data: () => ({
    drawer: false,
    register: false,
    login: false,
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
          icon: "mdi-note-multiple",
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
