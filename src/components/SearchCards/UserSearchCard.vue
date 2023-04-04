<template>
  <v-card class="pa-4 fill-height d-flex flex-column" elevation="4" outlined>
    <v-card-title> <a :href="`/users/${item.username}`"> {{ item.username }} </a></v-card-title>
    <v-card-text>
      <div class="font-weight-medium text-truncate"> {{ item.bio }} </div>
      <p class="font-weight-thin font-italic">{{ item.email }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";

export default Vue.extend({
  name: "UserSearchCard",
  props: {
    'item': BasicUser
  }
});
</script>
