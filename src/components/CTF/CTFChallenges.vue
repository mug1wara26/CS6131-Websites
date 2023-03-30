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
              @change="resetOrderedChals"
          />
        </v-col>

        <v-col cols="1">
        </v-col>
        <!-- This is just here to center align the next v-col -->
        <v-col cols="2"/>
        <v-col cols="2">
          <v-text-field autofocus v-model="search" prepend-icon="mdi-magnify" label="Search"></v-text-field>
        </v-col>
      </v-row>

      <p v-if="challenges.length === 0 && loaded" class="d-flex justify-center">This CTF has no challenges</p>


      <v-row v-if="orderBy === 'Name'" class="mt-2">
        <v-col lg="10" sm="12">
          <v-row>
            <v-col cols="12" lg="4" md="8"
                   v-for="(item, index) in sortedChalsByName"
                   :key="index">
              <ChallengeSearchCard :item="item"/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-expansion-panels v-else accordion multiple flat :value="[...Array(orderPanels(orderBy).length).keys()]">
        <v-expansion-panel
            v-for="(panelTitle, i) in orderPanels(orderBy)"
            :key="i"
        >
          <v-expansion-panel-header :color="expansionPanelColor">{{panelTitle}}</v-expansion-panel-header>
          <v-expansion-panel-content :color="expansionPanelColor">
            <v-row class="mt-2">
              <v-col lg="10" sm="12">
                <v-row>
                  <v-col cols="12" lg="4" md="8"
                         v-for="(item, index) in filterChalByProperty(orderBy, panelTitle)"
                         :key="index">
                    <ChallengeSearchCard :item="item"/>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-content>

          <v-divider v-if="i !== orderPanels(orderBy).length - 1"/>
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
            @chal-created="(chal) => this.challenges.push(chal)"
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

let orderedChals = [] as Array<BasicChallenge>
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
      orderItems: ['Category', 'Difficulty', 'Points', 'Name'],
      panelModel: [] as Array<number>,
    }
  },
  computed: {
    sortedChalsByName(): Array<BasicChallenge> {
      return [...this.challenges].sort((a,b) => a.name.localeCompare(b.name)).filter(chal => chal.name.toLowerCase().includes(this.search.toLowerCase()))
    },
    expansionPanelColor(): string {
      return this.$vuetify.theme.dark ? '#121212' : 'white'
    }
  },
  methods: {
    orderPanels(orderBy: string) {
      const panels = {
        // Ugly way of getting unique values, array.from is needed to reduce boilerplate when compiling typescript
        'Category': [...Array.from(new Set(this.challenges.filter(chal => chal.category).map(chal => chal.category)))],
        'Difficulty': [...Array.from(new Set(this.challenges.filter(chal => chal.difficulty).map(chal => chal.difficulty)))],
      } as Record<string,Array<string>>

      const panel = panels[orderBy]
      panel.push(`No ${orderBy}`)

      return panel
    },
    filterChalByProperty(property: string, value: string) {
      const filteredChals = {
        'Category': this.challenges.filter(chal => chal.category === value),
        'Difficulty': this.challenges.filter(chal => chal.difficulty === value),
      } as Record<string, Array<BasicChallenge>>

      const chals = filteredChals[property]
      if (chals.length !== 0) {
        orderedChals.push(...chals)
      }
      else {
        return this.challenges.filter(chal=> !orderedChals.map(chal => chal.name).includes(chal.name))
      }

      return chals
    },
    resetOrderedChals() {
      orderedChals = []
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