<template>
  <v-container fluid v-if="teams.length !== 0">

    <v-btn color="green" @click="create = true" :disabled="teams.length >= 10">
      Create <v-icon class="ml-1">group_add</v-icon>
    </v-btn>

    <v-btn color="primary" class="ml-3" >
      Search <v-icon>mdi-magnify</v-icon>
    </v-btn>

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

export default Vue.extend({
  name: "MyTeams",
  components: {CreateTeamDialog, TeamSearchCard},
  data() {
    return {
      teams: [] as Array<Team>,
      create: false,
    }
  },
  methods: {
    onCreate(team: Team) {
      for (const key in this.teams) {
        console.log(key)
        if (this.teams[key].name.localeCompare(team.name) > 0) {
          this.teams.splice(parseInt(key), 0, team)
          break
        }
        if (parseInt(key) === this.teams.length - 1) this.teams.push(team)
      }
    }
  },
  async created() {
    await getUserTeams().then(data => {
      this.teams = data
    });
  }
});
</script>