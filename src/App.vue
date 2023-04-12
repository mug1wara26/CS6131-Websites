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

        <v-btn text class="ml-auto mr-2" @click="toggleDark">
          <v-icon v-if="this.$vuetify.theme.dark">
            mdi-lightbulb-on
          </v-icon>
          <v-icon v-else>
            mdi-lightbulb-off
          </v-icon>
        </v-btn>
        <v-btn v-if="userExists" text class="mr-2" to="/users">
          <v-icon>
            mdi-account
          </v-icon>
        </v-btn>

        <v-btn v-if="!userExists" outlined @click="login=true" class="mr-2">
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

      <template v-slot:append v-if="userExists">
        <div class="pa-2">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  text
                  auto-height
                  depressed
                  rounded
                  v-bind="attrs"
                  v-on="on"
                  @click="logout"
              >
                <v-icon>
                  mdi-logout
                </v-icon>
              </v-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>


    <v-dialog
        v-model="register"
        width="400"
    >
      <register-dialog
          @close-dialog="register=false"
          @open-login="login=true"
          @register-success="(data) => {onRegister(data.username, data.password, data.displayName)}"
          @register-error="(err) => {showAlert('error', 'Register Error', err)}"
      />
    </v-dialog>

    <v-dialog
        v-model="login"
        width="400"
    >
      <login-dialog
          @close-dialog="login=false"
          @open-register="register=true"
          @login-success="onLogin"
          @login-error="(err) => {showAlert('error', 'Login Error', err)}"
      />
    </v-dialog>

    <v-main>
      <v-container class="d-flex justify-center">
        <Alert v-if="alertShown !== ''"
               :type="alertShown"
               :value="alertShown !== ''"
               :width="alertWidth"
               :title="alertTitle"
               :text="alertText"
        />
      </v-container>
      <v-container fluid :key="reRender">
        <router-view
            :key="$route.fullPath"
            @open-register="register=true"
            @open-login="login=true"
            @alert="(alertData) => showAlert(alertData.alertType, alertData.alertTitle, alertData.alertText)"
            @leave="onLeave"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import RegisterDialog from "@/components/Dialogs/RegisterDialog.vue";
import LoginDialog from "@/components/Dialogs/LoginDialog.vue";
import Alert from "@/components/Alerts/Alert.vue";
import {BasicUser} from "../cs6131-backend/types/userTypes";
import {login, onLogin} from "@/api/userApi";
import {removeCookie, setCookie} from "typescript-cookie";
import {AlertData} from "@/schemas/alertData";


if (process.env.NODE_ENV === 'production') {
  console.log("Running in production")
  Vue.prototype.$apilink = 'https://mug1wara26.app.wern.cc';
} else {
  console.log("Running locally")
  Vue.prototype.$apilink = 'http://localhost:3000'
}


export default Vue.extend({
  name: 'App',
  components: {Alert: Alert, LoginDialog, RegisterDialog},
  data() {
    return {
      user: {} as BasicUser,
      alertTitle: "",
      alertText: "",
      alertShown: "",
      drawer: false,
      register: false,
      login: false,
      windowWidth: window.innerWidth,
      reRender: 0,
    }
  },
  computed: {
    userExists(): boolean {
      return Object.keys(this.user).length !== 0;
    },
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
    },
    alertWidth(): string {
      return (this.windowWidth * 0.3 >= 300) ? '30%' : '100%'
    }
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      window.localStorage.setItem("dark", this.$vuetify.theme.dark.toString())
    },
    showAlert(alertType: string, alertTitle: string, alertText: string) {
      this.alertTitle = alertTitle;
      this.alertText = alertText;
      this.alertShown = alertType;
      setTimeout(() => {
        this.alertShown = ""
      }, 3000)
    },
    onRegister(username: string, password: string, displayName: string) {
      login(username, password).then(res => {
        setCookie('token', res, {sameSite: "lax", path: '/'});
        this.onLogin();
        this.showAlert('success', 'Register Successful', `Welcome ${displayName}`)
      }).catch(() => {
        this.showAlert("error", "Login Error", "Please try logging in again")
      })
    },
    onLogin() {
      onLogin((err: AlertData, user: BasicUser) => {
        if (err) this.showAlert(err.alertType, err.alertTitle, err.alertText);
        else {
          this.user = user;
          this.reRender++; // Re-renders router view so that user login is reflected.
        }
      })
    },
    logout() {
      removeCookie('token', {path: '/'})
      this.user = {} as BasicUser
      this.$router.push({ path: '/home' })
      this.reRender++
    },
    onLeave() {
      this.$router.push({ path: '/teams' })
    },
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    }
    onLogin((err: AlertData, user: BasicUser) => {
      if (err) this.showAlert(err.alertType, err.alertTitle, err.alertText)
      else this.user = user;
    })
  },
  created() {
    this.$root.$on('alert', (alertData: AlertData) => {
      this.showAlert(alertData.alertType, alertData.alertTitle, alertData.alertText)
    })
    this.$root.$on('account-delete', () => {
      this.showAlert('success', 'Account deleted successfully', '')
      this.user = {} as BasicUser
      this.reRender++
    })
    this.$root.$on('re-render', () => {
      this.reRender++
    })
  },
});
</script>
