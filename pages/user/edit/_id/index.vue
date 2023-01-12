<template>
  <div class="row">
    <!-- Area Chart -->
    <div class="col-xl-12 col-lg-12">
      <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
        >
          <h6 class="m-0 font-weight-bold text-primary">Form Ubah User</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
          <formUser />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  // middleware: ["pages/user", "roles/sekniv"],
  async asyncData({ store, params }) {
    await Promise.all([store.dispatch("user/getuserID", params.id)]);
    return;
  },
  methods: {
    ...mapActions("user", ["getuserID"]),
  },
  computed: {
    ...mapState("user", {
      userID: (state) => state.userID,
    }),
  },
};
</script>

<style></style>
