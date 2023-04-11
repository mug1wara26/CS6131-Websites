<template>
  <v-container fluid class="pa-6">
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!exists">Writeup does not exist</p>
    <p v-else-if="!hasAccess">You do not have access to view this writeup</p>
    <template v-else>
      <v-row>
        <v-col cols="11" v-if="!edit">
          <h1>{{writeup.title}}</h1>
          <p>
            Authored by
            <template v-for="(author, index) in authors">
              <a :key="author" :href="`/users/${author}`">{{author}}</a>
              <span :key="index" v-if="index !== (authors.length - 1)">, </span>
            </template>
          </p>
          <p v-if="writeup.ctfid">
            <a :href="`/ctfs/${writeup.ctfid}`">View CTF</a> <br/>
            Challenge Name: {{writeup.chalName}}
          </p>
        </v-col>
        <template v-else>
          <v-col cols="6" xl="2" lg="3" md="4">
            <v-text-field v-model="title" label="Writeup Title*" :error-messages="error"/>
          </v-col>
          <v-switch
              v-model="isPublic"
              :label="isPublic ? 'Public' : 'Private'"
              class="pa-3"
          />
        </template>
        <v-spacer/>
        <v-col cols="auto" class="d-flex align-end justify-end mb-2">
          <v-btn icon v-if="!edit && authors.includes(user.username)" @click="onEditClick"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn v-else-if="edit" color="primary" @click="onSaveClick" :loading="saveLoading">Save</v-btn>
        </v-col>
      </v-row>

      <mavon-editor v-if="edit" v-model="value" language="en" style="color: black"/>
      <mavon-editor v-else :value="writeup.content" defaultOpen="preview" :toolbarsFlag="false" :subfield="false" language="en" style="color: black"/>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as noteApi from "@/api/noteApi"
import {Writeup} from "../../cs6131-backend/types/writeupTypes";
import {AlertData} from "@/schemas/alertData";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {onLogin} from "@/api/userApi";

export default Vue.extend({
  name: "Writeup",
  data() {
    return {
      noteid: '',
      hasAccess: false,
      writeup: {} as Writeup,
      authors: [] as Array<string>,
      user: {} as BasicUser,
      value: '',
      getWriteupLoaded: false,
      exists: false,
      edit: false,
      title: '',
      error: '',
      loginLoaded: false,
      isPublic: true,
      saveLoading: false,
    }
  },
  computed: {
    loaded(): Boolean {
      return this.loginLoaded && this.getWriteupLoaded
    }
  },
  methods: {
    onEditClick() {
      this.edit = true
    },
    onSaveClick() {
      this.saveLoading = true

      const newWriteup = Object.assign(new Writeup(), this.writeup)
      newWriteup.title = this.title
      newWriteup.public = Boolean(this.isPublic)
      newWriteup.content = this.value

      noteApi.updateWriteup(newWriteup).then(res => {
        if (res.status === 200) {
          this.writeup = newWriteup
          this.$root.$emit('alert', {alertType: 'success', alertTitle: 'Successfully edited writeup'})
        }
        else this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: `${res.statusText}`})
        this.saveLoading = false
        this.edit = false
      })
    },
    setError(error: string) {
      this.error = error
      setTimeout(() => this.error = '', 3000)
      return;
    },
  },
  mounted() {
    this.noteid = this.$route.params.id
    onLogin((err: AlertData, user: BasicUser) => {
      if (err) this.$root.$emit('alert', err)
      if (Object.keys(user).length !== 0) this.user = user
      this.loginLoaded = true;
    })

    noteApi.getWriteup(this.noteid).then(res => {
      if (res.status === 200) res.json().then(data => {
        this.exists = true
        this.hasAccess = data.hasAccess
        if (this.hasAccess) {
          this.writeup = data.writeup
          this.title = this.writeup.title
          this.value = this.writeup.content
          this.authors = data.authors
          this.isPublic = this.writeup.public
        }

        this.getWriteupLoaded = true
      })
      else {
        if (res.status === 404) this.exists = false
        this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: `${res.statusText}`})
        this.getWriteupLoaded = true
      }
    })
  }
})
</script>
