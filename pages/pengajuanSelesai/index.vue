<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">Pengajuan diterima</h6>
    </div>
    <div class="card-body">
      <div>
        <b-col class="my-1 float-right">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-datepicker
              id="filter1"
              v-model="filter1"
              class="mb-2"
              size="sm"
              today-button
              reset-button
              close-button
              locale="IDN"
            ></b-form-datepicker>
            <b-form-datepicker
              id="filter2"
              v-model="filter2"
              class="mb-2"
              size="sm"
              today-button
              reset-button
              close-button
              locale="IDN"
            ></b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-table :items="items" :fields="fields" show-empty>
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <template v-slot:cell(fullname)="row">
            <p>
              {{ row.item.fullname | capitalize }}
            </p>
          </template>
          <template v-slot:cell(nama_struktur)="row">
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
          <template v-slot:cell(validasi_status)="row">
            <p v-if="row.item.validasi_status == 0">
              <b-badge variant="danger"
                >Ditolak: {{ row.item.nama_status }}</b-badge
              >
            </p>
            <p v-if="row.item.validasi_status == 1">
              <b-badge variant="warning"
                >Input/Revisi: {{ row.item.nama_status }}</b-badge
              >
            </p>
            <p v-if="row.item.validasi_status == 2">
              <b-badge variant="success"
                >Diterima: {{ row.item.nama_status }}</b-badge
              >
            </p>
            <p v-if="row.item.validasi_status == 3">
              <b-badge variant="success"
                >Pencairan: {{ row.item.nama_status }}</b-badge
              >
            </p>
          </template>
          <template v-slot:cell(created_at)="row">
            <p>{{ row.item.created_at | convertDate }}</p>
          </template>
          <template v-slot:cell(actions)="row">
            {{ login == row.item.id_user }}
            <NuxtLink
              v-if="login == row.item.id_user"
              class="btn btn-sm btn-outline-info"
              :to="'pengajuan/subordinate/edit/' + row.item.id_pengajuan"
              :key="'edit' + row.index"
              target="_blank"
              >Detail</NuxtLink
            >
            <NuxtLink
              v-else
              class="btn btn-sm btn-outline-info"
              :to="'pengajuan/supervisor/edit/' + row.item.id_pengajuan"
              :key="'edit' + row.index"
              target="_blank"
              >Detail</NuxtLink
            >
          </template>
        </b-table>
        <!-- <pre>{{ data }}</pre> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  async asyncData({ store }) {
    await Promise.all([store.dispatch("subordinate/pengajuanSelesai")]);
    return;
  },
  mounted() {
    this.data = this.peng;
    this.items = this.peng;
    this.itemsCadangan = this.peng;
    this.login = this.$store.state.auth.user[0].id_user;
  },
  data() {
    return {
      data: [],
      login: null,
      filter1: null,
      filter2: null,
      fields: [
        { key: "index", label: "No." },
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "validasi_status", label: "Status Pengajuan" },
        { key: "created_at", label: "Waktu Pengajuan" },
        "actions",
      ],
      items: [],
      itemsCadangan: [],
    };
  },
  computed: {
    ...mapState("subordinate", {
      peng: (state) => state.pengajuanDir,
    }),
  },
  methods: {
    ...mapActions("subordinate", ["pengajuanSelesai"]),

    filter() {
      if (this.filter1 && this.filter2) {
        var startDate = new Date(this.filter1),
          endDate = new Date(this.filter2),
          result = [];

        if (this.items.length > this.itemsCadangan.length) {
          var result = this.items;
        } else {
          var result = this.itemsCadangan;
        }

        result = result.filter(
          (a) =>
            new Date(a.created_at) >= startDate &&
            new Date(a.created_at) <= endDate
        );
        this.items = result;
      } else {
        this.reset();
      }
    },
    reset() {
      this.items = this.itemsCadangan;
    },
  },
  watch: {
    filter1: function () {
      this.filter();
    },
    filter2: function () {
      this.filter();
    },
  },
};
</script>
