<template>
  <v-card>
    <v-card-title>{{title}}</v-card-title>
    <v-card-text>{{text}}</v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="onClose">Cancel</v-btn>
      <v-spacer/>
      <v-btn :color="acceptColor" @click="onRequest" :disabled="disabled">{{acceptText}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "GenericWarningDialog",
  props: ['title', 'text', 'acceptText', 'acceptColor'],
  data() {
    return {
      disabled: false
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
    },
    onRequest() {
      this.disabled = true
      this.$emit('accept')
    }
  }
})
</script>