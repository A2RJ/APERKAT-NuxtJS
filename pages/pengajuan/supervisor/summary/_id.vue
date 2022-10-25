<template lang="">
  <div class="row card shadow mb-4">
    <div>
      <p @click="download()" class="mt-3 mb-0 mr-3 float-right btn btn-outline-primary">Export Data</p>
    </div>
    <div class="col-xl-12 col-lg-12 card-body">
      <b-table
        striped
        small
        show-empty
        responsive
        hover
        :fields="fields"
        :items="data"
      >
        <template #head(index)>
          <p>No.</p>
        </template>
        <template #cell(index)="data">
          <p>{{ data.index + 1 }}</p>
        </template>
        <template #cell(waktu_pelaksanan)="data">
          <p>{{ data.item.mulai_program }} - {{ data.item.selesai_program }}</p>
        </template>
        <template #cell(biaya_program)="data">
          <p>Rp. {{ data.item.biaya_program | currency }}</p>
        </template>
        <template #cell(status)="data">
          <p>{{ data.item.biaya_program ? "Telah" : "Belum" }} diajukan</p>
        </template>
        <template #cell(rkat)="data">
          <p>Rp. {{ data.item.rkat | currency }}</p>
        </template>
        <template #cell(biaya_disetujui)="data">
          <p>Rp. {{ data.item.biaya_disetujui | currency }}</p>
        </template>
        <template #cell(pencairan)="data">
          <p>{{ data.item.pencairan === "default.jpg" ? "" : data.item.biaya_program ? "Proses pencairan" : "-" }}</p>
          <ul>
            <li v-for="(item, index) in data.item.list_pencairan" :key="index">
              <a :href="'https://aperkat.uts.ac.id/api/public/file/'+ item.images">
                Rp. {{ item.nominal | currency }}
              </a>
            </li>
          </ul>
        </template>
        <template #cell(lpj_keuangan)="data">
          <a v-if="data.item.lpj_keuangan" :href="'https://aperkat.uts.ac.id/api/public/file/'+ data.item.lpj_keuangan"
                >Sudah</a>
              <p v-else>Belum</p>
        </template>
        <template #cell(lpj_kegiatan)="data">
          <a v-if="data.item.lpj_kegiatan" :href="'https://aperkat.uts.ac.id/api/public/file/'+ data.item.lpj_kegiatan">Sudah</a>
          <p v-else>Belum</p>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ["pages/subdivisi"],
  data() {
    return {
      data: [],
      fields: [
        {
          key: "index",
          label: "ID",
        },
        {
          key: "fullname",
          label: "Name",
        },
        {
          key: "kode_rkat",
          label: "Kode RKAT",
        },
        "waktu_pelaksanan",
        {
          key: "nama_program",
          label: "Nama Program",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "rkat",
          label: "Anggaran RKAT",
        },
        {
          key: "biaya_program",
          label: "Biaya Diajukan",
        },
        {
          key: "biaya_disetujui",
          label: "Biaya Disetujui",
        },
        {
          key: 'pencairan',
          label: 'Pencairan',
        },
        {
          key: "lpj_keuangan",
          label: "LPJ Keuangan",
        },
        {
          key: "lpj_kegiatan",
          label: "LPJ Kegiatan",
        },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("/pengajuan/summaryByUnit/" + this.$route.params.id)
        .then((response) => {
          this.data = response.data.data;
        })
        .catch((error) => {
          alert(error);
        });
    },
    onClick() {
      this.getData();
    },
    download(){
      let url = ''
      url = 'https://aperkat.uts.ac.id/api/public/'
      // url = 'http://localhost:8000'
      this.$axios
      .get(`${url}/pengajuan/summaryByUnit/export/${this.$route.params.id}`)
      .then((response) => {
        window.open(`${url}/${response.data.data}`);
        // return this.$axios.get(`${url}/pengajuan/summaryByUnit/delete/${response.data.data}`)
      })
      .catch((error) => {
        alert(error.message);
      });
    }
  },
};
</script>
