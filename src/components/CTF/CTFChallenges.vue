<template>
  <v-container fluid>
    <!-- TODO: Do not display if user is not part of team that created it -->
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <div v-else>
      <v-row class="d-flex align-center">
        <v-col cols="5">
          <v-btn color="green" @click="create = true" :disabled="challenges.length >= 10 || !loaded">
            Create
            <v-icon class="ml-1">mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field autofocus v-model="search" prepend-icon="mdi-magnify" label="Search"></v-text-field>
        </v-col>
      </v-row>

      <p v-if="challenges.length === 0 && loaded" class="d-flex justify-center">This CTF has no challenges</p>


      <v-row class="mt-2">
        <v-col lg="10" sm="12">
          <v-row>
            <v-col cols="12" lg="4" md="8"
                   v-for="(item, index) in sortedChals"
                   :key="index">
              <ChallengeSearchCard :item="item"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>


      <v-dialog
          v-model="create"
          width="400"
      >
        <CreateChallengeDialog
            :chals="challenges"
            :ctf="ctf"
            @close-dialog="create = false"
        />
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import {BasicChallenge} from "../../../cs6131-backend/types/chalTypes";
import {getCTFChals} from "@/api/ctfApi";
import CreateChallengeDialog from "@/components/Dialogs/CreateChallengeDialog.vue";
import ChallengeSearchCard from "@/components/SearchCards/ChallengeSearchCard.vue";

export default Vue.extend({
  name: "CTFChallenges",
  components: {CreateChallengeDialog, ChallengeSearchCard},
  props: {
    'ctf': CTF,
    'user': BasicUser
  },
  data() {
    return {
      create: false,
      loaded: false,
      challenges: [] as Array<BasicChallenge>,
      search: ''
    }
  },
  computed: {
    sortedChals(): Array<BasicChallenge> {
      return [...this.challenges].sort((a,b) => a.name.localeCompare(b.name))
    }
  },
  created() {
    if (this.ctf.public) {
      // TODO: Display CTFs
      // TODO: CTF Dialog
      // TODO: Mark chals as solved
      console.log('public')
    }
    else {
      // CTF is private so we can assume that the user viewing the CTF can create and view all challenges
      // TODO: Display all challenges
      // TODO: Let user create chals
      getCTFChals(this.ctf.id).then(res => {
        if (res.status === 200) res.json().then(data => {
          console.log(data)
          this.challenges = data
          this.challenges = [{name: 'test', ctfid: 'test', difficulty: 'Easy', category: 'Web', points: 100} as BasicChallenge]
          this.loaded = true
        })
        else {
          this.$root.$emit('alert', {alertType: 'error', alertTitle: `Error ${res.status}`, alertText: res.statusText})
        }
      })
    }
  }
});
</script>