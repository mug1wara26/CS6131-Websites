<template>
  <v-container fluid>

    <v-btn v-if="!isPublic" color="green" @click="create = true" :disabled="teams.length >= 10 || !loaded">
      Create
      <v-icon class="ml-1">group_add</v-icon>
    </v-btn>

    <v-btn color="primary" class="ml-3" to="/search?q=teams">
      Search
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn v-if="isPublic" color="green" class="ml-3">
      Invite
      <v-icon class="ml-1">group_add</v-icon>
    </v-btn>

    <p v-if="teams.length === 0 && loaded && !isPublic" class="text-center">You are not part of any teams, consider
      creating one or searching for one to join</p>
    <p v-if="teams.length === 0 && loaded && isPublic" class="text-center">This user is not part of any teams</p>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>

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

    <v-dialog
        v-model="create"
        width="400"
    >
      <CreateTeamDialog
          :teamsProp="teams"
          @close-dialog="create = false"
          @on-create="(team) => onCreate(team)"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {getUserTeams} from "@/api/teamApi";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import TeamSearchCard from "@/components/SearchCards/TeamSearchCard.vue";
import CreateTeamDialog from "@/components/Dialogs/CreateTeamDialog.vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";

export default Vue.extend({
  name: "MyTeams",
  props: {
    'user': BasicUser,
  },
  components: {CreateTeamDialog, TeamSearchCard},
  data() {
    return {
      teams: [] as Array<Team>,
      create: false,
      loaded: false,
      isPublic: true
    }
  },
  methods: {
    onCreate(team: Team) {
      if (this.teams.length === 0) this.teams.push(team)
      else {
        for (const key in this.teams) {
          if (this.teams[key].name.localeCompare(team.name) > 0) {
            this.teams.splice(parseInt(key), 0, team)
            break
          }
          if (parseInt(key) === this.teams.length - 1) this.teams.push(team)
        }
      }
    }
  },
  created() {
    getUserTeams(this.user.username).then(res => {
      if(res.status === 200) {
        res.json().then(data => {
          this.teams = data.teams
          this.isPublic = data.isPublic
          this.loaded = true
        })
      }
    });
  }
});
</script>