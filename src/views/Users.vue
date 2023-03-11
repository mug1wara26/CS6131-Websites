<template>
  <v-container fluid v-if="userExists">
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
              <h3 class="ml-4"> {{ user.username }} </h3>
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
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {getUser, onLogin} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";

export default Vue.extend({
  name: "Users",
  data() {
    return {
      user: {} as BasicUser
    }
  },
  computed: {
    userExists(): boolean {
      return Object.keys(this.user).length !== 0;
    },
  },
  async created() {
    const username = this.$route.params.username;
    if (username) {
      await getUser(username).then(user => {
        this.user = user as BasicUser
      }).catch(err => console.log(err))
    }
    else {
      onLogin((err: AlertData, user: BasicUser) => {
        if (Object.keys(user).length === 0) this.$emit("open-login");
        else this.user = user;
      })
    }
  }
})
</script>
