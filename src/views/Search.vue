<template>
  <v-container
      fluid
      :class="{'pr-16': $vuetify.breakpoint.mdAndUp, 'px-2': $vuetify.breakpoint.smAndDown}"
  >
    <v-select
        v-if="isMobile"
        v-model="selectedQuery"
        :items="searchQueries"
        item-text="name"
        outlined
    ></v-select>

    <v-row>
      <v-col cols="2" v-if="isNotMobile" sm="0">
        <v-card
            class="mx-auto"
        >
          <v-list
              v-model="selected"
              nav
              outlined
          >
            <v-list-item-group v-model="selected">
              <template v-for="(item, index) in searchQueries">
                <v-list-item
                    :key="item.name"
                    link
                    dense
                    class="mt-2"
                    v-ripple="false"
                    @click="searchResults = []; search = ''; pageNum = 1;"
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
        <v-container class="d-flex justify-center">
          <v-icon>mdi-magnify</v-icon>
          <v-text-field
              v-model="search"
              label="Search"
              class="ml-2"
              style="max-width: 300px;"
          />
        </v-container>

        <p class="text-center" v-if="search.length === 0 && searchResults.length === 0"> Please type to begin searching </p>
        <p class="text-center" v-else-if="loaded && searchResults.length === 0">No results</p>
        <v-progress-circular v-else-if="!loaded" indeterminate class="d-flex justify-center mx-auto"/>
        <template v-else>
          <v-row class="d-flex align-center">
            <v-col cols="6" class="d-flex justify-end">
              <v-btn v-if="pageNum !== 1" icon @click="goToPage(1)"><v-icon>mdi-chevron-double-left</v-icon></v-btn>
              <v-btn v-if="pageNum !== 1" icon @click="previousPage"><v-icon>mdi-arrow-left</v-icon></v-btn>
            </v-col>
            <span v-if="totalPages !== 1">{{pageNum}}</span>
            <v-col cols="5" class="d-flex justify-start">
              <v-btn v-if="pageNum !== totalPages" icon @click="nextPage"><v-icon>mdi-arrow-right</v-icon></v-btn>
              <v-btn v-if="pageNum !== totalPages" icon @click="goToPage(totalPages)"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="4" md="8"
                   v-for="(item, index) in searchResults"
                   :key="index">
              <component :is="currentComponent" :item="item"/>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, {Component} from "vue";
import UserSearchCard from "@/components/SearchCards/UserSearchCard.vue";
import TeamSearchCard from "@/components/SearchCards/TeamSearchCard.vue";
import CTFSearchCard from "@/components/SearchCards/CTFSearchCard.vue";
import WriteUpSearchCard from "@/components/SearchCards/WriteUpSearchCard.vue";
import {searchByPage} from "@/api/api";

export default Vue.extend({
  name: "Search",
  components: {UserSearchCard, TeamSearchCard, CTFSearchCard, WriteUpSearchCard},
  data() {
    return {
      search: '',
      searchQueries: [
        {
          name: "Users",
          query: "user",
          component: UserSearchCard
        },
        {
          name: "Teams",
          query: "team",
          component: TeamSearchCard
        },
        {
          name: "CTFs",
          query: "ctf",
          component: CTFSearchCard
        },
        {
          name: "Write Ups",
          query: "writeup",
          component: WriteUpSearchCard
        }
      ],
      selected: 0,
      selectedQuery: "Users",
      windowWidth: innerWidth,
      loaded: false,
      searchResults: [],
      searchDelay: 0,
      pageNum: 1,
      totalPages: 1
    }
  },
  computed: {
    isMobile(): boolean {
      return this.windowWidth <= 480
    },
    isNotMobile(): boolean {
      return !this.isMobile
    },
    currentComponent(): Component {
      if (this.isMobile) {
        return this.searchQueries.find(obj => obj.name === this.selectedQuery)!.component
      }

      return this.searchQueries[this.selected].component
    },
    selectedTable(): string {
      if (this.isMobile) {
        return this.searchQueries.find(obj => obj.name === this.selectedQuery)!.query
      }

      return this.searchQueries[this.selected].query
    }
  },
  methods: {
    onSearch() {
      this.searchDelay += 1
      this.loaded = false;
      this.totalPages= 1
      setTimeout(() => {
        this.searchDelay -= 1
        if (this.searchDelay === 0 && this.search !== '') {
          searchByPage(this.selectedTable, this.pageNum, this.search).then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                this.searchResults = data.results
                this.totalPages = data.numPages
                this.loaded=true;
              })
            }
            else {
              this.$root.$emit('alert', {
                alertType: 'error',
                alertTitle: `${res.status} Error`,
                alertText: res.statusText
              })
              this.loaded = true;
            }
          })
        }
      }, 1000)
    },
    nextPage() {
      this.pageNum++;
      this.onSearch()
    },
    previousPage() {
      this.pageNum--;
      this.onSearch()
    },
    goToPage(pageNum: number) {
      this.pageNum = pageNum
      this.onSearch()
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    }
  },
  watch: {
    search(newSearch: string, oldSearch: string) {
      if(newSearch !== oldSearch && newSearch.trim() !== '') this.onSearch()
    }
  }
})
</script>
