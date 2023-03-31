<template>
  <v-container fluid>
    <!-- TODO: Do not display if user is not part of team that created it -->
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <div v-else>
      <v-row class="d-flex align-center">
        <v-col cols="1">
          <v-btn color="green" @click="create = true" :disabled="challenges.length >= 10 || !loaded">
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
        <v-col cols="2"/>
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
      search: '',
      orderBy: 'Category',
      orderItems: ['Category', 'Difficulty'],
      sortBy: 'Points',
      sortItems: ['Points', 'Name'],
      panelModel: [] as Array<number>,
      ascending: true
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

      this.challenges.forEach(chal => {
        if (chal.category && !cats.includes(chal.category)) cats.push(chal.category);
        if (chal.difficulty && !diffs.includes(chal.difficulty)) diffs.push(chal.difficulty)
      })

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
    }
  },
  methods: {
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
          this.challenges = data
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