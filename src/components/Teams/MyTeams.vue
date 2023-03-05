<template>
  <v-container fluid>
    <v-row>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {getUserTeams} from "@/api/teamApi";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import TeamSearchCard from "@/components/SearchCards/TeamSearchCard.vue";

export default Vue.extend({
  name: "MyTeams",
  components: {TeamSearchCard},
  data() {
    return {
      teams: [] as Array<Team>,
    }
  },
  created() {
    getUserTeams().then(data => {
      this.teams = data
    });
  }
});
</script>