<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a :href="`/teams/${item.name}`"> {{ item.name }} </a></v-card-title>
    <v-card-text>
      <p>Owner: <b><a :href="`/users/${item.owner}`">{{item.owner}}</a></b></p>
      <p class="text-truncate">{{ item.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TeamSearchCard",
  props: ['item'],
});
</script>

<style>
a {
  text-decoration: none;
}
</style>