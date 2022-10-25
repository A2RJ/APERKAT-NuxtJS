<template>
  <div>
    <pencairan-lpj-keuangan v-if="userLogin == 120 || userLogin == 121" />
    <grafik v-else />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import pencairanLpjKeuangan from "../components/pencairanLpjKeuangan.vue";

export default {
  components: { pencairanLpjKeuangan },
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
      userLogin: this.$store.state.auth.user[0].id_user,
      options: {
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
      },
      chartData: {},
      keyRKAT: "id_rkat",
      fields: [
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "created_at", label: "Waktu Pengajuan" },
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
        { key: "biaya_program", label: "Anggaran" },
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
