<template>
  <v-container fluid>
    <!-- TODO: Do not display if user is not part of team that created it -->
    <v-row class="d-flex align-center">
      <v-col cols="5">
        <v-btn color="green" @click="create = true" :disabled="challenges.length >= 10 || !loaded">
          Create
          <v-icon class="ml-1">add</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-text-field :disabled="!loaded" prepend-icon="mdi-magnify"></v-text-field>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";

export default Vue.extend({
  name: "CTF Challenges",
  props: {
    'ctf': CTF,
    'user': BasicUser
  },
  data() {
    return {
      create: false,
      loaded: false,
      challenges: Array
    }
  }
});
</script>

<style scoped>

</style>