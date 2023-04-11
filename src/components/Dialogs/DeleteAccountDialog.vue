<template>
  <v-card>
    <v-card-title>
      Delete Account
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete your account? Please type your username "<b>{{username}}</b>" below to confirm account deletion
      <v-text-field label="Username" v-model="deleteUsername"/>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click.stop="onClose">Close</v-btn>
      <v-spacer/>
      <v-btn color="error" @click.stop="deleteAccount" :disabled="deleteUsername !== username" :loading="loading">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import * as userApi from "@/api/userApi"
import {removeCookie} from "typescript-cookie";

export default Vue.extend({
  name: "DeleteAccountDialog",
  props: ["username"],
  data() {
    return {
      deleteUsername: '',
      loading: false
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
      this.deleteUsername = ''
      this.loading = false
    },
    deleteAccount() {
      this.loading = true;
      userApi.deleteAccount(this.username).then(val => {
        if (val) {
          removeCookie('token', {path:'/'})
          this.$router.push({ path: '/home' })
          this.$root.$emit('account-delete')
        }
        else {
          this.onClose()
          this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Error deleting account', alertText: "Please try again later"})
        }
      })
    }
  }
})
</script>