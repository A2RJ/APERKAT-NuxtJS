<template>
  <div class="row card shadow mb-4">
    <div class="col-xl-12 col-lg-12 card-body">
      <b-tabs content-class="mt-3" v-if="userLogin == 120">
        <b-tab title="Belum Pencairan" active>
          <!-- hide button modals -->
          <b-modal
            v-if="selectedRKAT"
            ref="modal"
            id="modal-1"
            :title="selectedRKAT"
            hide-footer
          >
            <div class="m-3">
              <!-- input form -->
              <b-form-group
                label-cols-sm="4"
                label-cols-lg="2"
                label-size="sm"
                label="Nominal Pencairan"
                label-for="pencairanNominal"
              >
                <b-form-input
                  id="pencairanNominal"
                  v-model="pencairanNominal"
                  :state="pencairanNominal ? true : false"
                  :invalid-feedback="
                    pencairanNominal
                      ? ''
                      : 'Nominal pencairan tidak boleh kosong'
                  "
                  autocomplete="off"
                  placeholder="Nominal pencairan"
                  :required="true"
                  v-on:keyup="formatPencairanNominal"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="4"
                label-cols-lg="2"
                label-size="sm"
                label="Pencairan"
                label-for="Pencairan"
              >
                <b-form-file
                  id="Pencairan"
                  v-model="pencairan"
                  :state="Boolean(pencairanStatus)"
                  v-on:change="pencairanStatusChange()"
                  placeholder="Choose or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf"
                ></b-form-file>
              </b-form-group>
              <div class="float-right">
                <button
                  class="btn btn-sm btn-outline-success mb-3"
                  @click="buktiTF"
                >
                  Upload Bukti Transfer
                </button>

                <button
                  class="btn btn-sm btn-outline-warning mb-3"
                  @click="selesaiUpload"
                >
                  Upload Bukti Transfer Selesai
                </button>
              </div>
            </div>
          </b-modal>

          <custom-table
            :items="listPencairan"
            :fields="fieldsWR2TF"
            :html="key"
            :actions="actions"
          >
            <template v-slot:kode_rkat="row">
              {{ row.item.kode_rkat }}
            </template>
            <template v-slot:rkat="row">
              {{ row.item.nama_program }}
            </template>
            <template v-slot:biaya_program="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template v-slot:biaya_disetujui="row">
              RP. {{ row.item.biaya_disetujui | currency }}
            </template>
            <template v-slot:pencairan="row">
              <ul
                v-for="pencairan in row.item.pencairan"
                :key="pencairan.index"
              >
                <li>
                  <a
                    :href="
                      'https://aperkat.uts.ac.id/api/public/file/' +
                      pencairan.images
                    "
                    >Rp. {{ pencairan.nominal | currency }}</a
                  >
                </li>
              </ul>
            </template>
            <template v-slot:actions="row">
              <b-button
                class="btn btn-sm my-1 mr-1"
                variant="outline-warning"
                v-b-modal.modal-1
                @click="
                  uploadPencairan(row.item.id_pengajuan, row.item.kode_rkat)
                "
                >Pencairan</b-button
              >
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'/pengajuan/supervisor/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="Sudah Pencairan">
          <custom-table
            :items="listSudahPencairan"
            :fields="fieldsWR2TF"
            :html="key"
            :actions="actions"
          >
            <template v-slot:kode_rkat="row">
              {{ row.item.kode_rkat }}
            </template>
            <template v-slot:rkat="row">
              {{ row.item.nama_program }}
            </template>
            <template v-slot:biaya_program="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template v-slot:biaya_disetujui="row">
              RP. {{ row.item.biaya_disetujui | currency }}
            </template>
            <template v-slot:pencairan="row">
              <ul
                v-for="pencairan in row.item.pencairan"
                :key="pencairan.index"
              >
                <li>
                  <a
                    :href="
                      'https://aperkat.uts.ac.id/api/public/file/' +
                      pencairan.images
                    "
                    >Rp. {{ pencairan.nominal | currency }}</a
                  >
                </li>
              </ul>
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'/pengajuan/supervisor/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
      </b-tabs>
      <b-tabs content-class="mt-3" v-else-if="userLogin == 121">
        <b-tab title="Belum LPJ Keuangan" active>
          <custom-table
            :items="belumLPJKeuangan"
            :fields="fieldsWR2LPJ"
            :html="key"
            :actions="actions"
          >
            <template v-slot:kode_rkat="row">
              {{ row.item.kode_rkat }}
            </template>
            <template v-slot:rkat="row">
              {{ row.item.nama_program }}
            </template>
            <template v-slot:biaya_program="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template v-slot:biaya_disetujui="row">
              RP. {{ row.item.biaya_disetujui | currency }}
            </template>
            <template v-slot:pencairan="row">
              <ul
                v-for="pencairan in row.item.pencairan"
                :key="pencairan.index"
              >
                <li>
                  <a
                    :href="
                      'https://aperkat.uts.ac.id/api/public/file/' +
                      pencairan.images
                    "
                    >Rp. {{ pencairan.nominal | currency }}</a
                  >
                </li>
              </ul>
            </template>
            <template v-slot:lpj_keuangan="row">
              <a
                v-if="row.item.lpj_keuangan"
                :href="
                  'https://aperkat.uts.ac.id/api/public/file/' +
                  row.item.lpj_keuangan
                "
                >Preview</a
              >
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'/pengajuan/supervisor/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="Periksa LPJ Keuangan">
          <custom-table
            :items="listLPJKeuangan"
            :fields="fieldsWR2LPJ"
            :html="key"
            :actions="actions"
          >
            <template v-slot:kode_rkat="row">
              {{ row.item.kode_rkat }}
            </template>
            <template v-slot:rkat="row">
              {{ row.item.nama_program }}
            </template>
            <template v-slot:biaya_program="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template v-slot:biaya_disetujui="row">
              RP. {{ row.item.biaya_disetujui | currency }}
            </template>
            <template v-slot:pencairan="row">
              <ul
                v-for="pencairan in row.item.pencairan"
                :key="pencairan.index"
              >
                <li>
                  <a
                    :href="
                      'https://aperkat.uts.ac.id/api/public/file/' +
                      pencairan.images
                    "
                    >Rp. {{ pencairan.nominal | currency }}</a
                  >
                </li>
              </ul>
            </template>
            <template v-slot:lpj_keuangan="row">
              <a
                v-if="row.item.lpj_keuangan"
                :href="
                  'https://aperkat.uts.ac.id/api/public/file/' +
                  row.item.lpj_keuangan
                "
                >Preview</a
              >
            </template>
            <template v-slot:actions="row">
              <b-button
                @click="aprroveLPJKeuangan(row.item.id_pengajuan)"
                variant="warning"
                class="btn btn-sm mr-1"
              >
                Terima</b-button
              >
              <b-button
                @click="declineLPJKeuangan(row.item.id_pengajuan)"
                variant="danger"
                class="btn btn-sm my-1 mr-1"
              >
                Tolak</b-button
              >
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'/pengajuan/supervisor/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="Sudah LPJ Keuangan">
          <custom-table
            :items="sudahLPJKeuangan"
            :fields="fieldsWR2LPJ"
            :html="key"
            :actions="actions"
          >
            <template v-slot:kode_rkat="row">
              {{ row.item.kode_rkat }}
            </template>
            <template v-slot:rkat="row">
              {{ row.item.nama_program }}
            </template>
            <template v-slot:biaya_program="row">
              RP. {{ row.item.biaya_program | currency }}
            </template>
            <template v-slot:biaya_disetujui="row">
              RP. {{ row.item.biaya_disetujui | currency }}
            </template>
            <template v-slot:pencairan="row">
              <ul
                v-for="pencairan in row.item.pencairan"
                :key="pencairan.index"
              >
                <li>
                  <a
                    :href="
                      'https://aperkat.uts.ac.id/api/public/file/' +
                      pencairan.images
                    "
                    >Rp. {{ pencairan.nominal | currency }}</a
                  >
                </li>
              </ul>
            </template>
            <template v-slot:lpj_keuangan="row">
              <a
                v-if="row.item.lpj_keuangan"
                :href="
                  'https://aperkat.uts.ac.id/api/public/file/' +
                  row.item.lpj_keuangan
                "
                >Preview</a
              >
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'/pengajuan/supervisor/edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch("subordinate/transfer"),
      store.dispatch("subordinate/lpj"),
    ]);
    return;
  },
  data() {
    return {
      userLogin: this.$store.state.auth.user[0].id_user,
      key: "id_pengajuan",
      actions: [],
      fieldsWR2TF: [
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "rkat", label: "Nama Program" },
        { key: "tanggal", label: "Waktu Pelaksanaan" },
        { key: "biaya_program", label: "RAB diajukan" },
        { key: "biaya_disetujui", label: "RAB disetujui" },
        { key: "pencairan", label: "Pencairan" },
        "actions",
      ],
      listPencairan: [],
      listSudahPencairan: [],
      fieldsWR2LPJ: [
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "rkat", label: "Nama Program" },
        { key: "tanggal", label: "Waktu Pelaksanaan" },
        { key: "biaya_program", label: "RAB diajukan" },
        { key: "biaya_disetujui", label: "RAB disetujui" },
        { key: "pencairan", label: "Pencairan" },
        { key: "lpj_keuangan", label: "LPJ Keuangan" },
        "actions",
      ],
      listLPJKeuangan: [],
      belumLPJKeuangan: [],
      sudahLPJKeuangan: [],
      selectedRKAT: "",
      selectedID: "",
      pencairanNominal: "",
      pencairan: null,
      pencairanStatus: false,
      buktiTFImage: "",
    };
  },
  computed: {
    // ...mapState("subordinate", {
    //   transfer: (state) => state.transfer,
    //   lpj: (state) => state.lpj,
    // }),
  },
  mounted() {
    if (this.userLogin == 120) {
      this.getTransfer();
      this.sudahPencairan();
    }

    if (this.userLogin == 121) {
      this.lpjKeuangan();
      this.getBelumLPJKeuangan();
      this.getSudahLPJKeuangan();
    }
  },
  methods: {
    ...mapActions("subordinate", ["approved", "declined", "autoLpjKegiatan"]),
    async lpjKeuangan() {
      this.$axios
        .get("/pengajuan/lpjKeuangan")
        .then((response) => {
          this.listLPJKeuangan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getBelumLPJKeuangan() {
      this.$axios
        .get("/pengajuan/belumLPJKeuangan")
        .then((response) => {
          this.belumLPJKeuangan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getSudahLPJKeuangan() {
      this.$axios
        .get("/pengajuan/sudahLPJKeuangan")
        .then((response) => {
          this.sudahLPJKeuangan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTransfer() {
      this.$axios
        .get("/pengajuan/transfer")
        .then((res) => {
          if (res.data) {
            this.listPencairan = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async sudahPencairan() {
      this.$axios
        .get("/pengajuan/sudahTransfer")
        .then((res) => {
          if (res.data) {
            this.listSudahPencairan = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatPencairanNominal() {
      this.pencairanNominal = this.$formatRupiah(this.pencairanNominal);
    },
    async buktiTF() {
      if (
        this.pencairan !== null &&
        this.pencairan.length !== 0 &&
        this.pencairanNominal !== "" &&
        this.pencairanNominal !== null
      ) {
        const status = this.checkFileSize(this.pencairan.size);
        if (status) {
          this.loader("loading...");
          const form = new FormData();
          form.append("file", this.pencairan);
          try {
            const res = await this.$axios.post("/pengajuan/upload", form);
            this.buktiTFImage = res.data;
            if (this.buktiTFImage) {
              const data = {
                pengajuan_id: this.selectedID,
                nominal: this.pencairanNominal.replaceAll(".", ""),
                images: this.buktiTFImage,
              };
              await this.$axios.post(`/pencairan`, data);
              // await this.$sendNotification(this.selectedID);
              this.success("Berhasil upload bukti pencairan");
              this.$refs["modal"].hide();
              window.location.reload();
            } else {
              this.failed("Upload ulang file");
            }
          } catch (e) {
            this.failed("Whoops Server Error");
          }
        }
      } else {
        this.failed("Pilih file dan input nominal");
      }
    },
    pencairanStatusChange() {
      this.pencairanStatus = true;
    },
    // check file size
    checkFileSize(size) {
      let hasil = false;
      if (size > 2097152) {
        this.failed("Ukuran file max 2MB");
        hasil = false;
      } else {
        hasil = true;
      }
      return hasil;
    },
    // Aksi upload file pencairan selesai
    async selesaiUpload() {
      this.$swal({
        title: "Warning!",
        text: "Upload bukti pencairan selesai?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loader("loading...");
            await this.approved({
              id: this.selectedID,
              message: "Pencairan selesai",
              status_validasi: 3,
              id_struktur: 24,
              next: 24,
              nama_status: "Direktur Keuangan",
              pencairan: "default.jpg",
            });
            // await this.$sendNotification(this.selectedID);
            this.success("Upload bukti pencairan selesai");
            this.$refs["modal"].hide();
            window.location.reload();
          } catch (error) {
            this.failed("Whoops Server Error");
          }
        }
      });
    },
    uploadPencairan(params, koderkat) {
      this.selectedRKAT = koderkat;
      this.selectedID = params;
      console.log(this.selectedRKAT, this.selectedID);
    },
    async aprroveLPJKeuangan(id) {
      this.$swal({
        title: "Warning!",
        text: "Terima LPJ Keuangan ?",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
        preConfirm: (login) => {},
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loader("loading...");
            const data = {
              id,
              message: result.value,
              status_validasi: 4,
              id_struktur: 24,
              nama_status: "Direktorat Keuangan",
              next: 21,
            };
            await this.approved(data);
            // await this.$sendNotification(id);
            await this.autoLpjKegiatan(id);
            this.success("Berhasil terima pengajuan");
            this.lpjKeuangan();
            this.getBelumLPJKeuangan();
          } catch (error) {
            this.failed("Gagal terima pengajuan");
          }
        }
      });
    },
    async declineLPJKeuangan(id) {
      this.$swal({
        title: "Warning!",
        text: "Tolak LPJ Keuangan ?",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
        preConfirm: (login) => {},
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            this.loader("loading...");
            const data = {
              id,
              message: result.value,
              status_validasi: 0,
              id_struktur: 24,
              nama_status: "Direktorat Keuangan",
              next: 24,
            };
            await this.approved(data);
            // await this.$sendNotification(id);
            this.success("Berhasil tolak pengajuan");
            this.lpjKeuangan();
            this.getBelumLPJKeuangan();
          } catch (error) {
            this.failed("Gagal tolak pengajuan");
          }
        }
      });
    },
    success(params) {
      this.$swal({
        width: 300,
        icon: "success",
        title: "Congrats!",
        text: params,
      });
    },
    failed(params) {
      this.$swal({
        width: 300,
        icon: "error",
        title: "Oops...",
        text: params,
      });
    },
    loader(params) {
      this.$swal({
        title: "Please wait",
        width: 300,
        text: params,
        imageUrl: "/Rocket.gif",
        showConfirmButton: false,
        allowOutsideClick: true,
      });
    },
  },
};
</script>
