<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <div v-else-if="canView">
      <v-row class="d-flex align-center">
        <v-col cols="1" v-if="canCreate">
          <v-btn color="green" @click="create = true" :disabled="challenges.length >= 100 || !loaded">
            Create
            <v-icon class="ml-1">mdi-plus</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="1">
          <v-autocomplete
              auto-select-first
              hide-no-data
              v-model="orderBy"
              :items="orderItems"
              label="Order by"
          />
        </v-col>

        <v-col cols="1">
          <v-autocomplete
              auto-select-first
              hide-no-data
              v-model="sortBy"
              :items="sortItems"
              label="Order by"
              :append-outer-icon="ascending ? 'mdi-arrow-down' : 'mdi-arrow-up'"
              @click:append-outer="ascending = !ascending"
          />
        </v-col>
        <!-- This is just here to center align the next v-col -->
        <v-col :cols="canCreate ? 2 : 3"/>
        <v-col cols="2">
          <v-text-field autofocus v-model="search" prepend-icon="mdi-magnify" label="Search"></v-text-field>
        </v-col>
      </v-row>

      <p v-if="challenges.length === 0 && loaded" class="d-flex justify-center">This CTF has no challenges</p>


      <v-row v-if="orderBy === 'Name' || orderBy === 'Points'" class="mt-2">
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

      <v-expansion-panels v-else accordion multiple flat :value="[...Array(orderPanels.length).keys()]">
        <v-expansion-panel
            v-for="(panelTitle, i) in orderPanels.filter(panel => orderedChals[panel].length !== 0)"
            :key="i"
        >
          <v-expansion-panel-header :color="expansionPanelColor">{{panelTitle}}</v-expansion-panel-header>
          <v-expansion-panel-content :color="expansionPanelColor">
            <v-row class="mt-2">
              <v-col lg="10" sm="12">
                <v-row>
                  <v-col cols="12" lg="4" md="8"
                         v-for="(item, index) in orderedChals[panelTitle]"
                         :key="index">
                    <ChallengeSearchCard :item="item"/>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-content>

          <v-divider v-if="i !== orderPanels.length - 1"/>
        </v-expansion-panel>
      </v-expansion-panels>


      <v-dialog
          v-model="create"
          width="400"
      >
        <CreateChallengeDialog
            :chals="challenges"
            :ctf="ctf"
            @close-dialog="create = false"
            @chal-created="(chal) => challenges.push(chal)"
        />
      </v-dialog>
    </div>
    <div v-else class="d-flex justify-center">
      <v-btn color="green" @click="compete = true" :disabled="!canCompete">Compete</v-btn>

      <v-dialog
          v-model="compete"
          width="400"
      >
        <CompeteDialog
            :teams="teams"
            @close-dialog="compete = false"
            @compete="(teamName) => onCompete(teamName)"
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
import * as ctfApi from "@/api/ctfApi";
import * as teamApi from "@/api/teamApi"
import CreateChallengeDialog from "@/components/Dialogs/CreateChallengeDialog.vue";
import ChallengeSearchCard from "@/components/SearchCards/ChallengeSearchCard.vue";
import {getFromLocalStorage, setLocalStorage} from "@/api/api";
import CompeteDialog from "@/components/Dialogs/CompeteDialog.vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "CTFChallenges",
  components: {CompeteDialog, CreateChallengeDialog, ChallengeSearchCard},
  props: {
    'ctf': CTF,
    'user': BasicUser
  },
  data() {
    return {
      create: false,
      loaded: false,
      challenges: [] as Array<BasicChallenge>,
      teams: [] as Array<Team>,
      search: '',
      orderBy: 'Category',
      orderItems: ['Category', 'Difficulty'],
      sortBy: 'Points',
      sortItems: ['Points', 'Name'],
      panelModel: [] as Array<number>,
      ascending: true,
      canCreate: false,
      canView: false,
      compete: false
    }
  },
  computed: {
    searchedChals(): Array<BasicChallenge> {
      return [...this.challenges].filter(chal => chal.name.toLowerCase().includes(this.search.toLowerCase()))
    },
    sortedChals(): Array<BasicChallenge> {
      let sortedChals = [] as Array<BasicChallenge>;
      if (this.sortBy === 'Name') {
        sortedChals = [...this.searchedChals].sort((a,b) => {
          return a.name.localeCompare(b.name)
        })
      }
      if (this.sortBy === 'Points') {
        sortedChals = [...this.searchedChals].sort((a,b) => {
          return a.points - b.points
        })
      }

      if (!this.ascending) sortedChals.reverse()

      return sortedChals
    },
    expansionPanelColor(): string {
      return this.$vuetify.theme.dark ? '#121212' : 'white'
    },
    orderPanels(): Array<string> {
      // This is to preserve the order of difficulties
      const cats = ['Web', 'Crypto', 'Forensics', 'Misc', 'OSINT', 'Reverse Engineering', 'Pwn'].sort()
      const diffs = ['Easy', 'Medium', 'Hard', 'Insane']

      for (const key in this.challenges) {
        const chal = this.challenges[key]

        if (chal.category && !cats.includes(chal.category)) cats.push(chal.category);
        if (chal.difficulty && !diffs.includes(chal.difficulty)) diffs.push(chal.difficulty)
      }

      // Use this instead of ternary in case need to add more in future
      const panels = {
        'Category': cats,
        'Difficulty': diffs,
      } as Record<string,Array<string>>

      return panels[this.orderBy]
    },
    orderedChals(): Record<string,Array<BasicChallenge>> {
      const orderedChals = {} as Record<string, Array<BasicChallenge>>
      this.orderPanels.forEach(panel => {
        if (this.orderBy === 'Category') orderedChals[panel] = this.sortedChals.filter(chal => chal.category === panel)
        if (this.orderBy === 'Difficulty') orderedChals[panel] = this.sortedChals.filter(chal => chal.difficulty === panel)
      })

      return orderedChals
    },
    canCompete(): boolean {
      return this.teams.length > 0
    }
  },
  methods: {
    onCompete(teamName: string) {
      ctfApi.compete(this.ctf?.id, teamName).then(val => {
        if (val) {
          this.canView = true;
          this.loaded = false;
          this.getChals()
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Error competing in CTF', alertText: 'Please try again later'})
      })
    },
    getChals() {
      ctfApi.getCTFChals(this.ctf.id).then(res => {
        if (res.status === 200) res.json().then(data => {
          if (data.challenges.length > 0) {
            this.challenges = data.challenges as Array<BasicChallenge>
            setLocalStorage(`${this.ctf?.id}_chals`, JSON.stringify(data.challenges))
          }

          this.canView = data.canView
          this.canCreate = data.isMember
          this.loaded = true

          if (!data.canView) {
            teamApi.getUserTeams(this.user?.username).then(res => {
              if (res.status === 200) {
                res.json().then(data => {
                  this.teams = data.teams
                })
              }
            })
          }
        })
        else {
          this.$root.$emit('alert', {alertType: 'error', alertTitle: `Error ${res.status}`, alertText: res.statusText})
        }
      })
    }
  },
  created() {
    const chals = getFromLocalStorage(`${this.ctf?.id}_chals`)
    if (chals) {
      this.challenges = chals;
      this.loaded = true;
      this.canView = true
    }

    this.getChals()
  }
});
</script>