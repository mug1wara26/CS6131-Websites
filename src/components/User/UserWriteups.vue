<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <WriteupGrid v-else :items="writeups"/>
    <p v-if="writeups.length === 0 && loaded" class="text-center"> This user has not published any writeups </p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import * as noteApi from "@/api/noteApi"
import WriteupGrid from "@/components/WriteupGrid.vue";
import {Writeup} from "../../../cs6131-backend/types/writeupTypes";

export default Vue.extend({
  name: "UserWriteups",
  components: {WriteupGrid},
  props: {
    'user': BasicUser
  },
  data() {
    return {
      writeups: [] as Array<Writeup>,
      loaded: false
    }
  },
  mounted() {
    noteApi.getUserWriteups(this.user.username).then(writeups => {
      this.writeups = writeups
      this.loaded = true
    })
  }
});
</script>