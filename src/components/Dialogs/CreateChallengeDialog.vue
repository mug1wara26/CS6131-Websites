<template>
  <v-card>
    <v-card-title>
      Create Challenge
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field autofocus v-model="formData.name" label="Challenge Name*" :rules="nameRules"/>
        <v-row>
          <v-col cols="6">
            <v-combobox
                auto-select-first
                v-model="formData.optional.difficulty"
                label="Difficulty"
                hide-no-data
                :items="difficulties"
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
import Vue, {PropType} from "vue"
import {BasicChallenge, Challenge} from "../../../cs6131-backend/types/chalTypes";
import {CTF} from "../../../cs6131-backend/types/ctfTypes";
import * as chalApi from "@/api/chalApi"

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
      },
      existingChals: this.chals?.map(chal => chal.name)
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.formData).every((v) => (typeof v !== 'string') || v!=='') && (!this.ctf?.public || this.formData.optional.flag !== '')
    },
    difficulties(): Array<string> {
      const difficulties = ['Easy','Medium','Hard','Insane']
      const lowerCaseDiff = difficulties.map(diff => diff.toLowerCase())
      const tempChals = this.chals.filter(chal => chal.difficulty && !lowerCaseDiff.includes(chal.difficulty.toLowerCase()))
      difficulties.push(...tempChals.map(chal => chal.difficulty))

      return difficulties
    },
    categories(): Array<string> {
      const categories = ['Web', 'Pwn', 'Reverse Engineering', 'Crypto', 'Forensics', 'OSINT', 'Misc']
      const lowerCaseCategory = categories.map(category => category.toLowerCase())
      const tempChals = this.chals.filter(chal => chal.category && !lowerCaseCategory.includes(chal.category.toLowerCase()))
      categories.push(...tempChals.map(chal => chal.category))


      return categories.sort()
    }
  },
  methods: {
    onClose() {
      this.loading=false;
      this.nameRules.length = 0;
      this.flagRules.length = 0;
      this.$emit('close-dialog')
      this.formData = {
        name: '',
        optional: {
          difficulty: '',
          category: '',
          points: null,
          flag: ''
        }
      }
    },
    onCreate() {
      this.loading = true;

      this.nameRules = [
        (v: string | null) => v && v.length <= 64 || 'Max 64 characters',
        (v: string | null) => v && v.length >= 3 || 'Min 3 characters',
        (v: string | null) => v && /^[A-Za-z0-9_\s]*$/.test(v) || 'Chal Name can only contain alphanumeric characters, spaces and underscores',
        (v: string | null) => v && !this.existingChals.includes(v) || 'Chal Name taken',
      ]

      if (this.ctf?.public) {
        this.flagRules = [
          (v: string | null) => v && v.length <= 256 || 'Max 256 characters',
          (v: string | null) => v && v.length >= 3 || 'Min 3 characters',
          (v: string | null) => v && /^[A-Za-z0-9_@./#&+\-!?{}()]*$/.test(v) || 'Flag can only contain alphanumeric and special characters',
        ]
      }

      this.$nextTick(() => {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          const chal = Object.assign(new Challenge(), {
            name: this.formData.name,
            ctfid: this.ctf?.id,
            difficulty: this.formData.optional.difficulty || 'No Difficulty',
            category: this.formData.optional.category || 'No Category',
            points: this.formData.optional.points ? parseInt(this.formData.optional.points) : null,
            flag: this.formData.optional.flag || null
          })

          chalApi.create(chal).then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                const chal = data as BasicChallenge
                this.existingChals.push(chal.name)
                this.$emit('chal-created', chal)
                this.$root.$emit('alert', {alertType: 'success', alertTitle: `${chal.name} created`})
              }).finally(this.onClose)
            }
            else {
              this.$root.$emit('alert', {alertType: 'error', alertTitle: `${res.status} Error`, alertText: res.statusText})
              this.onClose();
            }
          })
        }
        else this.loading = false;
      })
    }
  },
});
</script>