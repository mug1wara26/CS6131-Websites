<template>
  <v-card>
    <v-card-title>
      Create Team

    </v-card-title>
    <v-card-text>
      {{ teams.length }}/10 teams
      <v-form ref="form">
        <v-text-field autofocus v-model="name" label="Team Name*" :rules="nameRules"/>
        <v-text-field v-model="link" label="Profile Link (optional)"/>
        <v-textarea counter maxlength="200" v-model="description" label="Description (optional)"/>

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
          @click.stop="onCreate"
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
import {BasicTeam, Team} from "../../../cs6131-backend/types/teamTypes";
import {createTeam, teamExists} from "@/api/teamApi";
import {getCookie} from "typescript-cookie";

export default Vue.extend({
  name: "CreateTeamDialog",
  props: {
    teamsProp: Array,
  },
  data() {
    return {
      name: "",
      link: "",
      description: "",
      teams: this.teamsProp as Array<Team>,
      isPrivate: "0",
      loading: false,
      nameRules: [] as Array<Function>,
      existingTeams: [] as Array<string>,
    }
  },
  computed: {
    clean(): boolean {
      return this.name !== ''
    }
  },
  methods: {
    onClose() {
      this.loading = false
      this.nameRules.length = 0;
      this.$emit('close-dialog');
      // Note that we cant just reset the form otherwise it clears the radio group as well
      this.name = ''
      this.description = ''
      this.link = ''
    },
    onCreate() {
      this.loading = true;

      this.nameRules = [
        (v: string | null) => v && v.length <= 32 || 'Max 32 characters',
        (v: string | null) => v && v.length >= 3 || 'Min 3 characters',
        (v: string | null) => v && /^[A-Za-z0-9_\s]*$/.test(v) || 'Team Name can only contain alphanumeric characters, spaces and underscores',
        (v: string | null) => v && !this.existingTeams.includes(v) || 'Team Name exists',
      ];

      teamExists(this.name).then(value => {
        if (value) this.existingTeams.push(this.name)
      }).finally(() => {
        this.$nextTick(() => {
          if((this.$refs.form as Vue & { validate: () => boolean }).validate()) this.createTeam();
          else this.loading = false;
        })
      })
    },
    createTeam() {
      const team: Record<string, any> = {
        name: this.name,
        description: this.description,
        pfp: this.link,
        public: this.isPrivate === '0'
      }
      const token = getCookie('token')

      if (token) createTeam(team as BasicTeam, token).then(res => {
        if (res.status === 400) this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Error creating team', alertText: res.statusText})
        else {
          this.$root.$emit('alert', {alertType: 'success', alertTitle: `${team.name} created`})
          team.owner = JSON.parse(atob(token.split('.')[1])).username
          this.$emit('on-create', team as Team)
        }
        this.onClose();
      })
    }
  }
})
</script>