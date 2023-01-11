<template>
  <div class="row">
    <!-- Area Chart -->
    <div class="col-xl-12 col-lg-12">
      <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
        >
          <h6 class="m-0 font-weight-bold text-primary">Grafik Pengajuan</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
          <custom-table
            :items="items"
            :fields="fields"
            :html="key"
            :actions="actions"
          >
            <template v-slot:nama_struktur="row">
              <p
                v-if="
                  row.item.nama_struktur !== '0' &&
                  row.item.nama_struktur_child1 == '0' &&
                  row.item.nama_struktur_child2 == '0'
                "
                class="text-uppercase"
              >
                {{ row.item.nama_struktur }}
              </p>
              <p
                v-if="
                  row.item.nama_struktur !== '0' &&
                  row.item.nama_struktur_child1 !== '0' &&
                  row.item.nama_struktur_child2 == '0'
                "
                class="text-uppercase"
              >
                {{ row.item.nama_struktur }}
              </p>
              <p
                v-if="
                  row.item.nama_struktur !== '0' &&
                  row.item.nama_struktur_child1 !== '0' &&
                  row.item.nama_struktur_child2 !== '0'
                "
                class="text-uppercase"
              >
                {{ row.item.nama_struktur_child1 }}
              </p>
            </template>
            <template v-slot:created_at="row">
              <p>{{ row.item.created_at | convertDate }}</p>
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'grafik/' + row.item.id_user"
                :key="'edit' + row.index"
                target="_blank"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch(
        "subordinate/getSubordinatesGrafik",
        store.$auth.$state.user[0].id_user
      ),
    ]);
    return;
  },
  data() {
    return {
      key: "id_pengajuan",
      actions: [
        // { name: "Print", type: "func", func: "print", link: "Print", color: "btn btn-sm btn-outline-primary mt-1 ml-2" },
        // { name: "Select All", type: "func", func: "selectAll", link: "Select All", color: "btn btn-sm btn-outline-primary mt-1 ml-2" },
        // { name: "Clear Selected", type: "func", func: "clearSelected", link: "Clear Selected", color: "btn btn-sm btn-outline-primary mt-1 ml-2" },
        // { name: "Print Selected", type: "func", func: "printSelected", link: "Print Selected", color: "btn btn-sm btn-outline-primary mt-1 ml-2" },
      ],
      fields: [
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "created_at", label: "Waktu Pengajuan" },
        "actions",
      ],
      items: [],
    };
  },
  computed: {
    ...mapState("subordinate", {
      subordinatesGrafik: (state) => state.subordinatesGrafik,
    }),
    rows() {
      return this.subordinatesGrafik.data.length;
    },
  },
  mounted() {
    this.items = this.subordinatesGrafik.data;
  },
  methods: {
    ...mapActions("subordinate", ["getpengajuan"]),
  },
};
</script>

<style></style>
