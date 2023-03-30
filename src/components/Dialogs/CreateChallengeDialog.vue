<template>
  <v-card>
    <v-card-title>
      Create Challenge
    </v-card-title>
    <v-card-text>
      <v-text-field autofocus v-model="formData.name" label="Challenge Name*" :rules="nameRules"/>
      <v-row>
        <v-col cols="6">
          <v-combobox
              auto-select-first
              v-model="formData.optional.difficulty"
              label="Difficulty"
              hide-no-data
              :items="[...chals].sort((a,b) => a.difficulty.localeCompare(b.difficulty))"
              item-text="difficulty"
          />
        </v-col>
        <v-col cols="6">
          <v-combobox
              auto-select-first
              v-model="formData.optional.category"
              label="Category"
              hide-no-data
              :items="categories"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-text-field type="number" v-model=formData.optional.points label="Points"/>
        </v-col>
      </v-row>

      <v-text-field v-if="ctf.public" v-model="formData.optional.flag" label="Flag*" :rules="flagRules"/>
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
import Vue, {PropType} from "vue"
import {BasicChallenge} from "../../../cs6131-backend/types/chalTypes";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";

export default Vue.extend({
  name: "CreateChallengeDialog",
  props: {
    'ctf': CTF,
    'chals': Array as PropType<BasicChallenge[]>
  },
  data() {
    return {
      loading: false,
      nameRules: [] as Array<Function>,
      flagRules: [] as Array<Function>,
      formData: {
        name: '',
        optional: {
          difficulty: '',
          category: '',
          points: null,
          flag: ''
        }
      }
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.formData).every((v) => (typeof v === 'string') && v!=='')
    },
    categories(): Array<string> {
      const categories = ['Web', 'Pwn', 'Reverse Engineering', 'Crypto', 'Forensics', 'OSINT', 'Misc']
      const lowerCaseCategory = categories.map(category => category.toLowerCase())
      const tempChals = this.chals.filter(chal => !lowerCaseCategory.includes(chal.category.toLowerCase()))
      categories.push(...tempChals.map(chal => chal.category))

      console.log(categories)

      return categories.sort()
    }
  },
  methods: {
    onClose() {},
    onCreate() {}
  }
});
</script>