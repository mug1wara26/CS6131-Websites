<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <template v-else>
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
      <component :is="selected" :user="user"></component>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import UserTeamCTF from "@/components/UserCTFs/UserTeamCTF.vue"
import UserParticipatingCTF from "@/components/UserCTFs/UserParticipatingCTF.vue"
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";

export default Vue.extend({
  name: "CTF",
  components: {
    'Team CTFs': UserTeamCTF,
    'Participating CTFs': UserParticipatingCTF
  },
  data() {
    return {
      user: new BasicUser(),
      toolbar_items: ['Team CTFs', 'Participating CTFs'],
      selected: 'Team CTFs',
      loaded: false
    }
  },
  mounted() {
    onLogin(async (err: AlertData, user: BasicUser) => {
      if (err) {
        this.$emit('alert', err);
        this.loaded = false;
      }
      if (Object.keys(user).length !== 0) {
        Object.assign(this.user, user)
        this.loaded = true
      }
    })
  }
})
</script>
