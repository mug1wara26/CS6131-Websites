<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a> {{ item.name }} </a> </v-card-title>
    <v-card-subtitle class="font-weight-bold">{{item.category}}</v-card-subtitle>
    <v-card-text>
      Difficulty: {{ item.difficulty }} <br/>
      Points: {{ item.points }}
      <p class="text-truncate">{{ item.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NoteSearchCard",
  props: ['item']
});
</script>
