<template>
  <v-container fluid class="flex-column align-center d-flex mt-8">
    <h1> Organise your CTF experience</h1>
    <i>For the regular CTF player who loses track of the challenges they are working on</i>
    <ul class="mt-2">
      <b>Features:</b>
      <li>Collaborative note taking</li>
      <li>Order challenges by points, category or difficulty</li>
      <li>Markdown rendering with syntax highlighting</li>
    </ul>

    <v-row class="mt-4 justify-center d-flex">
      <v-btn color="primary" class="mr-4 mb-2" to="/search">
        Search
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn outlined class="mr-4 mb-2" @click="register = true">
        Register
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <v-btn color="secondary" class="mr-4 mb-2" to="/search">
        Feedback
        <v-icon class="ml-1">mdi-message-alert-outline</v-icon>
      </v-btn>
    </v-row>

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
