<template>
  <v-container fluid class="pa-12">
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <template v-else>
      <v-row class="d-flex align-center">
        <v-btn color="green" @click="onClick" class="ml-3">
          Create
          <v-icon class="ml-1">mdi-plus</v-icon>
        </v-btn>
      </v-row>
      <WriteupGrid class="mt-4" :items="writeups"/>
      <p class="text-center" v-if="loaded && writeups.length === 0">You have no writeups, consider creating one</p>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as noteApi from "@/api/noteApi"
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {Writeup} from "../../cs6131-backend/types/writeupTypes";
import WriteupGrid from "@/components/WriteupGrid.vue";

export default Vue.extend({
  name: "WriteUps",
  components: {WriteupGrid},
  data() {
    return {
      user: new BasicUser(),
      writeups: [] as Array<Writeup>,
      create: false,
      loaded: false,
    }
  },
  methods: {
    onClick() {
      window.location.href = '/writeups/create'
    }
  },
  mounted() {
    onLogin((err: AlertData, user: BasicUser) => {
      if (err) this.$root.$emit('alert', err)
      if (Object.keys(user).length === 0) this.$emit("open-login");
      else {
        Object.assign(this.user, user)
        noteApi.getUserWriteups(this.user.username).then(writeups => {
          this.writeups = writeups
          this.loaded = true
        })
      }
    })
  }
})
</script>
