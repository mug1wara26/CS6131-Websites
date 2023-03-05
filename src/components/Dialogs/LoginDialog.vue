<template>
  <div>
    <v-card>
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        <a @click="openRegister">Don't have an account?</a>
        <v-form ref="form">
          <v-text-field autofocus v-model="user.username" label="Username*" required/>
          <v-text-field
              v-model="user.password"
              label="Password*"
              required
              :type="showPass ? '' : 'password'"
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
            @click.stop="login"
            :loading="loading"
            :disabled="loading || !clean"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {login} from "@/api/userApi";
import { setCookie } from "typescript-cookie"

export default Vue.extend({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      loading: false,
      showPass: false,
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.user).every((val) => val != '')
    }
  },
  methods: {
    onClose(){
      this.$emit('close-dialog')
    },
    openRegister() {
      this.$emit('close-dialog')
      this.$emit('open-register')
    },
    login() {
      this.loading = true;
      login(this.user.username, this.user.password).then(res => {
        setCookie('token', res, {sameSite: "lax"});
        this.$emit('login-success')
      }).catch(reason => {
        this.$emit('login-error', reason)
      }).finally( () => {
            this.loading = false;
            (this.$refs.form as any).reset();
            this.onClose();
      });
    }
  }
})
</script>
