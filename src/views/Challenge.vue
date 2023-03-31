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
                  </v-card-text>
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

// use
Vue.use(mavonEditor)
export default Vue.extend({
  name: "Challenge",
  data() {
    return {
      name: '',
      ctfid: '',
      loaded: false,
      chal: {} as BasicChallenge,
      panel: 0,
      selected: 0,
      items: ['Note 1', 'Note 2', 'Note 3'],
      value: '',
    }
  },
  computed: {
    chalExists(): boolean {
      return Object.keys(this.chal).length !== 0
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


    chalApi.getChal(this.name, this.ctfid).then(chal => {
      this.chal = chal as BasicChallenge
      this.loaded = true
    })
  },
});
</script>