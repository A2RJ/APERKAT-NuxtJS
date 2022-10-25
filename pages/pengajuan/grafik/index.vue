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
          <b-row>
            <b-col lg="6" class="my-1 flot-right" />

            <b-col lg="6" class="my-1 flot-right">
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Type to Search"
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <b-table
            :filter="filter"
            @filtered="onFiltered"
            :current-page="currentPage"
            :per-page="perPage"
            striped
            hover
            :items="items"
            :fields="fields"
          >
            <template #cell(nama_struktur)="row">
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
            <template #cell(rencana_anggaran)="row">
              RP. {{ row.item.rencana_anggaran | currency }}
            </template>
            <template #cell(biaya_program)="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template #cell(persentase)="row">
              {{
                ((row.item.biaya_program / row.item.rencana_anggaran) * 100)
                  | currency
              }}%
            </template>
            <template #cell(actions)="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'grafik/' + row.item.id_user"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </b-table>
          <b-row>
        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  middleware: ["pages/subdivisi"],
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
      fields: [
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "rencana_anggaran", label: "Total Anggaran" },
        { key: "biaya_program", label: "Total Realisasi" },
        "persentase",
        "actions",
      ],
      items: [],
      filter: "",
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
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
    this.totalRows = this.items.length;
  },
  methods: {
    ...mapActions("subordinate", ["getpengajuan"]),
     onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length
      // this.currentPage = 1
    },
  },
};
</script>

<style></style>
