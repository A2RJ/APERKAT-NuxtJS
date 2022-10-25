<template>
  <!-- <button @click="getrkat">getrkat</button> -->
  <div class="row">
    <!-- Area Chart -->
    <div class="col-xl-12 col-lg-12">
      <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
        >
          <h6 class="m-0 font-weight-bold text-primary">RKAT</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
          <div class="mb-3 mx-auto" v-show="importRkat">
            <b-alert v-model="importRkat" variant="primary" dismissible>
              <div class="container">
                <div class="">
                  <b-form-group
                    label-cols="4"
                    label-cols-lg="2"
                    label-size="sm"
                    label="Pelaksana"
                    label-for="id_user"
                  >
                    <!-- :class="{ 'form-group--error': $v.selected.$error }" -->
                    <!-- v-model.trim="$v.selected.$model" -->
                    <v-select
                      v-model="selected"
                      :options="options"
                      :value="selected"
                      @input="get"
                    ></v-select>
                    <b-form-text id="id_user" v-if="pesan">
                      <i class="text-danger">Pelaksana is required</i>
                    </b-form-text>
                  </b-form-group>
                  <b-form-file
                    size="sm"
                    v-model="file1"
                    :state="Boolean(file1)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    ref="file"
                    accept=".xls, .xlsx"
                    v-on:change="handleFileUpload()"
                  ></b-form-file>
                  <b-progress-bar
                    class="my-1"
                    :value="uploadPercentage"
                    :max="100"
                    variant="info"
                    key="info"
                    show-progress
                    animated
                  ></b-progress-bar>
                  <button
                    class="btn btn-sm btn-outline-primary mt-1 ml-1"
                    v-on:click="submitFile()"
                  >
                    Import
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger mt-1 ml-1"
                    v-on:click="resetFile()"
                  >
                    Reset
                  </button>
                  <button
                    class="btn btn-sm btn-outline-info mt-1 ml-1"
                    v-on:click="downloadFile()"
                  >
                    Download template
                  </button>
                </div>
                <table
                  v-if="data"
                  class="mt-4 table table-responsive"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #112031;
                  "
                >
                  <tr>
                    <th>#</th>
                    <th>Kode RKAT</th>
                    <th>Program Kerja</th>
                    <th>Deskripsi</th>
                    <th>Mulai Program</th>
                    <th>Selesai Program</th>
                    <th>Tempat</th>
                    <th>Anggaran</th>
                  </tr>
                  <tr v-for="item in data.data" :key="item.no">
                    <td>{{ item.no }}</td>
                    <td>{{ item.kode_rkat }}</td>
                    <td>{{ item.program_kerja }}</td>
                    <td>{{ item.deskripsi }}</td>
                    <td>{{ item.mulai_program }}</td>
                    <td>{{ item.selesai_program }}</td>
                    <td>{{ item.tempat }}</td>
                    <td>RP. {{ item.total_anggaran | currency }}</td>
                  </tr>
                </table>
                <div
                  v-if="data && data.data && data.data.length == 0"
                  class="alert alert-danger my-3 text-center mx-auto"
                  role="alert"
                >
                  Data sudah terimport!
                </div>
                <div class="mt-2" v-if="data">
                  <b-button
                    variant="outline-info btn-sm mt-1"
                    @click="postImport"
                    >Simpan RKAT</b-button
                  >
                </div>

                <div
                  class="alert alert-danger my-3 text-center mx-auto"
                  v-if="error"
                  role="alert"
                >
                  {{ error }}
                </div>
              </div>
            </b-alert>
          </div>
        </div>
        <div class="card-body">
          <custom-table-RKAT
            :items="items"
            :fields="fields"
            :html="key"
            :actions="actions"
            ref="table"
          >
            <template v-slot:fullname="data">
              {{ data.value | capitalize }}
            </template>
            <template v-slot:total_anggaran="data">
              RP. {{ data.value | currency }}
            </template>
            <template v-slot:mulai_program="data">
              {{ data.value }}
            </template>
            <template v-slot:selesai_program="data">
              {{ data.value }}
            </template>
            <template v-slot:created_at="data">
              {{ data.value | convertDate }}
            </template>
            <template v-slot:anggaran_digunakan="data">
              RP. {{ data.value | currency }}
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info mt-1"
                :to="'/rkat/edit/' + row.item.id_rkat"
                :key="'edit' + row.index"
                >Ubah</NuxtLink
              >
              <button
                class="btn btn-sm btn-outline-danger mt-1"
                @click="destroyrkat(row.item.id_rkat)"
              >
                Hapus
              </button>
            </template>
          </custom-table-RKAT>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  middleware: ["pages/rkat", "roles/sekniv"],
  async asyncData({ store }) {
    await Promise.all([store.dispatch("rkat/getrkat")]);
    return;
  },
  data() {
    return {
      key: "id_rkat",
      actions: [
        {
          name: "Tambah",
          type: "link",
          link: "rkat/add",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Import",
          type: "func",
          func: "importRKAT",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Reset",
          type: "func",
          func: "deleteAll",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Select All",
          type: "func",
          func: "selectAll",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Clear Selected",
          type: "func",
          func: "clearSelected",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Print",
          type: "func",
          func: "print",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Print Selected",
          type: "func",
          func: "printSelected",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Delete Selected",
          type: "func",
          func: "deleteSelected",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
      ],
      fields: [
        { key: "fullname", label: "Pelaksana" },
        { key: "kode_rkat", label: "Kode RKAT " },
        { key: "mulai_program", label: "Mulai Kegiatan" },
        { key: "selesai_program", label: "Selesai Kegiatan" },
        { key: "created_at", label: "Waktu Pengajuan" },
        { key: "total_anggaran", label: "Total Anggaran" },
        { key: "anggaran_digunakan", label: "Anggaran dicairkan" },
        "total_anggaran",
        "actions",
      ],
      items: [],
      importRkat: false,
      file: "",
      data: null,
      id_user: null,
      error: null,
      file1: null,
      pesan: false,
      selected: [],
      options: [],
      uploadPercentage: 0,
    };
  },
  computed: {
    ...mapState("rkat", {
      rkat: (state) => state.rkat,
    }),
  },
  mounted() {
    this.items = this.rkat;
  },
  methods: {
    ...mapMutations(["SET_IS_AUTH", "SET_USER_DATA"]),
    ...mapActions("rkat", ["getrkat", "deleterkat", "getUser"]),

    destroyrkat(row) {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus RKAT?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleterkat(row)
            .then(() => {
              this.$swal({
                width: 300,
                icon: "success",
                title: "Congrats!",
                text: "RKAT data was deleted successfully",
              });
              this.reload();
            })
            .catch(() => {
              this.$swal({
                width: 300,
                icon: "error",
                title: "Oops...",
                text: "Please check your server or internet connection",
              });
            });
        }
      });
    },
    deleteAll() {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus semua RKAT?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.$axios
            .get("/rkat/destroy")
            .then(() => {
              this.$swal({
                width: 300,
                icon: "success",
                title: "Congrats!",
                text: "RKAT telah dihapus",
              });
              this.reload();
            })
            .catch(() => {
              this.$swal({
                width: 300,
                icon: "error",
                title: "Oops...",
                text: "Cek server atau koneksi anda",
              });
            });
        }
      });
    },
    print(params) {
      this.$axios
        .post("/rkat/printRows", params, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "RKAT.pdf");
          document.body.appendChild(link);
          link.click();
          this.$swal({
            width: 300,
            icon: "success",
            title: "Congrats!",
            text: "RKAT telah dihapus",
          });
        });
    },
    deleteRows(params) {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus RKAT terpilih?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios
            .post("/rkat/deleteRows", params)
            .then(() => {
              this.$swal({
                width: 300,
                icon: "success",
                title: "Congrats!",
                text: "RKAT data was deleted successfully",
              });
              this.reload();
            })
            .catch(() => {
              this.$swal({
                width: 300,
                icon: "error",
                title: "Oops...",
                text: "Please check your server or internet connection",
              });
            });
        }
      });
    },
    async reload() {
      await this.$nuxt.refresh();
      await this.$refs.table.reload(this.rkat);
    },
    importRKAT() {
      this.importRkat = true;
      this.$axios
        .get("/user/rkatUser")
        .then((res) => {
          this.options = res.data.data;
        })
        .catch((e) => {});
    },
    handleFileUpload() {
      this.file1 = this.$refs.file.files[0];
    },
    downloadFile() {
      window.open(
        "https://aperkat.uts.ac.id/api/public/draftfile/RKATemplate.xlsx"
      );
    },
    resetFile() {
      this.file1 = null;
      this.data = null;
      this.selected = [];
    },
    async submitFile() {
      if (this.selected) {
        this.pesan = false;

        /**
         * Submits the file to the server
         * Initialize the form data
         * Add the form data we need to submit
         * Make the request to the POST /single-file URL
         */
        let formData = new FormData();
        formData.append("file", this.file1);

        await this.$axios
          .post("/rkat/uploadRKAT", formData, {
            headers: {
              "Content-Type": "multipart/form-data;",
            },
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }.bind(this),
          })
          .then((res) => {
            this.data = res.data;

            this.error = null;
          })
          .catch((e) => {
            this.data = null;
            this.error = "Pastikan format file benar!";
          });
      } else {
        this.pesan = true;
      }
    },
    get(value) {
      if (value) {
        this.selected = value.label;
        this.id_user = value.code;
      }
    },
    postImport() {
      this.$axios
        .post(`/rkat/postImport/${this.id_user}`, this.data)
        .then((res) => {
          this.data = null;
          this.importRkat = false;
          this.reload();
        })
        .catch((e) => {});
    },
  },
};
</script>

<style></style>
