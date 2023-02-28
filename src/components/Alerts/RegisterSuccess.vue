<template>
  <v-alert
      type="success"
      title="Registered Successfully"
      text
      :width="width"
      :value="value"
      transition="slide-y-transition"
  >
    <h3>Register Success</h3>
    Welcome, {{username}}
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RegisterSuccess",
  props: ['username', 'value', 'width']
});
</script>