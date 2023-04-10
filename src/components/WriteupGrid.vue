<template>
  <v-row class="mt-2">
    <v-col lg="10" sm="12">
      <v-row>
        <v-col cols="12" lg="6" md="6"
               v-for="(item, index) in items"
               :key="index">
          <WriteUpSearchCard :item="item"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import WriteUpSearchCard from "./SearchCards/WriteUpSearchCard.vue";

export default Vue.extend({
  name: "WriteupGrid",
  components: {WriteUpSearchCard},
  props: ['items']
})
</script>