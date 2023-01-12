<template>
  <v-container fluid>
    <p v-if="user === undefined"> No User Found</p>
    <template v-else>
      {{user}}
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import users from "@/data/Users";
import {User} from "@/schemas/User";

export default Vue.extend({
  name: "Users",
  data() {
    return {
      user: {} as User
    }
  },
  created() {
    const id = this.$route.params.id;
    this.user = users.filter(obj => {
      return obj.uid === id;
    })[0]
  }
})
</script>
