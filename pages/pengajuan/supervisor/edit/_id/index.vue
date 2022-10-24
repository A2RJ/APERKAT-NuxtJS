<template>
  <div>
    <components />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import subordinate from "~/components/form/subordinate.vue";

export default {
  middleware: ["pages/subdivisi-detail"],
  async asyncData({ store, params }) {
    await Promise.all([
      store.dispatch("subordinate/getpengajuanID", params.id),
      store.dispatch("subordinate/pencairan", params.id),
      store.dispatch("subordinate/getstatus", params.id),
      store.dispatch("subordinate/gethistory", params.id),
      store.dispatch("subordinate/kodeRKAT"),
      store.dispatch("subordinate/ikuParent"),
    ]);
    return;
  },
  components: {
    components: subordinate,
  },
  mounted() {},
  methods: {
    ...mapActions("subordinate", ["getpengajuanID", "getstatus", "gethistory"]),
  },
};
</script>

<style></style>
