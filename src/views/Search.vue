<template>
  <v-container
      fluid
      :class="{'pr-16': $vuetify.breakpoint.mdAndUp, 'px-2': $vuetify.breakpoint.smAndDown}"
  >
    <v-container class="d-flex justify-center">
      <v-icon>mdi-magnify</v-icon>
      <v-text-field
          v-model="searchText"
          label="Search"
          class="ml-2"
          style="max-width: 300px;"
      >
      </v-text-field>
    </v-container>
    <v-select
        v-if="isMobile"
        v-model="selectedQuery"
        :items="searchQueries"
        item-text="name"
        outlined
        @change="onClickSelect"
    ></v-select>

    <v-row>
      <v-col cols="2" v-if="isNotMobile" sm="0">
        <v-card
            color="#6EB3D8"
            class="mx-auto"
        >
          <v-list
              v-model="selected"
              nav
              outlined
              color="#6EB3D8"
          >
            <v-list-item-group v-model="selected">
              <template v-for="(item, index) in searchQueries">
                <v-list-item
                    :key="item.name"
                    link
                    dense
                    class="mt-2"
                    @click="$router.push({path: 'search', query: {q: item.query}})"
                    v-ripple="false"
                >

                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>

                </v-list-item>
                <v-divider
                    v-if="index < searchQueries.length - 1"
                    :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col lg="10" sm="12">

        <v-row>
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in searchItems[searchCategory].filter(obj=>{ return obj.name.toLowerCase().startsWith(searchText.toLowerCase().trim()) || searchText.trim().length === 0})"
                 :key="index">
            <component v-bind:is="currentCardComponent" :item="item"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import notes from "@/data/Notes";
import users from "@/data/Users";
import teams from "@/data/Teams";
import ctfs from "@/data/CTFs";
import writeUps from "@/data/WriteUps";
import NoteSearchCard from "@/components/NoteSearchCard.vue";
import UserSearchCard from "@/components/UserSearchCard.vue";
import TeamSearchCard from "@/components/TeamSearchCard.vue";
import CTFSearchCard from "@/components/CTFSearchCard.vue";
import WriteUpSearchCard from "@/components/WriteUpSearchCard.vue";

export default Vue.extend({
  name: "Search",
  components: {NoteSearchCard, UserSearchCard, TeamSearchCard, CTFSearchCard, WriteUpSearchCard},
  data() {
    return {
      searchText: '',
      searchQueries: [
        {
          "name": "Notes",
          "query": "notes",
        },
        {
          "name": "Users",
          "query": "users",
        },
        {
          "name": "Teams",
          "query": "teams",
        },
        {
          "name": "CTFs",
          "query": "ctfs",
        },
        {
          "name": "Write Ups",
          "query": "writeups",
        }
      ],
      searchItems: {
        'notes': notes,
        'users': users,
        'teams': teams,
        'ctfs': ctfs,
        'writeups': writeUps
      },
      selected: 0,
      searchCategory: 'notes',
      currentCardComponent: "NoteSearchCard",
      windowWidth: innerWidth,
      selectedQuery: "Notes",
    }
  },
  computed: {
    isMobile(): boolean {
      return this.windowWidth <= 480
    },

    isNotMobile(): boolean {
      return this.windowWidth > 480
    }
  },
  methods: {
    onClickSelect() {
      this.$router.push({path: 'search', query: {q: this.selectedQuery.toLowerCase().replaceAll(' ','')}})
    }
  },
  created() {
    if (this.$route.query.q !== undefined) {
      const searchQuery = this.$route.query.q as string
      if(this.isNotMobile){
        this.selected = this.searchQueries.findIndex(obj => {
          return obj.query === searchQuery
        })
      }
      else if (this.isMobile) {
        this.selectedQuery = this.searchQueries.find(obj => {
          return obj.query === searchQuery
        })!.name
      }
      this.searchCategory = searchQuery

      const categoryCardComponents: {[index: string]:string} = {
        'notes': 'NoteSearchCard',
        'users': 'UserSearchCard',
        'teams': 'TeamSearchCard',
        'ctfs': 'CTFSearchCard',
        'writeups': 'WriteUpSearchCard'
      }
      this.currentCardComponent = categoryCardComponents[searchQuery]
    }

    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    }
  },
})
</script>
