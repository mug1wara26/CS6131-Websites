<template>
  <v-card>
    <v-card-title>
      Create Team

    </v-card-title>
    <v-card-text>
      {{ ctfs.length }}/10 CTFs
      <v-form ref="form">
        <v-text-field autofocus v-model="formData.name" label="CTF Name*"/>

        <v-row>
          <v-col cols="6">
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="formData.date"
                    label="Date"
                    prepend-icon="mdi-clock"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="formData.date"
                  @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="6">
            <v-autocomplete
                v-model="formData.time"
                id="time-autocomplete"
                label="Autocomplete"
                :items="timeItems"
                hide-no-data
                :filter="filterItems"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-form>

    </v-card-text>

    <v-card-actions>
      <v-btn color="warning" @click.stop="onClose">Close</v-btn>

      <v-spacer/>

      <v-btn
          color="primary"
          @click.stop="onCreate"
          :loading="loading"
          :disabled="loading || !clean"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {ctf} from "../../../cs6131-backend/types/ctfTypes";

export default Vue.extend({
  name: "CreateCTFDialog",
  props: {
    ctfs: Array as PropType<ctf[]>
  },
  data() {
    return {
      formData: {
        name: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
        time: '',
      },
      loading: false,
      menu: false,
      timeSelect: [] as Array<string>,
      timeItems: [] as Array<string>
    }
  },
  computed: {
    clean(): boolean {
      console.log(Object.values(this.formData))
      return Object.values(this.formData).every((v) => v && v !== '')
    }
  },
  methods: {
    onClose() {
      this.loading = false
      this.$emit('close-dialog');
    },
    onCreate() {

    },
    filterItems(item: any, queryText: string) {
      return item.toString().replaceAll(':', '').includes(queryText)
    }
  },
  mounted() {
    for (let i = 0; i < 4 * 24; i++) {
      let hour = Math.floor(i/4)
      let minute = (i % 4) * 15
      this.timeItems.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padEnd(2, '0')}`)
    }
    this.timeSelect = this.timeItems
  }
});
</script>