<template>
  <div class="row">
    <!-- Area Chart -->
    <div class="col-xl-12 col-lg-12">
      <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
        >
          <h6 class="m-0 font-weight-bold text-primary">Pengajuan</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
          <custom-table
            :items="items"
            :fields="fields"
            :html="key"
            :actions="actions"
            ref="table"
          >
            <template v-slot:nama_program="row">
              <p class="m-0 p-0">{{ row.item.nama_program | capitalize }}</p>
              <b-badge
                class="m-0"
                :variant="row.item.validasi_status | validasiStatus"
              >
                {{ row.item.validasi_status | validasiDetail }}
                {{ row.item.nama_status }}
              </b-badge>
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
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info mt-1"
                :to="'/pengajuan/subordinate/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
              <button
                class="btn btn-sm btn-outline-danger mt-1"
                @click="deleteRows(row.item.id_pengajuan)"
              >
                Hapus
              </button>
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
  middleware: ["pages/pengajuan"],
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch(
        "subordinate/getpengajuan",
        store.$auth.$state.user[0].id_user
      ),
    ]);
    return;
  },
  data() {
    return {
      key: "id_pengajuan",
      actions: [
        {
          name: "Tambah",
          type: "link",
          link: "/pengajuan/subordinate/add",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Reset",
          type: "func",
          func: "reset",
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
        { key: "nama_program", label: "Nama Program" },
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "biaya_program", label: "Biaya Program" },
        { key: "periode_pencairan", label: "Periode Pencairan" },
        { key: "biaya_disetujui", label: "Biaya Disetujui" },
        { key: "created_at", label: "Tanggal Pengajuan" },
        "Actions",
      ],
      items: [],
    };
  },
  computed: {
    ...mapState("subordinate", {
      pengajuan: (state) => state.pengajuan,
    }),
    rows() {
      return this.pengajuan.length;
    },
  },
  mounted() {
    this.items = this.pengajuan;
  },
  methods: {
    ...mapActions("subordinate", ["getpengajuan", "deletepengajuan"]),
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status_message === 0) return "table-success";
    },
    async destroypengajuan(row) {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus pengajuan?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK, Hapus!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.deletepengajuan(row.item.id_pengajuan);
            this.$swal({
              width: 300,
              icon: "success",
              title: "Congrats!",
              text: "Data telah dihapus",
            });
            this.reload();
          } catch (error) {
            this.$swal({
              width: 300,
              icon: "error",
              title: "Oops...",
              text: "Whoops! gagal delete pengajuan",
            });
          }
        }
      });
    },
    async deleteAll() {
      this.$swal({
        title: "Warning!",
        text: "Hapus semua pengajuan?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.$axios.get(
              `/pengajuan/destroy/${this.$store.state.auth.user[0].id_user}`
            );
            this.$swal({
              width: 300,
              icon: "success",
              title: "Congrats!",
              text: "Semua pengajuan telah dihapus",
            });
            this.reload();
          } catch (error) {
            this.$swal({
              width: 300,
              icon: "error",
              title: "Oops...",
              text: "Whoops! gagal reset pengajuan",
            });
          }
        }
      });
    },
    print(params) {
      this.$axios
        .post(
          "/pengajuan/pdfByUSer/" + this.$store.state.auth.user[0].id_user,
          params
        )
        .then(() => {
          // window.open("http://localhost:8000/g/" + btoa(this.$store.state.auth.user[0].id_user));
          window.open(
            "https://aperkat.uts.ac.id/api/g/" +
              btoa(this.$store.state.auth.user[0].id_user)
          );
        });
    },
    async deleteRows(params) {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus pengajuan terpilih?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.$axios.post("/pengajuan/deleteRows", params);
            this.$swal({
              width: 300,
              icon: "success",
              title: "Congrats!",
              text: "Pengajuan telah dihapus",
            });
          } catch (error) {
            this.$swal({
              width: 300,
              icon: "error",
              title: "Oops...",
              text: "Please check your server or internet connection",
            });
          }
        }
      });
    },
    async reload() {
      await this.$nuxt.refresh();
      await this.$refs.table.reload(this.pengajuan);
    },
  },
};
</script>

<style></style>
