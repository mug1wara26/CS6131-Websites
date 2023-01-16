<template>
  <v-app>
    <v-app-bar
        app
        clipped-left
    >

      <v-row align="center">
        <!-- The nav bar icon is only present on mobile, where a temporary overlay will appear on click -->
        <!-- This is not needed on desktop, as there is more than enough space for a mini nav bar-->
        <v-app-bar-nav-icon
            v-if="isMobile"
            @click.stop="drawer = !drawer"
            class="mr-auto ml-2"
        />


        <v-toolbar-title
            style="cursor: pointer"
            @click="$router.push('/')"
            class="mr-auto ml-2"
            v-if="isNotMobile"
        >
          CTF Notes
        </v-toolbar-title>

        <v-btn text class="ml-auto" @click="toggleDark">
          <v-icon v-if="this.$vuetify.theme.dark">
            mdi-lightbulb-on
          </v-icon>
          <v-icon v-else>
            mdi-lightbulb-off
          </v-icon>
        </v-btn>

        <v-btn outlined @click="login=true" class="mx-2">
          Login
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </v-row>
    </v-app-bar>


    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        :temporary.sync="isMobile"
        :permanent.sync="isNotMobile"
        :mini-variant.sync="isNotMobile"
        mini-variant-width="75px"
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


    <v-dialog
        v-model="register"
        width="auto"
    >
      <register-dialog @close-dialog="register=false" @open-login="login=true"/>
    </v-dialog>

    <v-dialog
        v-model="login"
        width="auto"
    >
      <login-dialog @close-dialog="login=false" @open-register="register=true"/>
    </v-dialog>

    <v-main>
      <v-container fluid>
        <router-view :key="$route.fullPath"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import RegisterDialog from "@/components/RegisterDialog.vue";
import LoginDialog from "@/components/LoginDialog.vue";
import {setCookie} from "typescript-cookie";

export default Vue.extend({
  name: 'App',
  components: {LoginDialog, RegisterDialog},
  data() {
    return {
      drawer: false,
      register: false,
      login: false,
      windowWidth: window.innerWidth,
    }
  },
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
          name: "Search",
          route: "/search",
          icon: "mdi-magnify",
        },
        {
          name: "User",
          route: "/users",
          icon: "mdi-account",
        },
        {
          name: "Teams",
          route: "/teams",
          icon: "mdi-account-group",
        },
        {
          name: "CTFs",
          route: "/ctfs",
          icon: "mdi-flag",
        },
        {
          name: "Write Ups",
          route: "/writeups",
          icon: "mdi-file-document",
        },
      ];
    },
    isMobile(): boolean {
      return this.windowWidth <= 480
    },

    isNotMobile(): boolean {
      return this.windowWidth > 480
    }
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      setCookie("dark", this.$vuetify.theme.dark)
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    }
  }
});
</script>
