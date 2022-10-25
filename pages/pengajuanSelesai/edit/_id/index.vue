<template>
  <div>
    <subordinate />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import subordinate from "~/components/form/subordinate.vue";

export default {
  async asyncData({ store, params }) {
    await Promise.all([
      store.dispatch("subordinate/getpengajuanID", params.id),
      store.dispatch("subordinate/getstatus", params.id),
      store.dispatch("subordinate/gethistory", params.id),
      store.dispatch("subordinate/kodeRKAT"),
      store.dispatch("subordinate/ikuParent"),
    ]);
    return;
  },
  components: {
    subordinate: subordinate,
  },
  mounted() {
  },
  methods: {
    ...mapMutations([
      "SET_IS_AUTH",
      "SET_STATUS",
      "SET_HISTORY",
    ]),
    ...mapActions("subordinate", ["getpengajuanID", "getstatus", "gethistory"]),
  },
};
</script>

<style>
</style>
