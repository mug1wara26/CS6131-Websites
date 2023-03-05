<template>
  <v-container fluid>
    <p v-if="name === ''">Team not found</p>
    <p v-else>{{name}} page</p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Team",
  data() {
    return {
      name: ''
    }
  },
  created() {
    const name = this.$route.params.teamName;
    if (name) this.name = name;
  }
});
</script>