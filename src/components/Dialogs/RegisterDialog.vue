<template>
  <div>
    <v-card>
      <v-card-title>
        Register
      </v-card-title>

      <v-card-text>
        Note: Registering does create an account in the database, but does not log you in yet. <br/>
        <a @click="openLogin">Already have an account?</a>
        <v-form ref="form">
          <v-text-field autofocus v-model="user.username" label="Username*" required :rules="rules.usernameRules"/>
          <v-text-field v-model="user.displayName" label="Display Name*" required :rules="rules.displayNameRules"/>
          <v-text-field v-model="user.email" label="Email*" required :rules="rules.emailRules"/>
          <v-text-field
              v-model="user.password"
              label="Password*"
              required
              :type="showPass ? '' : 'password'"
              :rules="rules.passwordRules"
              :append-icon="showPass? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append="showPass = !showPass"

          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" left @click.stop="onClose">Close</v-btn>

        <v-spacer/>

        <v-btn
            color="primary"
            right
            @click="onSave"
            :loading="loading"
            :disabled="loading || !clean"
        >
          Register
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {register, userExists} from "@/api";
import {RegisteringUser} from "@/../cs6131-backend/types/user";

export default Vue.extend({
  data() {
    return {
      loading: false,
      user: {
        username: "",
        displayName: "",
        email: "",
        password: "",
      },
      showPass: false,
      rules: {
        usernameRules: {},
        displayNameRules: {},
        emailRules: {},
        passwordRules: {}
      },
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.user).every((val) => val != '')
    }
  },
  methods: {
    onClose(){
      this.$emit('close-dialog');
      this.rules = {
        usernameRules: {},
        displayNameRules: {},
        emailRules: {},
        passwordRules: {}
      };
      (this.$refs.form as any).reset();
      this.loading=false;
    },
    onSave() {
      this.rules = {
        passwordRules: [
          (password: string | null) => !!password || 'Password is required',
          (password: string | null) => (password && password.length >= 8) || 'Password must be longer than or equal to 8 characters',
          (password: string | null) => (password && password.length < 1024) || 'Password too long',
          (password: string | null) => (password && /[A-Z]/.test(password)) || 'Password must contain at least one uppercase letter',
          (password: string | null) => (password && /[a-z]/.test(password)) || 'Password must contain at least one lowercase letter',
          (password: string | null) => (password && /\d/.test(password)) || 'Password must contain at least one number',
          (password: string | null) => (password && /[@$!%*#?&]/.test(password)) || 'Password must contain at least one special character (@$!%*#?&)',
        ],
        emailRules: [
          (email: string | null) => !!email || 'Email is required',
          // eslint-disable-next-line
          (email: string | null) => (email && /^.+\@.+\..+$/.test(email)) || 'Not a valid email'
        ],
        displayNameRules: [
          (displayName: string | null) => !!displayName || 'Display name is required',
          (displayName: string | null) => (displayName && displayName.length >= 3 && displayName.length < 32) || 'Display name must be between 3 and 32 characters'
        ],
        usernameRules: [
          (username: string | null) => !!username || 'Username is required',
          (username: string | null) => (username && username.length > 6 && username.length < 32) || 'Username must be between 6 and 32 characters'
        ],
      };

      this.$nextTick(() => {
        //NOW trigger validation
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          console.log(JSON.stringify(this.user))
          this.register();
        }
      })
    },
    openLogin() {
      this.$emit('close-dialog')
      this.$emit('open-login')
    },
    register() {
      this.loading=true;
      const registeringUser = this.user as RegisteringUser

      userExists(registeringUser.username).then(res => {
        if (!res) {
          register(registeringUser).then(res => {
            if (res.status === 200) res.json().then(data => {console.log(data);this.$emit('register-success', data.message)});
            else if (res.status === 400) this.$emit('register-error', res.statusText);
            else this.$emit('register-error', "Unknown error, please try again")
          })
        }
        else this.$emit('register-error', 'Username taken')
        this.onClose();
      })
    }
  },
})
</script>
