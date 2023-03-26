<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a :href="`/ctfs/${item.id}`"> {{ item.name }} </a> <span v-if="!item.public" class="font-weight-light text-subtitle-1">&nbsp;(private)</span> </v-card-title>
    <v-card-text>
      Date: {{ new Date(item.date*1000).toLocaleString() }} <br/>
      Format: {{ item.format }} <br/>
      Location: {{ item.location }} <br/>
      <a v-bind:href="item.link">{{item.link}}</a>
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
