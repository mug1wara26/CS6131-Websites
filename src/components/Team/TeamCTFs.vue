<template>
  <v-container fluid>
    <v-btn color="green" @click="create = true" :disabled="ctfs.length >= 10 || !loaded || team.owner !== user.username">
      Create
      <v-icon class="ml-1">flag</v-icon>
    </v-btn>

    <v-btn color="primary" class="ml-3" to="/search?q=ctfs">
      Search
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <p v-if="ctfs.length === 0 && loaded" class="d-flex justify-center">You are not part of any ctfs, consider
      creating one or searching for one to join</p>
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


    <v-dialog
        v-model="create"
        width="500"
    >
      <CreateCTFDialog
          :ctfs="ctfs"
          :team="team"
          @close-dialog="create = false"
          @ctf-created="(ctf) => ctfs.push(ctf)"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import CTFSearchCard from "@/components/SearchCards/CTFSearchCard.vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";
import {getTeamCTFs} from "@/api/ctfApi";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import CreateCTFDialog from "@/components/Dialogs/CreateCTFDialog.vue";

export default Vue.extend({
  name: "TeamCTFs",
  props: {
    'team': Team,
    'user': BasicUser
  },
  components: {CreateCTFDialog, 'CTFSearchCard': CTFSearchCard},
  data() {
    return {
      loaded: false,
      ctfs: [] as Array<CTF>,
      create: false
    }
  },
  computed: {
    ctfsSorted(): Array<CTF> {
      return [...this.ctfs].sort((a,b) => a.name.localeCompare(b.name))
    }
  },
  created() {
    getTeamCTFs(this.team.name).then(data => {
      this.ctfs = data;
      this.loaded = true;
    })
  }
});
</script>