<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title style="word-break: break-word"> <a :href="`/writeups/${item.id}`"> {{ item.title }} </a> </v-card-title>
    <v-card-subtitle>{{item.votes}} Votes</v-card-subtitle>
    <v-card-text>
      <span v-if="item.ctfid"><a :href="`/ctfs/${item.ctfid}`">View CTF</a></span> <br/>
      <span v-if="item.chalName">Challenge: {{item.chalName}}</span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "WriteUpSearchCard",
  props: ['item']
});
</script>
