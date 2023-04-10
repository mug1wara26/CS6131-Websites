<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <v-col cols="5">
        <v-data-table
            :items="leaderboard"
            :headers="header"
            :loading="!loaded"
            :no-data-text="noDataText"
        >
          <template v-slot:[`item.teamName`]="{ item }">
            <a @click="onClickRow(item.teamName)">{{item.teamName}}</a>
          </template>
          <template v-slot:top>
            <v-switch
                v-if="selectedTeam === ''"
                v-model="teamLeaderboardSelect"
                :label="teamLeaderboardSelect ? 'Team Leaderboard' : 'User Leaderboard'"
                class="pa-3"
            />
            <v-btn v-else icon class="ml-3 mt-3" @click="onClickBack"><v-icon>mdi-arrow-left</v-icon></v-btn>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {CTF, TeamLeaderboard, TeamUserLeaderboard, UserLeaderboard} from "../../../cs6131-backend/types/ctfTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import * as ctfApi from "@/api/ctfApi"

export default Vue.extend({
  name: "Leaderboard",
  props: {
    'ctf': CTF,
    'user': BasicUser
  },
  data() {
    return {
      teamLeaderboard: [] as Array<TeamLeaderboard>,
      userLeaderboard: [] as Array<UserLeaderboard>,
      teamUserLeaderboard: [] as Array<TeamUserLeaderboard>,
      teamLeaderboardHeader: [
        {text: 'Position', value: 'index', width: '20%'},
        {text: 'Team', value: 'teamName'},
        {text: 'Points', value: 'total'}
      ],
      userLeaderboardHeader: [
        {text: 'Position', value: 'index', width: '20%'},
        {text: 'Username', value: 'username'},
        {text: 'Team', value: 'teamName'},
        {text: 'Points', value: 'total'}
      ],
      teamUserLeaderboardHeader: [
        {text: 'Position', value: 'index', width: '20%'},
        {text: 'Username', value: 'username'},
        {text: 'No. Solves', value: 'num_solves'},
        {text: 'Points', value: 'total'}
      ],
      teamLeaderboardLoaded: false,
      userLeaderboardLoaded: false,
      teamUserLeaderboardLoaded: false,
      selectedTeam: '',
      teamLeaderboardSelect: true,
      hasAccess: true,
    }
  },
  computed: {
    loaded(): boolean {
      if (this.selectedTeam === '') return this.teamLeaderboardLoaded && this.userLeaderboardLoaded
      else return this.teamUserLeaderboardLoaded
    },
    leaderboard(): Array<TeamLeaderboard | UserLeaderboard | TeamUserLeaderboard> {
      if (this.selectedTeam === '') return this.teamLeaderboardSelect ? this.teamLeaderboard : this.userLeaderboard
      else return this.teamUserLeaderboard
    },
    header(): Array<Object> {
      if (this.selectedTeam === '') return this.teamLeaderboardSelect ? this.teamLeaderboardHeader : this.userLeaderboardHeader
      else return this.teamUserLeaderboardHeader
    },
    noDataText(): string {
      if (this.selectedTeam === '') return 'No Data Available'
      else if (this.hasAccess) return 'No Data Available'
      else return 'This team is private'
    }
  },
  methods: {
    onClickRow(teamName: string) {
      if (this.selectedTeam === '') {
        this.selectedTeam = teamName
        this.teamUserLeaderboardLoaded = false
        ctfApi.getTeamUserLeaderboard(this.ctf.id, this.selectedTeam).then(res => {
          if (res.status === 200) res.json().then(data => {
            this.hasAccess = data.hasAccess
            this.teamUserLeaderboard = data.leaderboard
            this.teamUserLeaderboardLoaded = true
          })
        })
      }
    },
    onClickBack() {
      this.selectedTeam = ''
    }
  },
  mounted() {
    ctfApi.getLeaderboard<TeamLeaderboard>('teamLeaderboard', this.ctf.id).then(leaderboard => {
      this.teamLeaderboard = leaderboard
      this.teamLeaderboardLoaded = true
    })
    ctfApi.getLeaderboard<UserLeaderboard>('userLeaderboard', this.ctf.id).then(leaderboard => {
      this.userLeaderboard = leaderboard
      this.userLeaderboardLoaded = true
    })
  }
});
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>