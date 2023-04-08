<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <v-row v-else class="d-flex justify-center">
      <v-col v-if="isOwner" xl="3" lg="4" cols="6">
        <v-card>
          <v-card-text>
            <v-row class="d-flex justify-center">
              <v-col :cols="9">
                <v-select v-model="selected" :items="items"/>
              </v-col>
            </v-row>

            <v-divider/>

            <p v-if="users.length === 0" class="text-center mt-4"> No {{selected}} Users</p>
            <template v-else v-for="(item, index) in users">
              <v-list-item :key="item">
                <v-list-item-content>
                  <v-list-item-title> <a :href="`/users/${item}`">{{item}}</a> </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row class="d-flex justify-end mr-1">
                    <v-col cols="4">
                      <v-btn icon :disabled="selected!=='Requesting'"><v-icon v-if="selected==='Requesting'">mdi-check</v-icon></v-btn>
                    </v-col>
                    <v-col cols="4">
                      <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-list-item>

              <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
              ></v-divider>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col xl="9" lg="8" cols="6">
        <v-data-table
            :items="memberStats"
            :headers="headers"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {MemberStat, Team} from "../../../cs6131-backend/types/teamTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import * as teamApi from "@/api/teamApi"

export default Vue.extend({
  name: "TeamMembers",
  props: {
    'team': Team,
    'user': BasicUser,
  },
  data() {
    return {
      getMemberStatsLoaded: false,
      getRequestedUsersLoaded: false,
      getInvitedUsersLoaded: false,
      memberStats: [] as Array<MemberStat>,
      headers: [
        {text: 'Member', value: 'username'},
        {text: 'No. Competing', value: 'num_competing'},
        {text: 'No. Solves', value: 'num_solves'},
        {text: 'Total Points', value: 'total_points'}
      ],
      items: ['Requesting', 'Invited'],
      selected: 'Requesting',
      requestedUsers: [] as Array<string>,
      invitedUsers: [] as Array<string>,
    }
  },
  computed: {
    isOwner(): boolean {
      return this.team?.owner === this.user?.username
    },
    loaded(): boolean {
      return this.isOwner ? (this.getInvitedUsersLoaded && this.getRequestedUsersLoaded) : this.getMemberStatsLoaded
    },
    users(): Array<string> {
      return this.selected === 'Requesting' ? this.requestedUsers : this.invitedUsers
    }
  },
  created() {
    teamApi.getMemberStats(this.team.name).then(data => {
      this.memberStats = data
      if (this.isOwner) {
        teamApi.getRequestedUsers(this.team.name).then(users => {
          this.requestedUsers = users.map(user => user.username)
          this.getRequestedUsersLoaded = true
        })
        teamApi.getInvitedUsers(this.team.name).then(users => {
          this.invitedUsers = users.map(user => user.username)
          this.getInvitedUsersLoaded = true
        })
      }
      else this.getMemberStatsLoaded = true
    }).catch(res => {
      this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: res.statusText})
    })
  }
});
</script>