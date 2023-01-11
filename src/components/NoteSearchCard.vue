<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="2" color="#AED5EA">
    <v-card-title> <a> {{ item.name }} </a> </v-card-title>
    <v-card-text>
      Category: {{ item.category }} <br/>
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
