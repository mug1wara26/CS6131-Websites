<template>
  <v-container fluid>
    <v-progress-circular v-if="loading" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!teamExists">Team Does not Exist</p>
    <v-container v-else>
      <p>{{team.name}} page</p>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Team} from "../../cs6131-backend/types/teamTypes";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {getCookie} from "typescript-cookie";
import {getTeam} from "@/api/teamApi";

export default Vue.extend({
  name: "Team",
  data() {
    return {
      team: {} as Team,
      user: {} as BasicUser,
      loading: true,
    }
  },
  computed: {
    teamExists(): boolean {
      return Object.keys(this.team).length !== 0
    }
  },
  created() {
    const name = this.$route.params.teamName;
    if (name) {
      onLogin(async (err: AlertData, user: BasicUser) => {
        if (err) {this.$emit('alert', err); this.loading = false;}
        if (Object.keys(user).length !== 0) this.user = user
        const token = getCookie('token')
        getTeam(name, token).then(team => {this.team = team;this.loading = false;})
      })
    }
  }
});
</script>