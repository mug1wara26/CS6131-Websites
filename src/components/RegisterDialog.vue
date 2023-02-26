<template>
  <div>
    <v-card>
      <v-card-title>
        Register
      </v-card-title>

      <v-card-text>
        Note: Registering does nothing as of now <br/>
        <a @click="openLogin">Already have an account?</a>
        <v-form v-model="validity">
          <v-text-field v-model="username" label="Username*" required :rules="usernameRules"/>
          <v-text-field v-model="displayName" label="Display Name*" required :rules="displayNameRules"/>
          <v-text-field v-model="email" label="Email*" required :rules="emailRules"/>
          <v-text-field
              v-model="password"
              label="Password*"
              required
              :type="showPass ? '' : 'password'"
              :rules="passwordRules"
              :append-icon="showPass? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append="showPass = !showPass"

          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" left @click.stop="close">Close</v-btn>

        <v-spacer/>

        <v-btn
            color="primary"
            right
            @click.stop="register"
            :loading="loading"
            :disabled="loading || !validity"
        >
          Register
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {register} from "@/api";
import {RegisteringUser} from "../../cs6131-backend/types/user";

export default Vue.extend({
  data() {
    return {
      loading: false,
      validity: false,
      username: "",
      usernameRules: [
        (username: string | null) => !!username || 'Username is required',
        (username: string | null) => (username && username.length > 6 && username.length < 32) || 'Username must be between 6 and 32 characters'
      ],
      displayName: "",
      displayNameRules: [
        (displayName: string | null) => !!displayName || 'Display name is required',
        (displayName: string | null) => (displayName && displayName.length > 3 && displayName.length < 32) || 'Display name must be between 3 and 32 characters'
      ],
      email: "",
      emailRules: [
          (email: string | null) => !!email || 'Email is required',
        // eslint-disable-next-line
          (email: string | null) => (email && /^.+\@.+\..+$/.test(email)) || 'Not a valid email'
      ],
      password: "",
      passwordRules: [
        (password: string | null) => !!password || 'Password is required',
        (password: string | null) => (password && password.length >= 8) || 'Password must be longer than or equal to 8 characters',
        (password: string | null) => (password && password.length < 1024) || 'Password too long',
        (password: string | null) => (password && /[A-Z]/.test(password)) || 'Password must contain at least one uppercase letter',
        (password: string | null) => (password && /[a-z]/.test(password)) || 'Password must contain at least one lowercase letter',
        (password: string | null) => (password && /\d/.test(password)) || 'Password must contain at least one number',
        (password: string | null) => (password && /[@$!%*#?&]/.test(password)) || 'Password must contain at least one special character (@$!%*#?&)',
      ],
      showPass: false,
    }
  },
  methods: {
    close(){
      this.$emit('close-dialog')
    },
    openLogin() {
      this.$emit('close-dialog')
      this.$emit('open-login')
    },
    register() {
      const user = new RegisteringUser();
      user.username = this.username;
      user.displayName = this.displayName;
      user.email = this.email;
      user.password = this.password;

      register(user).then(res => {
        console.log(res);
        // this.close();
      });
    }
  },
})
</script>
