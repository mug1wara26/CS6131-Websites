<template>
  <v-card>
    <v-card-title>Warning</v-card-title>
    <v-card-text>Upon joining this team, you will no longer be able to compete and solve challenges in any CTFs made by this team.</v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="onClose">Cancel</v-btn>
      <v-spacer/>
      <v-btn color="green" @click="onRequest" :disabled="requestDisabled">Request to join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "RequestWarningDialog",
  data() {
    return {
      requestDisabled: false
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
    },
    onRequest() {
      this.requestDisabled = true
      this.$emit('request')
    }
  }
})
</script>