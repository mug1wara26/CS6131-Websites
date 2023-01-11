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
              nav
              outlined
              color="#6EB3D8"
          >
            <template v-for="(item, index) in items">
              <v-list-item
                  :key="item.name"
                  link
                  dense
                  class="mt-2"
              >

                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>

              </v-list-item>
              <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="10">

        <v-row class="mt-4">
          <v-col cols="12" lg="4" md="8"
                 v-for="(item, index) in notes.filter(obj=>{ return obj.name.toLowerCase().startsWith(searchText.toLowerCase().trim()) || searchText.trim().length === 0})"
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
import {notes} from "@/schemas/Notes";
import {users} from "@/schemas/Users";

export default Vue.extend({
  name: "Search",
  data() {
    return {
      searchText: '',
      items: [
        {
          "name": "Notes",
          "route": "/notes",
        },
        {
          "name": "Users",
          "route": "/users",
        },
        {
          "name": "Teams",
          "route": "/teams",
        },
        {
          "name": "CTFs",
          "route": "/ctfs",
        },
        {
          "name": "Write Ups",
          "route": "/writeups",
        }
      ],
      notes: notes,
      users: users
    }
  },
  mounted() {
    if (this.$route.query.search !== null) {
      this.searchText = this.$route.query.search as string
    }
  }
})
</script>
