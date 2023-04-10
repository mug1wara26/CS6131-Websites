<template>
  <v-container fluid class="pa-6">
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!exists">Writeup does not exist</p>
    <p v-else-if="!hasAccess">You do not have access to view this writeup</p>
    <template v-else>
      <h1>{{writeup.title}}</h1>
      <p>
        Authored by
        <template v-for="(author, index) in authors">
          <a :key="author">{{author}}</a>
          <span :key="index" v-if="index !== (authors.length - 1)">, </span>
        </template>
      </p>
      <p v-if="writeup.ctfid">
        <a :href="`/ctfs/${writeup.ctfid}`">View CTF</a> <br/>
        Challenge Name: {{writeup.chalName}}
      </p>

      <mavon-editor :value="writeup.content" defaultOpen="preview" :toolbarsFlag="false" :subfield="false"/>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as noteApi from "@/api/noteApi"
import {Writeup} from "../../cs6131-backend/types/writeupTypes";

export default Vue.extend({
  name: "Writeup",
  data() {
    return {
      noteid: '',
      hasAccess: false,
      writeup: {} as Writeup,
      authors: [] as Array<string>,
      loaded: false,
      exists: false
    }
  },
  mounted() {
    this.noteid = this.$route.params.id
    noteApi.getWriteup(this.noteid).then(res => {
      if (res.status === 200) res.json().then(data => {
        this.exists = true
        this.hasAccess = data.hasAccess
        if (this.hasAccess) {
          this.writeup = data.writeup
          this.authors = data.authors
        }

        this.loaded = true
      })
      else {
        if (res.status === 404) this.exists = false
        this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: `${res.statusText}`})
        this.loaded = true
      }
    })
  }
})
</script>