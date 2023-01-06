<template>
  <v-rating
      v-model="value"
      class="text-center"
      background-color="black"
      color="primary"
      empty-icon="mdi-star-outline"
      full-icon="mdi-star"
      half-icon="mdi-star-half-full"
      half-increments
      hover
      length="5"
      size="30"
  ></v-rating>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Rating",
  data:() => ({
    value: 0
  }),
  methods: {
    resetValue() {
      this.value = 0
    }
  },
  created() {
    this.$parent?.$on('reset', this.resetValue)
  }
});
</script>