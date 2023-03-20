<template>
  <v-container fluid>
    <v-btn color="green" @click="create = true" :disabled="ctfs.length >= 10 || !loaded">
      Create
      <v-icon class="ml-1">group_add</v-icon>
    </v-btn>

    <v-btn color="primary" class="ml-3" to="/search?q=ctfs">
      Search
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <p v-if="ctfs.length === 0 && loaded" class="d-flex justify-center">You are not part of any ctfs, consider
      creating one or searching for one to join</p>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>

    <v-row class="mt-2">
      <v-col lg="10" sm="12">
        <v-row>
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in ctfs"
                 :key="index">
            <CTFSearchCard :item="item"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {ctf} from "../../../cs6131-backend/types/ctfTypes";
import CTFSearchCard from "@/components/SearchCards/CTFSearchCard.vue";

export default Vue.extend({
  name: "TeamCTFs",
  components: {'CTFSearchCard': CTFSearchCard},
  data() {
    return {
      loaded: false,
      ctfs: [] as Array<ctf>,
      create: false
    }
  },
});
</script>

<style scoped>

</style>