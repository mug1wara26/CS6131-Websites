<template>
  <div>
    <v-card>
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        Note: Logging in does nothing as of now <br/>
        <a @click="openRegister">Don't have an account?</a>
        <v-text-field label="Email*" required/>
        <v-text-field label="Password*" required/>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" left @click.stop="close">Close</v-btn>

        <v-spacer/>

        <v-btn color="primary" right @click.stop="close">Login</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  methods: {
    close(){
      this.$emit('close-dialog')
    },
    openRegister() {
      this.$emit('close-dialog')
      this.$emit('open-register')
    }
  }
})
</script>
