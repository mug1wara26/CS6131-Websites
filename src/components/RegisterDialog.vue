<template>
  <div>
    <v-card>
      <v-card-title>
        Register
      </v-card-title>

      <v-card-text>
        Note: Registering does nothing as of now
        <a @click="openLogin">Already have an account?</a>
        <v-text-field label="Username*" required/>
        <v-text-field label="Email*" required/>
        <v-text-field label="Password*" required/>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" left @click.stop="close">Close</v-btn>

        <v-spacer/>

        <v-btn color="primary" right @click.stop="close">Register</v-btn>
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
    openLogin() {
      this.$emit('close-dialog')
      this.$emit('open-login')
    }
  }
})
</script>
