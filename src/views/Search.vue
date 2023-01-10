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

export default Vue.extend({
  name: "Notes",
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
    }
  },
  computed: {
    notes(): Array<{
      name: string,
      points: number,
      difficulty: string,
      description: string,
      category: string
    }> {
      return [
        {
          name: 'Web Chal 1',
          points: 50,
          difficulty: "easy",
          description: "First web chal",
          category: "Web"
        },
        {
          name: 'Web Chal 2',
          points: 100,
          difficulty: "medium",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          category: "Web"
        },
        {
          name: 'Misc Chal 1',
          points: 50,
          difficulty: "easy",
          description: "First misc chal",
          category: "Misc"
        },
        {
          name: 'Misc Chal 2',
          points: 100,
          difficulty: "medium",
          description: "Second misc chal",
          category: "Misc"
        },
        {
          name: 'Misc Chal 3',
          points: 200,
          difficulty: "hard",
          description: "Third misc chal",
          category: "Misc"
        },
        {
          name: 'Pwn Chal',
          points: 150,
          difficulty: "medium",
          description: "First pwn chal",
          category: "Pwn"
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.search !== null) {
      this.searchText = this.$route.query.search as string
    }
  }
})
</script>
