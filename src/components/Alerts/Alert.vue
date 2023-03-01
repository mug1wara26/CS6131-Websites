<template>
  <v-alert
      :type="type"
      text
      :width="width"
      :value="value"
      transition="slide-y-transition"
  >
    <h3>{{title}}</h3>
    {{text}}
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RegisterSuccess",
  props: ['type', 'value', 'width', 'title', 'text']
});
</script>