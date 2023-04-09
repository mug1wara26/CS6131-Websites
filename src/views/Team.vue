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
            <v-card-subtitle class="mt-2">Owned by: <a :href="`/users/${team.owner}`">{{ team.owner }}</a></v-card-subtitle>
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

              <v-btn v-else color="error" :loading="leaveLoading" @click="onLeave">Leave</v-btn>
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
      <component :is="selectedComponent" :team-prop="team" :user="user"></component>


      <v-dialog
          v-model="request"
          width="400"
      >
        <GenericWarningDialog
            title="Warning"
            text="Upon joining this team, you will no longer be able to compete and solve challenges in any CTFs made by this team."
            acceptText="Request to join"
            acceptColor="green"
            @close-dialog="request=false"
            @accept="onRequest"
        />
      </v-dialog>

      <v-dialog
          v-model="ownerLeave"
          width="400"
      >
        <OwnerLeaveDialog
            @close-dialog="ownerLeave = false"
            :members="members.filter(member => member !== user.username)"
            @leave="onOwnerLeave"
        />
      </v-dialog>


      <v-dialog
          v-model="lastLeave"
          width="400"
      >
        <GenericWarningDialog
            title="Warning"
            text="As there are no other members in this team, this team will be deleted upon you leaving"
            acceptText="Leave"
            acceptColor="error"
            @close-dialog="lastLeave=false"
            @accept="leaveTeam"
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
import * as teamApi from "@/api/teamApi";
import TeamCTFs from "@/components/Team/TeamCTFs.vue";
import TeamMembers from "@/components/Team/TeamMembers.vue";
import TeamParticipate from "@/components/Team/TeamParticipate.vue";
import OwnerLeaveDialog from "@/components/Dialogs/OwnerLeaveDialog.vue";
import GenericWarningDialog from "@/components/Dialogs/GenericWarningDialog.vue";

export default Vue.extend({
  name: "Team",
  components: {
    GenericWarningDialog,
    'TeamCTFs': TeamCTFs,
    'TeamMembers': TeamMembers,
    'TeamParticipate': TeamParticipate,
    OwnerLeaveDialog
  },
  data() {
    return {
      team: new Team(),
      user: new BasicUser(),
      members: [] as Array<string>,
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
      leaveLoading: false,
      request: false,
      ownerLeave: false,
      lastLeave: false,
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
      teamApi.requestToJoin(this.team.name, this.user.username).then(val => {
        if (val) {
          this.$root.$emit('alert', {alertType: 'success', alertTitle: 'Request Sent'})
          this.hasRequested = true
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})
        this.requestJoinLoading = false
      })
    },
    onLeave() {
      if (this.team.owner === this.user.username) {
        if (this.members.length === 1) this.lastLeave = true
        else this.ownerLeave = true
      }
      else this.leaveTeam()
    },
    onOwnerLeave(member: string) {
      this.ownerLeave = false
      this.leaveLoading = true
      // Transfer ownership to member
      teamApi.transferOwner(this.team.name, member).then(val => {
        if (val) this.leaveTeam()
        else {
          this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Couldn\'t transfer ownership'})
          this.leaveLoading = false
        }
      })
    },
    leaveTeam() {
      this.leaveLoading = true;
      this.lastLeave = false
      teamApi.leave(this.team.name).then(val => {
        if (val) {
          this.$emit('leave')
          this.$root.$emit('alert', {alertType: 'success', alertTitle: 'Successfully left team'})
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'An error occurred', alertText: 'Please try again later'})
        this.leaveLoading = false;
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
          teamApi.getTeam(name).then(team => {
            if (Object.keys(team).length !== 0) {
              Object.assign(this.team, team);

              if (Object.keys(user).length !== 0) {
                Object.assign(this.user, user)

                teamApi.getMembers(name).then(members => {
                  this.isMember = members.includes(this.user.username)
                  this.members = members
                  this.getMembersLoaded = true
                })

                teamApi.hasRequested(name, this.user.username).then(val => {
                  this.hasRequested = val
                  this.hasRequestedLoaded = true;
                })
              }
              else {
                this.getMembersLoaded = true;
                this.hasRequestedLoaded = true
              }
            }
            else {
              this.team = {} as Team
              this.loading = false
            }
            this.getTeamsLoaded = true
          })
        }
      })
    }
  }
});
</script>