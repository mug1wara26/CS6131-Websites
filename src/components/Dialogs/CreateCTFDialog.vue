<template>
  <v-card>
    <v-card-title>
      Create Team

    </v-card-title>
    <v-card-text>
      {{ ctfs.length }}/10 CTFs
      <v-form ref="form">
        <v-row>
          <v-col cols="6">
            <v-text-field autofocus v-model="formData.name" label="CTF Name*" :rules="nameRules"/>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
                auto-select-first
                v-model="formData.format"
                label="Format"
                hide-no-data
                :items="formats"
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
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

          <v-col cols="4">
            <v-autocomplete
                auto-select-first
                v-model="formData.time"
                label="Time"
                :items="timeItems"
                hide-no-data
                :filter="filterItems"
            ></v-autocomplete>
          </v-col>

          <v-col cols="4">
            <v-autocomplete
                auto-select-first
                v-model="formData.timezone"
                label="Timezone"
                hide-no-data
                :items="tz"
                item-text="label"
                item-value="label"
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-text-field v-model="formData.optional.link" label="Link (optional)"/>
        <v-textarea counter maxlength="200" v-model="formData.optional.description" label="Description (optional)"/>

        <v-row>
          <v-col cols="4">
            <v-switch
                v-model="online"
                hide-details
                inset
                :label="online ? 'Online' : 'In-Person'"
            ></v-switch>
          </v-col>

          <v-col cols="8">
            <v-text-field v-model="formData.optional.location" label="Location" :disabled="online"/>
          </v-col>

          <v-switch
              v-model="formData.isPrivate"
              :disabled="!team.public"
              :hint="team.public ? (formData.isPrivate ? 'Only your team can view this CTF' : 'Other users can join this CTF and see the challenges') : 'Team must be public before making a public CTF'"
              :label="formData.isPrivate ? 'Private' : 'Public'"
              persistent-hint
          />
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
import {BasicCTF, CTF} from "../../../cs6131-backend/types/ctfTypes";
import * as ctfAPI from "@/api/ctfApi";
import {Team} from "../../../cs6131-backend/types/teamTypes";

export default Vue.extend({
  name: "CreateCTFDialog",
  props: {
    ctfs: Array as PropType<CTF[]>,
    team: Team
  },
  data() {
    return {
      formData: {
        name: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
        time: '',
        timezone: '',
        format: 'Jeopardy',
        optional: {
          link: null,
          description: null,
          location: null
        },
        isPrivate: true
      },
      loading: false,
      menu: false,
      timeSelect: [] as Array<string>,
      timeItems: [] as Array<string>,
      tz: [
        {"label":"(GMT-12:00) International Date Line West","value":"Etc/GMT+12"},
        {"label":"(GMT-11:00) Midway Island, Samoa","value":"Pacific/Midway"},
        {"label":"(GMT-10:00) Hawaii","value":"Pacific/Honolulu"},
        {"label":"(GMT-09:00) Alaska","value":"US/Alaska"},
        {"label":"(GMT-08:00) Pacific Time (US & Canada)","value":"America/Los_Angeles"},
        {"label":"(GMT-08:00) Tijuana, Baja California","value":"America/Tijuana"},
        {"label":"(GMT-07:00) Arizona","value":"US/Arizona"},
        {"label":"(GMT-07:00) Chihuahua, La Paz, Mazatlan","value":"America/Chihuahua"},
        {"label":"(GMT-07:00) Mountain Time (US & Canada)","value":"US/Mountain"},
        {"label":"(GMT-06:00) Central America","value":"America/Managua"},
        {"label":"(GMT-06:00) Central Time (US & Canada)","value":"US/Central"},
        {"label":"(GMT-06:00) Guadalajara, Mexico City, Monterrey","value":"America/Mexico_City"},
        {"label":"(GMT-06:00) Saskatchewan","value":"Canada/Saskatchewan"},
        {"label":"(GMT-05:00) Bogota, Lima, Quito, Rio Branco","value":"America/Bogota"},
        {"label":"(GMT-05:00) Eastern Time (US & Canada)","value":"US/Eastern"},
        {"label":"(GMT-05:00) Indiana (East)","value":"US/East-Indiana"},
        {"label":"(GMT-04:00) Atlantic Time (Canada)","value":"Canada/Atlantic"},
        {"label":"(GMT-04:00) Caracas, La Paz","value":"America/Caracas"},
        {"label":"(GMT-04:00) Manaus","value":"America/Manaus"},
        {"label":"(GMT-04:00) Santiago","value":"America/Santiago"},
        {"label":"(GMT-03:30) Newfoundland","value":"Canada/Newfoundland"},
        {"label":"(GMT-03:00) Brasilia","value":"America/Sao_Paulo"},
        {"label":"(GMT-03:00) Buenos Aires, Georgetown","value":"America/Argentina/Buenos_Aires"},
        {"label":"(GMT-03:00) Greenland","value":"America/Godthab"},
        {"label":"(GMT-03:00) Montevideo","value":"America/Montevideo"},
        {"label":"(GMT-02:00) Mid-Atlantic","value":"America/Noronha"},
        {"label":"(GMT-01:00) Cape Verde Is.","value":"Atlantic/Cape_Verde"},
        {"label":"(GMT-01:00) Azores","value":"Atlantic/Azores"},
        {"label":"(GMT+00:00) Casablanca, Monrovia, Reykjavik","value":"Africa/Casablanca"},
        {"label":"(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London","value":"Etc/Greenwich"},
        {"label":"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna","value":"Europe/Amsterdam"},
        {"label":"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague","value":"Europe/Belgrade"},
        {"label":"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris","value":"Europe/Brussels"},
        {"label":"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb","value":"Europe/Sarajevo"},
        {"label":"(GMT+01:00) West Central Africa","value":"Africa/Lagos"},
        {"label":"(GMT+02:00) Amman","value":"Asia/Amman"},
        {"label":"(GMT+02:00) Athens, Bucharest, Istanbul","value":"Europe/Athens"},
        {"label":"(GMT+02:00) Beirut","value":"Asia/Beirut"},
        {"label":"(GMT+02:00) Cairo","value":"Africa/Cairo"},
        {"label":"(GMT+02:00) Harare, Pretoria","value":"Africa/Harare"},
        {"label":"(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius","value":"Europe/Helsinki"},
        {"label":"(GMT+02:00) Jerusalem","value":"Asia/Jerusalem"},
        {"label":"(GMT+02:00) Minsk","value":"Europe/Minsk"},
        {"label":"(GMT+02:00) Windhoek","value":"Africa/Windhoek"},
        {"label":"(GMT+03:00) Kuwait, Riyadh, Baghdad","value":"Asia/Kuwait"},
        {"label":"(GMT+03:00) Moscow, St. Petersburg, Volgograd","value":"Europe/Moscow"},
        {"label":"(GMT+03:00) Nairobi","value":"Africa/Nairobi"},
        {"label":"(GMT+03:00) Tbilisi","value":"Asia/Tbilisi"},
        {"label":"(GMT+03:30) Tehran","value":"Asia/Tehran"},
        {"label":"(GMT+04:00) Abu Dhabi, Muscat","value":"Asia/Muscat"},
        {"label":"(GMT+04:00) Baku","value":"Asia/Baku"},
        {"label":"(GMT+04:00) Yerevan","value":"Asia/Yerevan"},
        {"label":"(GMT+04:30) Kabul","value":"Asia/Kabul"},
        {"label":"(GMT+05:00) Yekaterinburg","value":"Asia/Yekaterinburg"},
        {"label":"(GMT+05:00) Islamabad, Karachi, Tashkent","value":"Asia/Karachi"},
        {"label":"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi","value":"Asia/Calcutta"},
        {"label":"(GMT+05:30) Sri Jayawardenapura","value":"Asia/Calcutta"},
        {"label":"(GMT+05:45) Kathmandu","value":"Asia/Katmandu"},
        {"label":"(GMT+06:00) Almaty, Novosibirsk","value":"Asia/Almaty"},
        {"label":"(GMT+06:00) Astana, Dhaka","value":"Asia/Dhaka"},
        {"label":"(GMT+06:30) Yangon (Rangoon)","value":"Asia/Rangoon"},
        {"label":"(GMT+07:00) Bangkok, Hanoi, Jakarta","value":"Asia/Bangkok"},
        {"label":"(GMT+07:00) Krasnoyarsk","value":"Asia/Krasnoyarsk"},
        {"label":"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi","value":"Asia/Hong_Kong"},
        {"label":"(GMT+08:00) Kuala Lumpur, Singapore","value":"Asia/Kuala_Lumpur"},
        {"label":"(GMT+08:00) Irkutsk, Ulaan Bataar","value":"Asia/Irkutsk"},
        {"label":"(GMT+08:00) Perth","value":"Australia/Perth"},
        {"label":"(GMT+08:00) Taipei","value":"Asia/Taipei"},
        {"label":"(GMT+09:00) Osaka, Sapporo, Tokyo","value":"Asia/Tokyo"},
        {"label":"(GMT+09:00) Seoul","value":"Asia/Seoul"},
        {"label":"(GMT+09:00) Yakutsk","value":"Asia/Yakutsk"},
        {"label":"(GMT+09:30) Adelaide","value":"Australia/Adelaide"},
        {"label":"(GMT+09:30) Darwin","value":"Australia/Darwin"},
        {"label":"(GMT+10:00) Brisbane","value":"Australia/Brisbane"},
        {"label":"(GMT+10:00) Canberra, Melbourne, Sydney","value":"Australia/Canberra"},
        {"label":"(GMT+10:00) Hobart","value":"Australia/Hobart"},
        {"label":"(GMT+10:00) Guam, Port Moresby","value":"Pacific/Guam"},
        {"label":"(GMT+10:00) Vladivostok","value":"Asia/Vladivostok"},
        {"label":"(GMT+11:00) Magadan, Solomon Is., New Caledonia","value":"Asia/Magadan"},
        {"label":"(GMT+12:00) Auckland, Wellington","value":"Pacific/Auckland"},
        {"label":"(GMT+12:00) Fiji, Kamchatka, Marshall Is.","value":"Pacific/Fiji"},
        {"label":"(GMT+13:00) Nuku'alofa","value":"Pacific/Tongatapu"}
      ],
      formats: ['Jeopardy', 'Attack-Defense', 'Mixed'],
      online: true,
      nameRules: [] as Array<Function>,
      existingCTFs: this.ctfs.map(ctf => ctf.name)
    }
  },
  computed: {
    clean(): boolean {
      return Object.values(this.formData).every((v) => v && v !== '') && (this.online || this.formData.optional.location !== '')
    }
  },
  methods: {
    onClose() {
      this.loading = false
      this.nameRules.length = 0;
      this.$emit('close-dialog');
      this.formData = {
        name: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 10),
        time: '',
        timezone: '',
        format: 'Jeopardy',
        optional: {
          link: null,
          description: null,
          location: null
        },
        isPrivate: true
      };
      this.online = true;
    },
    onCreate() {
      this.loading = true;

      this.nameRules = [
        (v: string | null) => v && v.length <= 32 || 'Max 32 characters',
        (v: string | null) => v && v.length >= 3 || 'Min 3 characters',
        (v: string | null) => v && /^[A-Za-z0-9_\s]*$/.test(v) || 'CTF Name can only contain alphanumeric characters, spaces and underscores',
        (v: string | null) => v && !this.existingCTFs.includes(v) || 'CTF Name taken',
      ];

      console.log(this.existingCTFs)
      if (!this.formData.isPrivate) {
        ctfAPI.ctfExists(this.formData.name).then(value => {
          if (value) this.existingCTFs.push(this.formData.name)
        }).finally(() => {
          this.$nextTick(() => {
            if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) this.createCTF();
            else this.loading = false;
          })
        });
      }
      else {
        this.$nextTick(() => {
          if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) this.createCTF();
          else this.loading = false;
        })
      }
    },
    createCTF() {
      const CTF = new BasicCTF();

      const dateString = `${this.formData.date}T${this.formData.time}:00.000${this.formData.timezone.slice(4,10)}`
      const date = new Date(dateString).getTime()/1000;

      Object.assign(CTF, {
        name: this.formData.name,
        teamCreator: this.team?.name,
        date: date,
        format: this.formData.format,
        url: this.formData.optional.link,
        description: this.formData.optional.description,
        location: this.formData.optional.location ? this.formData.optional.location : 'Online',
        public: !this.formData.isPrivate
      })

      ctfAPI.createCTF(CTF).then(res => {
        if (res.status === 200) {
          res.json().then(ctf => {
            this.existingCTFs.push(ctf.name)
            this.$emit('ctf-created', ctf)
            this.$root.$emit('alert', {alertType: 'success', alertTitle: `${ctf.name} created`})
          }).finally(() => {this.onClose();})
        }
        else {
          this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Error creating team', alertText: res.statusText})
          this.onClose();
        }
      })
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