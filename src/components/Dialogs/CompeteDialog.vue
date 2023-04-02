<template>
  <v-card>
    <v-card-title>
      Compete
    </v-card-title>
    <v-card-text>
      <v-autocomplete label="Compete under" v-model="competingTeam" :items="teamNames" hide-no-data autofocus/>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click.stop="onClose">Close</v-btn>

      <v-spacer/>

      <v-btn
          color="primary"
          @click.stop="compete"
          :loading="loading"
          :disabled="loading || !clean"
      >
        Compete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "CompeteDialog",
  props: {
    teams: Array as PropType<Array<Team>>
  },
  data() {
    return {
      loading: false,
      competingTeam: this.teams[0].name,
      teamNames: this.teams?.map(team => team.name)
    }
  },
  computed: {
    clean(): boolean {
      return this.competingTeam !== ''
    }
  },
  methods: {
    onClose() {
      
    },
    compete() {

    }
  }
})
</script>