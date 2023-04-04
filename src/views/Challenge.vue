<template>
  <v-container fluid>
    <v-progress-circular v-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
    <p v-else-if="!chalExists">Challenge does not exist</p>
    <v-container v-else>
      <v-row class="d-flex justify-center">
        <v-col cols="4">
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header class="title">{{chal.name}}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card flat>
                  <v-card-text class="text-center text-h6">
                    <b>{{chal.category}}</b> <br/>
                    <span>{{chal.difficulty}}</span> <br/> <br/>
                    <span class="text-h4">{{chal.points ? `${chal.points} Points` : ''}}</span>

                    <v-form ref="form">
                      <v-text-field v-if="isPublic" label="Submit flag" v-model="flag" class="text-body-1" :rules="flagRules"/>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="d-flex justify-center">
                    <v-btn v-if="isPublic" color="green" :disabled="!clean" :loading="loading" @click="submitFlag">Submit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row class="my-4">
        <v-col cols="2">
          <v-card>
            <v-list two-line>
              <v-list-item-group
                  v-model="selected"
                  active-class="blue--text"
              >
                <template v-for="(item, index) in items">
                  <v-list-item :key="item">
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                      v-if="index < items.length - 1"
                      :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
            </v-card>
        </v-col>

        <v-col cols="10">
          <mavon-editor v-model="value" language="en"/>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicChallenge} from "../../cs6131-backend/types/chalTypes";
import {getFromLocalStorage} from "@/api/api";
import * as chalApi from "@/api/chalApi"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
export default Vue.extend({
  name: "Challenge",
  data() {
    return {
      name: '',
      ctfid: '',
      loaded: false,
      chal: {} as BasicChallenge,
      isPublic: false,
      panel: 0,
      selected: 0,
      items: ['Note 1', 'Note 2', 'Note 3'],
      value: '',
      flag: '',
      loading: false,
      flagRules: [] as Array<Function>,
      solved: true
    }
  },
  computed: {
    chalExists(): boolean {
      return Object.keys(this.chal).length !== 0
    },
    clean() : boolean {
      return this.flag !== '' && !this.solved
    },
  },
  methods: {
    submitFlag() {
      this.loading = true;

      this.flagRules = [
        (v: string | null) => v && v.length <= 256 || 'Max 256 characters',
        (v: string | null) => v && v.length >= 3 || 'Min 3 characters',
        (v: string | null) => v && /^[A-Za-z0-9_@./#&+\-!?{}()]*$/.test(v) || 'Flag can only contain alphanumeric and special characters',
      ]


      this.$nextTick(() => {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          chalApi.solve(this.ctfid, this.name, this.flag).then(val => {
            this.flagRules = []
            this.loading = false;
            this.solved = val;
            this.flag = ''
            if (val) this.$root.$emit('alert', {alertType: 'success', alertTitle: `${this.name} solved`})
            else this.$root.$emit('alert', {alertType: 'error', alertTitle: `Wrong flag`})
          })
        }
        else this.loading = false
      })
    }
  },
  created() {
    this.name = this.$route.params.name
    this.ctfid = this.$route.params.id

    const chals = getFromLocalStorage(`${this.ctfid}_chals`) as Array<BasicChallenge>
    if (chals) {
      this.chal = chals.find(chal => chal.name === this.name) || {} as BasicChallenge
      this.loaded = true
    }

    chalApi.getChalUserData(this.ctfid, this.name).then(data => {
      if (Object.keys(data).length !== 0) {
        this.chal = data.challenge
        this.isPublic = data.isPublic
        this.solved = data.isSolved
      }

      this.loaded = true;
    })
  },
});
</script>