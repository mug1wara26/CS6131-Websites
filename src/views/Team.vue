<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!teamExists">Team Does not Exist</p>
    <v-container v-else>
      <v-row>
        <v-col cols="4">
          <v-card>
            <v-card-title>
              <v-avatar size="56">
                <img
                    alt="Team Profile Pic"
                    :src="avatarImage"
                />
              </v-avatar>
              <h3 class="ml-4"> {{ team.name }} </h3>
            </v-card-title>
            <v-card-subtitle class="mt-2"> Created by <a :href="`/users/${team.owner}`">{{ team.owner }}</a></v-card-subtitle>
            <v-divider/>
            <v-card-text>
              <p> {{ team.description }} </p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                  v-if="!isMember"
                  color="green"
                  @click="request = true"
                  :loading="requestJoinLoading"
                  :disabled="hasRequested">
                Request
              </v-btn>
              <v-btn v-else color="error">Leave</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-container class="d-flex">
        <v-toolbar floating class="justify-center" color="transparent" elevation="0">
          <v-btn-toggle borderless rounded group mandatory v-model="selected">
            <v-btn
                :value="item"
                text
                v-for="item in Object.keys(toolbar_items)"
                :key="item"
                @click="selectedComponent = toolbar_items[item]"
            >
              {{ item }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-container>
      <component :is="selectedComponent" :team="team" :user="user"></component>


      <v-dialog
          v-model="request"
          width="400"
      >
        <RequestWarningDialog
            @close-dialog="request = false"
            @request="onRequest"
        />
      </v-dialog>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Team} from "../../cs6131-backend/types/teamTypes";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {getMembers, getTeam, hasRequested, requestToJoin} from "@/api/teamApi";
import TeamCTFs from "@/components/Team/TeamCTFs.vue";
import TeamMembers from "@/components/Team/TeamMembers.vue";
import TeamParticipate from "@/components/Team/TeamParticipate.vue";
import RequestWarningDialog from "@/components/Dialogs/RequestWarningDialog.vue";

export default Vue.extend({
  name: "Team",
  components: {
    RequestWarningDialog,
    'TeamCTFs': TeamCTFs,
    'TeamMembers': TeamMembers,
    'TeamParticipate': TeamParticipate
  },
  data() {
    return {
      team: new Team(),
      user: new BasicUser(),
      loading: true,
      toolbar_items: {'Team CTFs': 'TeamCTFs', 'Participating CTFs': 'TeamParticipate', 'Members': 'TeamMembers'},
      selected: 'Team CTFs',
      selectedComponent: 'TeamCTFs',
      defaultImage: require("../../public/assets/default-pfp.webp"),
      isMember: false,
      hasRequested: true,
      getMembersLoaded: false,
      getTeamsLoaded: false,
      hasRequestedLoaded: false,
      requestJoinLoading: false,
      request: false
    }
  },
  computed: {
    teamExists(): boolean {
      return Object.keys(this.team).length !== 0
    },
    avatarImage(): string {
      return this.team.pfp ? this.team.pfp : this.defaultImage
    },
    loaded(): boolean {
      return !this.loading || (this.getTeamsLoaded && this.getMembersLoaded && this.hasRequestedLoaded)
    }
  },
  methods: {
    onRequest() {
      this.request = false
      this.requestJoinLoading = true
      requestToJoin(this.team.name, this.user.username).then(val => {
        if (val) {
          this.$root.$emit('alert', {alertType: 'success', alertTitle: 'Request Sent'})
          this.hasRequested = true
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})
        this.requestJoinLoading = false
      })
    }
  },
  created() {
    const name = this.$route.params.teamName;
    if (name) {
      onLogin(async (err: AlertData, user: BasicUser) => {
        if (err) {
          this.$emit('alert', err);
          this.loading = false;
        }
        else {
          if (Object.keys(user).length !== 0) {
            Object.assign(this.user, user)

            getMembers(name).then(members => {
              this.isMember = members.includes(this.user.username)
              this.getMembersLoaded = true
            })

            hasRequested(name, this.user.username).then(val => {
              this.hasRequested = val
              this.hasRequestedLoaded = true;
            })
          }
          getTeam(name).then(team => {
            if (Object.keys(team).length !== 0) Object.assign(this.team, team);
            else this.team = {} as Team
            this.getTeamsLoaded = true
          })
        }
      })
    }
  }
});
</script>