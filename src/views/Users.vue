<template>
  <v-container fluid v-if="userExists">
    <v-row>
      <v-col cols="3">
        <v-card class="pb-4">
          <template v-if="!edit">
            <v-card-title>
              <v-avatar size="56">
                <img
                    alt="user"
                    :src="avatarImage"
                />
              </v-avatar>
              <h3 class="ml-4"> {{ user.displayName }} </h3>
              <v-spacer/>
              <v-btn v-if="canEdit" icon @click="edit = true"><v-icon>mdi-pencil</v-icon></v-btn>
          </v-card-title>
          <v-card-subtitle class="mt-2"> {{ user.email }}</v-card-subtitle>
          <v-divider/>
          <v-card-text>
            <p> {{ user.bio }} </p>
          </v-card-text>
          </template>

          <template v-else>
            <v-card-title>
              Edit
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field v-model="editData.displayName" label="Display name*" autofocus :rules="displayNameRules"/>
                <v-text-field v-model="editData.email" label="Email*" :rules="emailRules"/>
                <v-text-field v-model="editData.profileLink" label="Profile link" :error-messages="profileLinkError"/>
                <v-textarea counter maxlength="200" v-model="editData.bio" label="Bio"/>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="warning" class="ml-2" @click="cancelEdit">Cancel</v-btn>
              <v-spacer/>
              <v-btn color="primary" @click="saveEdit" :loading="editLoading" :disabled="!editClean">Save</v-btn>
            </v-card-actions>
            <div class="d-flex justify-center mt-4">
              <v-btn color="error" @click="deleteAccount = true">Delete account</v-btn>
            </div>
          </template>
        </v-card>
      </v-col>

      <v-col cols="9">
        <v-container class="d-flex">
          <v-toolbar floating class="justify-center" color="transparent" elevation="0">
            <v-btn-toggle borderless rounded group mandatory v-model="selected">
              <v-btn
                  :value="item"
                  text
                  v-for="item in toolbar_items"
                  :key="item"
              >
                {{ item }}
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
        </v-container>

        <component :is="selected" :user="user"></component>
      </v-col>
    </v-row>

    <v-dialog
        v-model="deleteAccount"
        width="500"
    >
      <DeleteAccountDialog
          :username="user.username"
          @close-dialog="deleteAccount = false"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {BasicUser} from "../../cs6131-backend/types/userTypes";
import {getUser, onLogin, editUser} from "@/api/userApi";
import {AlertData} from "@/schemas/alertData";
import {setCookie} from "typescript-cookie";
import {ValidationError} from "class-validator";
import DeleteAccountDialog from "@/components/Dialogs/DeleteAccountDialog.vue";
import MyTeams from "@/components/Teams/MyTeams.vue";
import UserWriteups from "@/components/User/UserWriteups.vue";

export default Vue.extend({
  name: "Users",
  components: {DeleteAccountDialog, 'Teams': MyTeams, 'WriteUps': UserWriteups},
  data() {
    return {
      user: {} as BasicUser,
      edit: false,
      editData: {
        displayName: '',
        email: '',
        profileLink: '',
        bio: '',
      },
      validPfp: true,
      editLoading: false,
      displayNameRules: [] as Array<Function>,
      emailRules: [] as Array<Function>,
      defaultImage: require("../../public/assets/default-pfp.webp"),
      profileLinkError: '',
      deleteAccount: false,
      selected: 'Teams',
      toolbar_items: ['Teams', 'WriteUps'],
      canEdit: false
    }
  },
  computed: {
    userExists(): boolean {
      return Object.keys(this.user).length !== 0;
    },
    avatarImage(): string {
      return this.user.pfp ? this.user.pfp : this.defaultImage
    },
    editClean() : boolean {
      return (
          this.editData.displayName !== ''
          && this.editData.email !== ''
          && (
              this.editData.displayName !== this.user.displayName
              || this.editData.email !== this.user.email
              || this.editData.profileLink !== (this.user.pfp || '')
              || this.editData.bio !== (this.user.bio || '')
          )
      )
    }
  },
  methods: {
    cancelEdit() {
      this.edit = false;
      this.editLoading = false;
      this.editData = {
        displayName: this.user.displayName,
        email: this.user.email,
        profileLink: this.user.pfp || '',
        bio: this.user.bio || ''
      }
      this.displayNameRules = []
      this.emailRules = []
    },
    saveEdit() {
      this.editLoading = true;

      this.displayNameRules = [
        (displayName: string | null) => !!displayName || 'Display name is required',
        (displayName: string | null) => (displayName && displayName.length >= 3 && displayName.length < 32) || 'Display name must be between 3 and 32 characters',
        (displayName: string | null) => (displayName && /^[a-zA-Z0-9_\s]*$/.test(displayName) || 'Only alphanumeric characters, underscores and spaces are allowed')
      ]

      this.emailRules= [
        (email: string | null) => !!email || 'Email is required',
        (email: string | null) => (email && /^.+@.+\..+$/.test(email)) || 'Not a valid email'
      ]

      this.$nextTick(() => {
        //NOW trigger validation
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          const editData = {
            displayName: this.editData.displayName,
            email: this.editData.email,
            pfp: this.editData.profileLink || null,
            bio: this.editData.bio || null
          }

          this.editUserFields(editData)
        }
        else {
          this.editLoading = false
        }
      })
    },
    editUserFields(data: Record<string, any>) {
      const tempUser: {[index: string]:any} = {...this.user} as BasicUser
      for (const key in data) {
        tempUser[key] = data[key];
      }

      editUser(tempUser as BasicUser).then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            setCookie('token', data.token, {path: '', sameSite: 'Lax'})
            this.user = tempUser as BasicUser
            this.$root.$emit('alert', {alertType: 'success', alertTitle: 'Edit success'})
            this.edit = false
            this.editLoading = false
          })
        }
        if (res.status === 400) {
          res.json().then(data => {
            this.editLoading = false
            if (data) {
              const errors = data as Array<ValidationError>
              if (errors.filter(error => error.property === 'pfp')) {
                this.profileLinkError = 'Invalid URL Link'
                setTimeout(() => {
                  this.profileLinkError = ''
                }, 3000)
              }
            }
            else this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Error editing user data'})
          })
        }
        else {
          this.$root.$emit('alert', {alertType: 'error', alertTitle: 'Internal Server Error'})
          this.editLoading = false
          this.edit = false
        }
      })
    }
  },
  async created() {
    const username = this.$route.params.username;
    if (username) {
      await getUser(username).then(user => {
        this.user = user as BasicUser
        this.cancelEdit()
      }).catch(err => console.log(err))
    } else {
      this.canEdit = true;
      onLogin((err: AlertData, user: BasicUser) => {
        if (Object.keys(user).length === 0) this.$emit("open-login");
        else {
          this.user = user;
          this.cancelEdit()
        }
      })
    }
  }
})
</script>
