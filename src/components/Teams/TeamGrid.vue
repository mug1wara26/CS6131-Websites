<template>
  <v-row class="mt-2">
    <v-col lg="10" sm="12">
      <v-row>
        <v-col cols="12" lg="4" md="8"
               v-for="(item, index) in teams"
               :key="index">
          <TeamSearchCard :item="item"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import TeamSearchCard from "@/components/SearchCards/TeamSearchCard.vue";

export default Vue.extend({
  name: "TeamGrid",
  components: {TeamSearchCard},
  props: {
    teams: Array as PropType<Team[]>
  }
})
</script>