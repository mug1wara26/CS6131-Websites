<template>
  <v-container fluid>

    <h1 class="d-flex justify-center">Feedback Form</h1>
    <p class="d-flex justify-center">Your feedback will help us improve our app</p>

    <v-row class="d-flex justify-center">
      <v-col cols="3" class="d-flex flex-column align-center">
        <p>
          1. How likely are you to use this app for a CTF
          <rating/>
          2. How pleased are you with the features of this app <br/>
          <rating/>
          3. Would you recommend this app to other CTF players <br/>
          <rating/>
          4. Please suggest any features you believe are missing
          <v-textarea v-model="value"/>
        </p>

        <v-btn color="primary" min-height="0" @click="submitForm">Submit</v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-center mt-8">
      <v-alert
          v-model="alert"
          dense
          type="info"
          transition="fade-transition"
      >
        Feedback submitted
      </v-alert>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import rating from "@/components/Rating.vue";

export default Vue.extend({
  components: {
    rating
  },
  data:()=> ({
    alert: false,
    value: ''
  }),
  methods: {
    submitForm() {
      this.value = ''
      this.$emit('reset')
      this.alert=true
      setTimeout(() => {this.alert = false}, 2000)
    }
  }
})
</script>
