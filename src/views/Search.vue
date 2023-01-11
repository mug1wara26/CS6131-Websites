<template>
  <v-container fluid class="pr-16">
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


    <v-row>
      <v-col cols="2">
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

      <v-col cols="10">

        <v-row class="mt-4">
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in searchItems[searchCategory].filter(obj=>{ return obj.name.toLowerCase().startsWith(searchText.toLowerCase().trim()) || searchText.trim().length === 0})"
                 :key="index">
            <v-card class="pa-4 fill-height d-flex flex-column" elevation="2" color="#AED5EA">
              <v-card-title> {{ item.name }}</v-card-title>
              <v-card-text>
                Category: {{ item.category }} <br/>
                Points: {{ item.points }}
                <p class="text-truncate">{{ item.description }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import notes from "@/schemas/Notes";
import users from "@/schemas/Users";
import teams from "@/schemas/Teams";

export default Vue.extend({
  name: "Search",
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
        'teams': teams
      },
      selected: 0,
      searchCategory: 'notes'
    }
  },
  created() {
    if (this.$route.query.q !== undefined) {
      const searchQuery = this.$route.query.q as string
      this.selected = this.searchQueries.findIndex(obj => {return obj.query === searchQuery})
      this.searchCategory = searchQuery
    }
  }
})
</script>
