<template>
  <v-card>
    <v-card-title>Invite</v-card-title>
    <v-card-text>
      Warning: If this user joins your team, they will be able to see all private CTFs in your team.
      <v-autocomplete auto-select-first label="Teams" v-model="selected" :items="teams" item-text="name"/>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="onClose">Cancel</v-btn>
      <v-spacer/>
      <v-btn color="green" @click="onInvite" :disabled="inviteDisabled">Invite</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "InviteDialog",
  props: {
    teams: Array as PropType<Team[]>
  },
  data() {
    return {
      inviteDisabled: false,
      selected: this.teams[0].name
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
    },
    onInvite() {
      this.$emit('invite', this.selected)
    }
  }
})
</script>