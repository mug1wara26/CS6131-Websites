<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <v-row v-else class="d-flex justify-center">
      <v-col cols="9">
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
    'user': BasicUser
  },
  data() {
    return {
      loaded: false,
      memberStats: [] as Array<MemberStat>,
      headers: [
        {text: 'Member', value: 'username'},
        {text: 'No. Competing', value: 'num_competing'},
        {text: 'No. Solves', value: 'num_solves'},
        {text: 'Total Points', value: 'total_points'}
      ]
    }
  },
  created() {
    teamApi.getMemberStats(this.team.name).then(data => {
      this.memberStats = data
      this.loaded = true
    }).catch(res => {
      this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: res.statusText})
    })
  }
});
</script>