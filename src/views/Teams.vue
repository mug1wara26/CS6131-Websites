<template>
  <v-container fluid v-if="userExists">
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
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {AlertError, onLogin} from "@/api/userApi";
import MyTeams from "@/components/Teams/MyTeams.vue";
import RequestingTeams from "@/components/Teams/RequestingTeams.vue";
import InvitedTeams from "@/components/Teams/InvitedTeams.vue";

export default Vue.extend({
  name: "Teams",
  components: {
    'MyTeams': MyTeams,
    'RequestingTeams': RequestingTeams,
    'InvitedTeams': InvitedTeams
  },
  data() {
    return {
      user: {} as BasicUser,
      toolbar_items: {"My Teams": "MyTeams", "Requesting": "RequestingTeams", "Invited": "InvitedTeams"},
      selected: "My Teams",
      selectedComponent: "MyTeams"
    }
  },
  computed: {
    userExists(): boolean {
      return Object.keys(this.user).length !== 0;
    },
  },
  async created() {
    onLogin((err: AlertError, user: BasicUser) => {
      if (Object.keys(user).length === 0) this.$emit("open-login");
      else this.user = user;
    })
  }
})
</script>
