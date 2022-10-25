<template>
  <div class="row">
    <div class="col-lg-8">
      <div class="row">
        <div class="col-lg-12 mb-1">
          <div class="card bg-white text-center text-black shadow">
            <div class="card-body">
              <div>
                <img
                  class="img-profile rounded-circle"
                  src="~/assets/img/undraw_profile.svg"
                  style="height: 50px"
                />
              </div>

              <div>
                {{ grafik.data.user.fullname }} <br />
                {{ grafik.data.user.email }} <br />
                {{ grafik.data.user.nomor_wa }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-1">
          <div class="card bg-primary text-white shadow">
            <div class="card-body">
              Total anggaran
              <div class="text-white-50 small">
                RP. {{ grafik.data.total_anggaran_rkat | currency }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-1">
          <div class="card bg-success text-white shadow">
            <div class="card-body">
              Anggaran digunakan
              <div class="text-white-50 small">
                RP. {{ grafik.data.total_rkat_diterima | currency }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-1">
          <div class="card bg-info text-white shadow">
            <div class="card-body">
              Pengajuan diterima
              <div class="text-white-50 small">
                {{ grafik.data.pengajuan_diterima | currency }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-1">
          <div class="card bg-warning text-white shadow">
            <div class="card-body">
              Pengajuan diproses
              <div class="text-white-50 small">
                {{ grafik.data.pengajuan_progress | currency }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 card">
      <!-- <chart :data="chartData" :options="options"> </chart> -->
      <client-only>
        <doughnut-chart :data="chartData"></doughnut-chart>
      </client-only>
    </div>
    <div class="col-lg-12 card mt-2">
      <div class="mt-2 m-1">
        <h4>Data RKAT</h4>
        <custom-table-RKAT
          :perYearFilterState="true"
          :items="grafik.data.rkat"
          :fields="fields"
          :html="keyRKAT"
          :actions="actions"
        >
          <template v-slot:fullname="">
            <p>
              {{ grafik.data.user.fullname | capitalize }}
            </p>
          </template>
          <template v-slot:nama_struktur="">
            <p
              v-if="
                grafik.data.user.nama_struktur !== '0' &&
                grafik.data.user.nama_struktur_child1 == '0' &&
                grafik.data.user.nama_struktur_child2 == '0'
              "
              class="text-uppercase"
            >
              {{ grafik.data.user.nama_struktur }}
            </p>
            <p
              v-if="
                grafik.data.user.nama_struktur !== '0' &&
                grafik.data.user.nama_struktur_child1 !== '0' &&
                grafik.data.user.nama_struktur_child2 == '0'
              "
              class="text-uppercase"
            >
              {{ grafik.data.user.nama_struktur }}
            </p>
            <p
              v-if="
                grafik.data.user.nama_struktur !== '0' &&
                grafik.data.user.nama_struktur_child1 !== '0' &&
                grafik.data.user.nama_struktur_child2 !== '0'
              "
              class="text-uppercase"
            >
              {{ grafik.data.user.nama_struktur_child1 }}
            </p>
          </template>
          <template v-slot:created_at="row">
            <p>{{ row.item.created_at | convertDate }}</p>
          </template>
          <template v-slot:rencana_anggaran="row">
            <p>RP. {{ row.item.rencana_anggaran | currency }}</p>
          </template>
          <template v-slot:biaya_program="row">
            <p>RP. {{ row.item.biaya_program | currency }}</p>
          </template>
          <template v-slot:persentase="row">
            <p>
              {{
                ((row.item.biaya_program / row.item.rencana_anggaran) * 100)
                  | currency
              }}%
            </p>
          </template>
          <template v-slot:actions="row">
            <NuxtLink
              class="btn btn-sm btn-outline-info"
              :to="'/rkat/edit/' + row.item.id_rkat"
              :key="'edit' + row.index"
              >Detail</NuxtLink
            >
          </template>
        </custom-table-RKAT>
      </div>
      <div class="mt-2 m-1">
        <h4>Data Pengajuan</h4>
        <custom-table
          :perYearFilterState="true"
          :items="grafik.data.pengajuan"
          :fields="pengajuan"
          :html="key"
          :actions="actions"
          ref="table"
        >
          <template v-slot:fullname="row">
            <p>{{ row.item.fullname | capitalize }}</p>
            <b-badge :variant="row.item.validasi_status | validasiStatus">
              {{ row.item.validasi_status | validasiDetail }}
              {{ row.item.nama_status }}
            </b-badge>
          </template>
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
          <template v-slot:periode_pencairan="row">
            <p>
              {{
                row.item.periode_pencairan
                  ? row.item.periode_pencairan.period
                  : "Sedang diperiksa" | capitalize
              }}
            </p>
          </template>
          <template v-slot:biaya_program="row">
            <p>Rp. {{ row.item.biaya_program | currency }}</p>
          </template>
          <template v-slot:biaya_disetujui="row">
            <p>Rp. {{ row.item.biaya_disetujui | currency }}</p>
          </template>
          <template v-slot:created_at="row">
            <p>{{ row.item.created_at | convertDate }}</p>
          </template>
        </custom-table>
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
        "subordinate/getGrafik",
        store.$auth.$state.user[0].id_user
      ),
    ]);
    return;
  },
  data() {
    return {
      options: {},
      chartData: {},
      keyRKAT: "id_rkat",
      fields: [
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "rencana_anggaran", label: "Total Anggaran" },
        { key: "biaya_program", label: "Total Realisasi" },
        "persentase",
        "actions",
      ],
      key: "id_pengajuan",
      actions: [],
      pengajuan: [
        { key: "fullname", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "biaya_program", label: "Biaya Program" },
        { key: "periode_pencairan", label: "Periode Pencairan" },
        { key: "biaya_disetujui", label: "Biaya Disetujui" },
        { key: "created_at", label: "Waktu Pengajuan" },
        // "actions",
      ],
    };
  },
  computed: {
    ...mapState("subordinate", {
      grafik: (state) => state.grafik,
    }),
  },
  mounted() {
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    };

    this.chartData = {
      labels: ["Kas", "Kredit"],
      datasets: [
        {
          backgroundColor: ["#4e73df", "#1cc88a"],
          data: [
            this.grafik.data.total_anggaran_rkat,
            this.grafik.data.total_rkat_diterima,
          ],
        },
      ],
    };
  },
  methods: {
    ...mapActions("subordinate", ["getGrafik"]),
    idrFormat(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(number);
    },
  },
};
</script>

<style></style>
