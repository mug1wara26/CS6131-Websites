<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <v-row class="mt-2" v-else>
      <v-col lg="10" sm="12">
        <v-row>
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in ctfs"
                 :key="index">
            <CTFSearchCard :item="item"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";
import * as ctfApi from "@/api/ctfApi"
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import CTFSearchCard from "@/components/SearchCards/CTFSearchCard.vue";

export default Vue.extend({
  name: "UserTeamCTF",
  components: {CTFSearchCard},
  props: {
    user: BasicUser
  },
  data() {
    return {
      ctfs: [] as Array<CTF>,
      loaded: false
    }
  },
  mounted() {
    ctfApi.getAllTeamCreatedCTFs(this.user.username).then(ctfs => {
      this.ctfs = ctfs
      this.loaded = true;
    }).catch(res => {
      this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: `${res.statusText}`})
    })
  }
})
</script>