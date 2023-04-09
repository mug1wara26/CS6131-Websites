<template>
  <v-card>
    <v-card-title class="justify-center">{{username}}</v-card-title>
    <v-card-text class="text-center">
      <v-btn color="error" class="mt-4" @click="kickUser" :loading="kickUserLoading">Kick User</v-btn> <br/>
      <v-btn color="error" class="mt-4" @click="transferOwner" :loading="transferOwnerLoading">Transfer Ownership</v-btn> <br/>
      <v-btn color="warning" class="mt-8" @click="onClose">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import * as teamApi from "@/api/teamApi"

export default Vue.extend({
  name: "MemberInfoDialog",
  props: {
    username: String,
    teamName: String
  },
  data() {
    return {
      transferOwnerLoading: false,
      kickUserLoading: false
    }
  },
  methods: {
    transferOwner() {
      this.transferOwnerLoading = true
      teamApi.transferOwner(this.teamName, this.username).then(val => {
        if (val) {
          this.transferOwnerLoading = false
          this.$root.$emit('alert', {alertType: 'success', alertTitle: `Successfully transferred ownership to ${this.username}`})
          this.$root.$emit('re-render')
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})

        this.onClose()
      })
    },
    kickUser() {
      this.kickUserLoading = true
      teamApi.kickUser(this.teamName, this.username).then(val => {
        if (val) {
          this.kickUserLoading = false
          this.$root.$emit('alert', {alertType: 'success', alertTitle: `Successfully kicked ${this.username}`})
          this.$emit('kick-user', this.username)
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})

        this.onClose()
      })
    },
    onClose() {
      this.transferOwnerLoading = false
      this.kickUserLoading = false
      this.$emit('close-dialog')
    }
  }
})
</script>