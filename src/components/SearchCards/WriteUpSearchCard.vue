<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a> {{ item.name }} </a> </v-card-title>
    <v-card-text>
      CTF: {{item.ctfName}} <br/>
      Author: <a> {{ item.author }} </a> <br/>
      Category: {{ item.category }}
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
