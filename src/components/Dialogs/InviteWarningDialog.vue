<template>
  <v-card>
    <v-card-title>Warning</v-card-title>
    <v-card-text>If this user joins your team, they will be able to see all private CTFs in your team.</v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="onClose">Cancel</v-btn>
      <v-spacer/>
      <v-btn color="green" @click="onInvite" :disabled="inviteDisabled">Invite to team</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "InviteWarning",
  data() {
    return {
      inviteDisabled: false
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
    },
    onInvite() {
      this.inviteDisabled = true
      this.$emit('invite')
    }
  }
})
</script>