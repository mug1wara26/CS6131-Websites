<template>
  <v-container fluid>
    <!-- TODO: Do not display if user is not part of team that created it -->
    <v-row class="d-flex align-center">
      <v-col cols="5">
        <v-btn color="green" @click="create = true" :disabled="challenges.length >= 10 || !loaded">
          Create
          <v-icon class="ml-1">add</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-text-field autofocus v-model="search" prepend-icon="mdi-magnify" label="Search"></v-text-field>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {Challenge} from "../../../cs6131-backend/types/chalTypes";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import {getUserTeams} from "@/api/teamApi";

export default Vue.extend({
  name: "CTF Challenges",
  props: {
    'ctf': CTF,
    'user': BasicUser
  },
  data() {
    return {
      create: false,
      loaded: false,
      challenges: [] as Array<Challenge>,
      userTeams: [] as Array<Team>,
      search: ''
    }
  },
  computed: {
    canCompete(): boolean {
      return this.ctf?.public || this.userTeams.filter(team => this.ctf?.teamCreator === team.name).length > 0
    }
  },
  created() {
    getUserTeams(this.user?.username).then(teams => {
      this.userTeams = teams
    })
  }
});
</script>