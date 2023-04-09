<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title style="word-break: break-word"> <a :href="`/teams/${item.name}`"> {{ item.name }} </a> <span v-if="!item.public" class="font-weight-light text-subtitle-1">&nbsp;(private)</span></v-card-title>
    <v-card-text>
      <p>Owner: <b><a :href="`/users/${item.owner}`">{{item.owner}}</a></b></p>
      <p class="text-truncate">{{ item.description }}</p>
      <v-row v-if="isInvited">
        <v-col cols="6">
          <v-btn color="error" :loading="rejectInviteLoading" @click="rejectInvite">Reject</v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn color="green" :loading="acceptInviteLoading" @click="acceptInvite">Join</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import * as teamApi from "@/api/teamApi"

export default Vue.extend({
  name: "TeamSearchCard",
  props: ['item', 'isInvited'],
  data() {
    return {
      rejectInviteLoading: false,
      acceptInviteLoading: false
    }
  },
  methods: {
    rejectInvite() {
      this.rejectInviteLoading = true
      teamApi.rejectInvite(this.item.name).then(val => {
        if (val) this.$emit('reject-invite', this.item.name)
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})
        this.rejectInviteLoading = false
      })
    },
    acceptInvite() {
      this.acceptInviteLoading = true
      teamApi.acceptInvite(this.item.name).then(val => {
        if (val) this.$emit('accept-invite', this.item.name)
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})
        this.acceptInviteLoading = false
      })
    }
  }
});
</script>