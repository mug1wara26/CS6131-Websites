<template>
  <v-container fluid>
    <h1>Notes</h1>
    <p v-if="!isLoggedIn">You are not logged in and any notes made will not be saved upon leaving</p>
    This page has not been implemented yet, it will be the main page for the user to create, view, edit and delete notes <br/>
    The plan is to just have the search functionality in this page, but for the purposes of the assignment I have left them separated
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Notes",
  data: ()=> ({
    isLoggedIn: false,
  }),
})
</script>
