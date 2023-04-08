<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <TeamGrid v-if="hasTeams" :teams="teams"/>
    <p v-else>You have not requested to join any teams</p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TeamGrid from "@/components/Teams/TeamGrid.vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import * as teamApi from "@/api/teamApi"

export default Vue.extend({
  name: "RequestingTeams",
  components: {TeamGrid},
  props: {
    user: BasicUser
  },
  data() {
    return {
      teams: [] as Array<Team>,
      loaded: false
    }
  },
  computed: {
    hasTeams(): boolean {
      return this.teams.length !== 0
    }
  },
  created() {
    teamApi.getRequestedTeams(this.user.username).then(teams => {
      this.teams = teams
      this.loaded = true;
    })
  }
});
</script>