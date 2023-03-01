<template>
  <div>
    <v-card>
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        Note: Logging in does nothing as of now <br/>
        <a @click="openRegister">Don't have an account?</a>
        <v-form ref="form">
          <v-text-field autofocus v-model="user.username" label="Username*" required/>
          <v-text-field v-model="user.password" label="Password*" required type="password"/>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" left @click="close">Close</v-btn>

        <v-spacer/>

        <v-btn
            color="primary"
            right
            @click="login"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {login} from "@/api";

export default Vue.extend({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      loading: false
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.user).every((val) => val != '')
    }
  },
  methods: {
    onClose(){
      this.$emit('close-dialog')
    },
    openRegister() {
      this.$emit('close-dialog')
      this.$emit('open-register')
    },
    login() {
      this.loading = true;
      login(this.user.username, this.user.password).then(res => console.log(res))
    }
  }
})
</script>
