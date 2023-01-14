<template>
  <v-container fluid>
    <p v-if="user === undefined"> User login not implemented yet, click on a user in search to view their page</p>
    <template v-else>
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-card-title>
              <v-avatar size="56">
                <img
                    alt="user"
                    src="../../public/assets/default-pfp.webp"
                />
              </v-avatar>
              <h3 class="ml-4"> {{ user.name }} </h3>
            </v-card-title>
            <v-card-subtitle class="mt-2"> {{ user.email }} </v-card-subtitle>
            <v-divider/>
            <v-card-text>
              <p> {{ user.bio }} </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import users from "@/data/Users";
import {User} from "@/schemas/User";

export default Vue.extend({
  name: "Users",
  data() {
    return {
      user: {} as User
    }
  },
  created() {
    const id = this.$route.params.id;
    this.user = users.filter(obj => {
      return obj.uid === id;
    })[0]
  }
})
</script>
