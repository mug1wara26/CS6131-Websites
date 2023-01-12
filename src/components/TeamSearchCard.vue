<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="2">
    <v-card-title> <a> {{ item.name }} </a></v-card-title>
    <v-card-text>
      {{ item.users.length }} Member{{item.users.length === 1 ? '' : 's'}}
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
