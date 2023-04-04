<template>
  <v-container fluid>
    User WriteUps Page
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../../cs6131-backend/types/userTypes";

export default Vue.extend({
  name: "UserWriteups",
  props: {
    'user': BasicUser
  }
});
</script>

<style scoped>

</style>