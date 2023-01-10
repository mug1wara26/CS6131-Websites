<template>
  <v-container fluid class="px-16">
    <v-container class="d-flex justify-center">
      <v-icon>mdi-magnify</v-icon>
      <v-text-field
          v-model="searchText"
          label="Search"
          class="ml-2"
          style="max-width: 300px"
      >
      </v-text-field>
    </v-container>

    <!-- TODO: Search for note, search for ctf, search for user, search for team-->

    <v-row class="mt-4">
      <v-col cols="12" lg="4" md="8" v-for="(item, index) in notes.filter(obj=>{ return obj.name.toLowerCase().startsWith(searchText.toLowerCase().trim()) || searchText.trim().length === 0})" :key="index">
          <v-card class="pa-4 fill-height d-flex flex-column" elevation="2" color="#AED5EA">
            <v-card-title> {{item.name}} </v-card-title>
            <v-card-text>
              Category: {{item.category}} <br/>
              Points: {{item.points}}
              <p class="text-truncate">{{item.description}}</p>
            </v-card-text>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {notes} from "@/schemas/Notes";

export default Vue.extend({
  name: "Search",
  data:()=>({
    searchText: '',
    notes: notes
  }),
})
</script>
