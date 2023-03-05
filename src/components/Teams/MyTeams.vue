<template>
  <v-container fluid>
    My Teams Page
    {{user}}
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {getUserTeams} from "@/api/teamApi";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";

export default Vue.extend({
  name: "MyTeams",
  props: {
    userObject: Object,
  },
  data() {
    return {
      user: {} as BasicUser
    }
  },
  created() {
    this.user = this.userObject as BasicUser
    getUserTeams(this.user.username).then(data => {
      console.log(data);
    });
  }
});
</script>