<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="2">
    <v-card-title> <a @click="$router.push({path: `users/${item.uid}`})"> {{ item.name }} </a></v-card-title>
    <v-card-text>
      <p class="font-weight-medium d-inline"> {{ item.bio }} </p>
      <p class="font-weight-thin font-italic">{{ item.email }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "UserSearchCard",
  props: ['item']
});
</script>
