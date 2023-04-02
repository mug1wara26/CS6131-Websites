<template>
  <v-container fluid>
    <p v-if="ctfs.length === 0 && loaded" class="d-flex justify-center">You are not participating in any CTFs under this team</p>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>

    <v-row class="mt-2">
      <v-col lg="10" sm="12">
        <v-row>
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in ctfsSorted"
                 :key="index">
            <CTFSearchCard :item="item"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import CTFSearchCard from "@/components/SearchCards/CTFSearchCard.vue";
import * as ctfApi from "@/api/ctfApi"

export default Vue.extend({
  name: "TeamParticipate",
  props: {
    'team': Team,
    'user': BasicUser
  },
  components: {CTFSearchCard},
  data() {
    return {
      ctfs: [] as Array<CTF>,
      loaded: false
    }
  },
  computed: {
    ctfsSorted(): Array<CTF> {
      return [...this.ctfs].sort((a,b) => a.name.localeCompare(b.name))
    }
  },
  created() {
    ctfApi.getCompetingCTFs(this.team.name).then(data => {
      this.ctfs = data;
      this.loaded = true;
    })
  }
});
</script>