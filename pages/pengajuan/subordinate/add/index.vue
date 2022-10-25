<template>
  <div>
    <subordinate />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import subordinate from "~/components/form/subordinate.vue";

export default {
  middleware: ["pages/pengajuan"],
  async asyncData({ store }) {
    await Promise.all([store.dispatch("subordinate/kodeRKAT", store.$auth.$state.user[0].id_user)]);
    await Promise.all([store.dispatch("subordinate/ikuParent")]);
    return;
  },
  components: {
    subordinate: subordinate,
  },
  mounted() {
  },
  methods: {
    ...mapMutations(["SET_IS_AUTH"]),
    ...mapActions("subordinate", ["getpengajuan", "kodeRKAT"]),
  },
};
</script>

<style>
</style>
