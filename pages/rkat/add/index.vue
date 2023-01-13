<template>
  <div class="">
    <!-- <button @click="getrkat">getrkat</button> -->
    <div class="row">
      <!-- Area Chart -->
      <div class="col-xl-12 col-lg-12">
        <div class="card shadow mb-4">
          <!-- Card Header - Dropdown -->
          <div
            class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
          >
            <h6 class="m-0 font-weight-bold text-primary">Form Tambah RKAT</h6>
          </div>
          <!-- Card Body -->
          <form-rkat />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rkatform from "~/components/form/rkat.vue";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  middleware: ["roles/sekniv"],
  async asyncData({ store, params }) {
    await Promise.all([store.dispatch("rkat/getUser")]);
    return;
  },
  components: {
    "form-rkat": rkatform,
  },
  mounted() {},
  methods: {
    ...mapMutations(["SET_IS_AUTH", "SET_RKAT_USER"]),
    ...mapActions("rkat", ["getUser"]),
  },
};
</script>

<style></style>
