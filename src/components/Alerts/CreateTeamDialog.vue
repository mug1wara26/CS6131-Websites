<template>
  <v-card>
    <v-card-title>
      Create Team

    </v-card-title>
    <v-card-text>
      {{ teams.length }}/10 teams
      <v-form ref="form">
        <v-text-field autofocus v-model="name" label="Team Name*"/>

        <v-radio-group v-model="isPrivate">
          <v-radio autofocus label="Public" value="0"/>
          <v-radio label="Private" value="1"/>
        </v-radio-group>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="warning" @click.stop="onClose">Close</v-btn>

      <v-spacer/>

      <v-btn
          color="primary"
          @click.stop="createTeam"
          :loading="loading"
          :disabled="loading || !clean"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "CreateTeamDialog",
  props: {
    teamsProp: Array,
  },
  data() {
    return {
      name: "",
      teams: this.teamsProp as Array<Team>,
      isPrivate: "0",
      loading: false,
    }
  },
  computed: {
    clean(): boolean {
      return this.name !== ''
    }
  },
  methods: {
    onClose() {

    },
    createTeam() {

    }
  }
})
</script>