<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a :href="`/ctfs/${item.ctfid}/${item.name}`"> {{ item.name }} </a> </v-card-title>
    <v-card-subtitle class="font-weight-bold">{{item.category}}</v-card-subtitle>
    <v-card-text>
      {{item.difficulty ? `Difficulty:  ${item.difficulty}` : 'No difficulty'}}<br/>
      {{item.points ? `Points:  ${item.points}` : 'No points'}}<br/>
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
