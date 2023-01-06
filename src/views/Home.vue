<template>
  <v-container fluid>
    <h1> Organise your CTF experience</h1>
    <p>For the regular CTF player who loses track of the challenges they are working on</p>
    Features:
    <ul>
      <li>Collaborative note taking</li>
      <li>Order challenges by points, category or difficulty</li>
      <li>Markdown rending with syntax highlighting</li>
    </ul>

    <v-container class="mt-4">
      <v-btn color="primary" class="mr-4 mb-2" to="/notes">
        Start Now
        <v-icon>mdi-arrow-right-thin</v-icon>
      </v-btn>

      <v-btn color="secondary" class="mr-4 mb-2" to="/search">
        Search
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn outlined class="mr-4 mb-2" @click="register = true">
        Register
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-container>

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

  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import registerDialog from "@/components/RegisterDialog.vue";
import loginDialog from "@/components/LoginDialog.vue";

export default Vue.extend({
  components: {
    registerDialog,
    loginDialog
  },
  data: ()=>({
    register: false,
    login: false,
  })
})
</script>
