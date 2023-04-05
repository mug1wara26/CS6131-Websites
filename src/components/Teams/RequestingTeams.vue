<template>
  <v-container fluid>
    <TeamGrid :teams="teams"/>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TeamGrid from "@/components/Teams/TeamGrid.vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "RequestingTeams",
  components: {TeamGrid},
  props: {
    user: BasicUser
  },
  data() {
    return {
      teams: [] as Array<Team>
    }
  },
  created() {

  }
});
</script>