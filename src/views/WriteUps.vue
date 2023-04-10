<template>
  <v-container fluid class="pa-12">
    <v-row class="d-flex align-center">
      <v-btn color="green" @click="create = true" :disabled="!loaded">
        Create
        <v-icon class="ml-1">mdi-plus</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "WriteUps",
  data() {
    return {
      create: false,
      loaded: false,
    }
  }
})
</script>
