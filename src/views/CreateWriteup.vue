<template>
  <v-container fluid>
    <h1>Create Writeup</h1>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!userExists"> You must be logged in to create a writeup </p>
    <template v-else>
      <v-row>
        <v-col cols="6" xl="2" lg="3" md="4">
          <v-text-field v-model="title" label="Writeup Title*" :error-messages="error"/>
        </v-col>
        <v-switch
            v-model="isPublic"
            :label="isPublic ? 'Public' : 'Private'"
            class="pa-3"
        />
        <v-spacer/>
        <v-btn class="mr-4" color="green" :disabled="!clean" @click="onClickCreate" :loading="createLoading">Create</v-btn>
      </v-row>
      <mavon-editor class="mt-4" v-model="value" language="en" style="color: black"/>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {BasicWriteup} from "../../cs6131-backend/types/writeupTypes";
import * as noteApi from "@/api/noteApi"

Vue.use(mavonEditor)
export default Vue.extend({
  name: "CreateWriteup",
  data() {
    return {
      user: {} as BasicUser,
      value: '',
      title: '',
      loaded: false,
      loggedIn: false,
      error: '',
      createLoading: false,
      isPublic: true,
    }
  },
  computed: {
    userExists(): Boolean {
      return Object.keys(this.user).length !== 0
    },
    clean(): Boolean {
      return this.value.trim() !== ''
    }
  },
  methods: {
    onClickCreate() {
      noteApi.validateWriteupTitle(this.title, (err: string) => {
        if (err) this.setError(err)
        else this.createWriteup()
      })
    },
    setError(error: string) {
      this.error = error
      setTimeout(() => this.error = '', 3000)
      return;
    },
    createWriteup() {
      this.createLoading = true;

      const writeup = Object.assign(new BasicWriteup(), {
        title: this.title,
        content: this.value,
        public: this.isPublic
      } as BasicWriteup)

      noteApi.createWriteup(writeup).then(writeup => {
        window.location.href = `/writeups/${writeup.id}`
      }).catch(res => {
        this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: res.statusText})
        this.createLoading = false
      })
    }
  },
  mounted() {
    onLogin((err: AlertData, user: BasicUser) => {
      if (err) this.$root.$emit('alert', err)
      if (Object.keys(user).length === 0) this.$emit("open-login");
      else this.user = user
      this.loaded = true;
    })
  }
})
</script>