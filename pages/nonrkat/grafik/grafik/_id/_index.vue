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
      <chart ref="skills_chart" :chart-data="chartData" :options="options">
      </chart>
    </div>
    <div class="col-lg-12 card mt-2">
      <div class="mt-2 m-1">
        <h4>Data RKAT</h4>
        <b-table
          show-empty
          responsive
          striped
          hover
          :items="grafik.data.rkat"
          :fields="fields"
        >
          <template v-slot:cell(fullname)="row">
            {{ row.item.fullname | capitalize }}
          </template>
          <template v-slot:cell(total_anggaran)="row">
            RP. {{ row.item.total_anggaran | currency }}
          </template>
          <template v-slot:cell(anggaran_digunakan)="row">
            RP. {{ row.item.anggaran_digunakan | currency }}
          </template>
          <template v-slot:cell(mulai_program)="row">
            <p>{{ row.item.mulai_program | convertDate }}</p>
          </template>
          <template v-slot:cell(created_at)="row">
            <p>{{ row.item.created_at | convertDate }}</p>
          </template>
          <template v-slot:cell(actions)="row">
            <NuxtLink
              class="btn btn-sm btn-outline-info"
              :to="'../../../rkat/edit/' + row.item.id_rkat"
              :key="'edit' + row.index"
              target="_blank"
              >Detail</NuxtLink
            >
          </template>
        </b-table>
      </div>
      <div class="mt-2 m-1">
        <h4>Data Pengajuan</h4>
        <b-table
          striped
          responsive
          hover
          show-empty
          :items="grafik.data.pengajuan"
          :fields="pengajuan"
        >
          <template v-slot:cell(fullname)="row">
            {{ row.item.fullname | capitalize }}
          </template>
          <template v-slot:cell(biaya_program)="row">
            RP. {{ row.item.biaya_program | currency }}
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
            <NuxtLink
              class="btn btn-sm btn-outline-info"
              :to="'../detail/' + row.item.id_pengajuan"
              :key="'edit' + row.index"
              target="_blank"
              >Detail</NuxtLink
            >
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  async asyncData({ store, params }) {
    await Promise.all([store.dispatch("subordinate/getGrafik", params.index)]);
    return;
  },
  data() {
    return {
      options: {},
      chartData: {},
      fields: [
        { key: "fullname", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "total_anggaran", label: "Total Anggaran" },
        { key: "anggaran_digunakan", label: "Anggaran dicairkan" },
        { key: "mulai_program", label: "Waktu Kegiatan" },
        { key: "created_at", label: "Waktu Pengajuan" },
        "actions",
      ],
      pengajuan: [
        { key: "fullname", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "biaya_program", label: "Anggaran" },
        { key: "validasi_status", label: "Status Pengajuan" },
        { key: "created_at", label: "Waktu Pengajuan" },
        "actions",
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
  },
};
</script>

<style></style>
