<template>
  <v-container fluid>
    <v-progress-circular v-if="loading" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!ctfExists">CTF Does not Exist</p>
    <v-container v-else>
      <v-row>
        <v-col cols="4">
          <v-card>
            <v-card-title> {{ctf.name}} {{!ctf.public ? '(private)' : '' }}</v-card-title>
            <v-card-subtitle> Created by <a :href="`/teams/${ctf.teamCreator}`">{{ctf.teamCreator}}</a></v-card-subtitle>

            <v-divider/>

            <v-card-text>
              <p>
                {{ new Date(ctf.date * 1000).toLocaleString() }} <br/>
                <b>{{ ctf.location }} </b> <br/>
                Format: {{ ctf.format }} <br/>
                URL: <a v-if="ctf.url !== null" :href="ctf.url" target=”_blank”>{{ ctf.url }}</a> <span v-else> Not Provided </span>
              </p>

              <p>
                {{ctf.description}}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-container class="d-flex">
        <v-toolbar floating class="justify-center" color="transparent" elevation="0">
          <v-btn-toggle borderless rounded group mandatory v-model="selected">
            <v-btn
                :value="item"
                text
                v-for="item in toolbar_items"
                :key="item"
            >
              {{ item }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-container>
      <component :is="selected" :ctf="ctf" :team="team" :user="user"></component>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {BasicUser, User} from "../../cs6131-backend/types/userTypes";
import {getCTF} from "@/api/ctfApi";
import {CTF} from "../../cs6131-backend/types/ctfTypes";
import {Team} from "../../cs6131-backend/types/teamTypes";
import CTFChallenges from "@/components/CTF/CTFChallenges.vue";
import Leaderboard from "@/components/CTF/Leaderboard.vue";

export default Vue.extend({
  name: "UserCTF",
  components: {
    'Challenges': CTFChallenges,
    'Leaderboard': Leaderboard
  },
  data() {
    return {
      user: new User(),
      team: new Team(),
      ctf: new CTF(),
      loading: true,
      selected: 'Challenges',
      toolbar_items: ['Challenges', 'Leaderboard']
    }
  },
  computed: {
    ctfExists(): boolean {
      return Object.keys(this.ctf).length !== 0
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      onLogin(async (err: AlertData, user: BasicUser) => {
        if (err) {
          this.$emit('alert', err);
          this.loading = false;
        }
        if (Object.keys(user).length !== 0) Object.assign(this.user, user)
        getCTF(id).then(ctf => {
          if(Object.keys(ctf).length !== 0) Object.assign(this.ctf, ctf)
          else this.ctf = {} as CTF
          this.loading = false;
          // TODO: If private CTF, add Settings page to toolbar_items, if public CTF, check if user is part of the team that created it, if so, add Settings page to toolbar_items
          // TODO: Check if user can compete
          // TODO: Display join button if can compete
          // TODO: Display challenges if competing
        })
      })
    }
  }
})
</script>