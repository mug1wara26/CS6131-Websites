<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <TeamGrid v-else-if="hasTeams" :teams="teams"/>
    <p v-else-if="request">You have not requested to join any teams</p>
    <p v-else>You have not been invited to join any teams</p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TeamGrid from "@/components/Teams/TeamGrid.vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import * as teamApi from "@/api/teamApi"

export default Vue.extend({
  name: "InviteRequestTeams",
  components: {TeamGrid},
  props: {
    user: BasicUser,
    request: Boolean
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
    teamApi.getRequestedOrInvitedTeams(this.request ? 'getRequestedTeams' : 'getInvitedTeams', this.user?.username).then(teams => {
      this.teams = teams
      this.loaded = true
    })
  }
});
</script>