<template>
  <v-container fluid>
    <v-progress-circular v-if="loading" indeterminate class="d-flex justify-center mx-auto"/>
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
          </v-card>
        </v-col>
      </v-row>
      <v-container class="d-flex">
        <v-toolbar floating class="justify-center" color="transparent" elevation="0">
          <v-btn-toggle borderless rounded group v-model="selected">
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
      <component :is="selectedComponent" :userObject="user"></component>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Team} from "../../cs6131-backend/types/teamTypes";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {getCookie} from "typescript-cookie";
import {getTeam} from "@/api/teamApi";
import TeamCTFs from "@/components/Team/TeamCTFs.vue";
import TeamMembers from "@/components/Team/TeamMembers.vue";
import TeamParticipate from "@/components/Team/TeamParticipate.vue";

export default Vue.extend({
  name: "Team",
  components: {
    'TeamCTFs': TeamCTFs,
    'TeamMembers': TeamMembers,
    'TeamParticipate': TeamParticipate
  },
  data() {
    return {
      team: {} as Team,
      user: {} as BasicUser,
      loading: true,
      toolbar_items: {'Team CTFs': 'TeamCTFs', 'Participating CTFs': 'TeamParticipate', 'Members': 'TeamMembers'},
      selected: 'Team CTFs',
      selectedComponent: 'TeamCTFs',
      defaultImage: require("../../public/assets/default-pfp.webp")
    }
  },
  computed: {
    teamExists(): boolean {
      return Object.keys(this.team).length !== 0
    },
    avatarImage(): string {
      return this.team.pfp ? this.team.pfp : this.defaultImage
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
        if (Object.keys(user).length !== 0) this.user = user
        const token = getCookie('token')
        getTeam(name, token).then(team => {
          this.team = team;
          this.loading = false;
          console.log(team.pfp ? team.pfp : '../../public/assets/default-pfp.webp')
        })
      })
    }
  }
});
</script>