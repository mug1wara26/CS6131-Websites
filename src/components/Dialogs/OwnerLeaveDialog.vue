<template>
  <v-card>
    <v-card-title>Invite</v-card-title>
    <v-card-text>
      Before you leave this team, you must transfer ownership to another member
      <v-autocomplete auto-select-first label="Members" v-model="selected" :items="members"/>
    </v-card-text>
    <v-card-actions>
      <v-btn color="warning" @click="onClose">Cancel</v-btn>
      <v-spacer/>
      <v-btn color="error" @click="onLeave" :disabled="leaveDisabled">Leave</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"

export default Vue.extend({
  name: "OwnerLeave",
  props: {
    members: Array as PropType<string[]>
  },
  data() {
    return {
      leaveDisabled: false,
      selected: this.members[0]
    }
  },
  methods: {
    onClose() {
      this.$emit('close-dialog')
    },
    onLeave() {
      this.leaveDisabled = true
      this.$emit('leave', this.selected)
    }
  },
  mounted() {
    this.leaveDisabled = false
  }
})
</script>