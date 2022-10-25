<template>
  <div class="row card shadow mb-4">
    <div class="col-xl-12 col-lg-12 card-body">
      <b-tabs content-class="mt-3">
        <b-tab title="Need Approval" active v-if="userLogin !== 23">
          <custom-table
            :items="itemsneed"
            :fields="fields"
            :html="key"
            :actions="actions"
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
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table></b-tab
        >
        <b-tab
          title="List Pencairan"
          v-if="userLogin == 22 || userLogin == 23 || userLogin == 24"
        >
          <div class="m-2 row">
            <div class="col-sm-6" v-if="userLogin == 24">
              <form @submit.stop.prevent="addPeriod">
                <b-form-group
                  label="Input Period"
                  label-for="period"
                  invalid-feedback="Period is required"
                >
                  <b-form-input
                    id="period"
                    size="sm"
                    v-model="period"
                    required
                  />
                </b-form-group>
                <button class="btn btn-sm btn-outline-success ml-2">
                  Submit
                </button>
                <b-button
                  class="btn btn-sm btn-outline-success ml-2"
                  variant="outline-success"
                  @click="printAll()"
                  v-if="userLogin == 24"
                  >Print semua list pencairan</b-button
                >
              </form>
            </div>
            <div
              class="col-sm-6"
              v-if="userLogin == 21 || userLogin == 22 || userLogin == 23"
            >
              <b-button
                variant="outline-success"
                class="btn btn-sm mt-4"
                @click="approveAll()"
                v-if="userLogin == 22 || userLogin == 23"
                >Approve semua list pencairan</b-button
              >
              <b-button
                variant="outline-success"
                class="btn btn-sm mt-4"
                @click="printAll()"
                v-if="userLogin == 22 || userLogin == 23"
                >Print semua list pencairan</b-button
              >
            </div>
            <div class="col-sm-6">
              <b-form-group
                label="Select Period"
                label-for="name-input"
                invalid-feedback="Select Period is required"
              >
                <b-form-select
                  size="sm"
                  v-model="selectedPeriod"
                  :options="options"
                  @change="selectPeriod()"
                >
                  <template #first v-if="selected.value == null">
                    <b-form-select-option :value="selected.value">{{
                      selected.text
                    }}</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>

              <div class="mt-3" v-if="userLogin == 24">
                <!-- on button click call function in child component  -->
                <b-button
                  v-b-modal.modal-xl
                  variant="outline-success"
                  class="btn btn-sm float-right"
                  @click="runYearFilter()"
                  >Add list pencairan</b-button
                >
                <b-button
                  variant="outline-success"
                  class="btn btn-sm float-right mr-2 mb-2"
                  @click="refresh()"
                  >Refresh</b-button
                >
                <b-modal
                  id="modal-xl"
                  size="xl"
                  title="Tambah ke list pencairan"
                  hide-footer
                >
                  <custom-table
                    ref="filterYear"
                    :items="itemsAddListPencairan"
                    :fields="fieldsListPencairanFormat"
                    :html="key"
                    :actions="actions"
                  >
                    <!-- created_at -->
                    <template v-slot:kode_rkat="row">
                      {{ row.item.kode_rkat }}
                    </template>
                    <template v-slot:rkat="row">
                      {{ row.item.nama_program }}
                    </template>
                    <template v-slot:biaya_program="row">
                      RP. {{ row.item.biaya_program | currency }}
                    </template>
                    <template v-slot:biaya_disetujui="row" colspan="2">
                      <b-form-input
                        v-if="itemsAddListPencairan[row.index].isEdit"
                        v-model="biaya_disetujui_keuangan"
                        @keypress="editListener"
                      >
                      </b-form-input>
                      <b-form-text
                        v-if="itemsAddListPencairan[row.index].isEdit"
                        id="input-live-help"
                        style="word-break: break-all"
                        >RP.{{
                          biaya_disetujui_keuangan | currency
                        }}</b-form-text
                      >
                      <p style="word-break: break-all" v-else>
                        RP.{{ row.item.biaya_disetujui | currency }}
                      </p>
                    </template>
                    <template v-slot:no_rek="row">
                      <p style="word-break: break-all">{{ row.item.no_rek }}</p>
                    </template>
                    <template v-slot:fullname="row">
                      <p>{{ row.item.fullname | capitalize }}</p>
                      <b-badge
                        :variant="row.item.validasi_status | validasiStatus"
                      >
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
                    <template v-slot:created_at="row">
                      <p>{{ row.item.created_at | convertDate }}</p>
                    </template>
                    <template v-slot:actions="row">
                      <b-button
                        v-if="!itemsAddListPencairan[row.index].isEdit"
                        variant="warning"
                        class="btn btn-sm mb-1 mr-1"
                        @click="editRowHandler(row)"
                      >
                        <span>Edit</span>
                      </b-button>
                      <b-button
                        v-else
                        variant="success"
                        class="btn btn-sm mb-1 mr-1"
                        @click="submitRowHandler(row)"
                      >
                        <span>Done</span>
                      </b-button>
                      <button
                        class="btn btn-sm btn-outline-info mb-1 mr-1"
                        @click="addToList(row.item)"
                      >
                        Add to list
                      </button>
                      <NuxtLink
                        class="btn btn-sm btn-outline-info"
                        :to="'edit/' + row.item.id_pengajuan"
                        :key="'edit' + row.index"
                        >Detail</NuxtLink
                      >
                    </template>
                  </custom-table>
                </b-modal>
              </div>
            </div>
          </div>
          <div class="ml-4">
            Periode {{ selected.text }}, dibuat pada
            {{ selected.created_at | convertDate }}
          </div>
          <custom-table
            :items="listPeriodePencairan"
            :fields="fieldsListPencairanFormat"
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
            <template v-slot:created_at="row">
              {{ row.item.created_at | convertDate }}
            </template>
            <template v-slot:actions="row">
              <button
                class="btn btn-sm btn-outline-danger mb-1 mr-1"
                @click="deleteFromList(row.item.id_pengajuan)"
              >
                Delete from list
              </button>
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table></b-tab
        >
        <b-tab title="LPJ Kegiatan" v-if="userLogin == 21">
          <custom-table
            :items="listLPJKegiatan"
            :fields="fieldsSekniv"
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
            <template v-slot:lpj_kegiatan="row">
              <a
                v-if="row.item.lpj_kegiatan"
                :href="
                  'https://aperkat.uts.ac.id/api/public/file/' +
                  row.item.lpj_kegiatan
                "
                >Preview</a
              >
            </template>
            <template v-slot:created_at="row">
              <p>{{ row.item.created_at | convertDate }}</p>
            </template>
            <template v-slot:actions="row">
              <b-button
                @click="aprroveLPJKegiatan(row.item.id_pengajuan)"
                variant="warning"
                class="btn btn-sm mr-1"
              >
                Terima</b-button
              >
              <b-button
                @click="declineLPJKegiatan(row.item.id_pengajuan)"
                variant="danger"
                class="btn btn-sm my-1 mr-1"
              >
                Tolak</b-button
              >
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="Belum LPJ Kegiatan" v-if="userLogin == 21">
          <custom-table
            :items="belumLPJKegiatan"
            :fields="fieldsSekniv"
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
            <template v-slot:lpj_kegiatan="row">
              <a
                v-if="row.item.lpj_kegiatan"
                :href="
                  'https://aperkat.uts.ac.id/api/public/file/' +
                  row.item.lpj_kegiatan
                "
                >Preview</a
              >
            </template>
            <template v-slot:created_at="row">
              <p>{{ row.item.created_at | convertDate }}</p>
            </template>
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="On Proggress">
          <custom-table
            :items="listOnProggress"
            :fields="fields"
            :html="key"
            :actions="actions"
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
            <template v-slot:actions="row">
              <NuxtLink
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
                :key="'edit' + row.index"
                >Detail</NuxtLink
              >
            </template>
          </custom-table>
        </b-tab>
        <b-tab title="Completed">
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
          <custom-table
            :items="itemsSelesai"
            :fields="fields"
            :html="key"
            :actions="actions"
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
                    : "Format tanpa periode" | capitalize
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
                class="btn btn-sm btn-outline-info"
                :to="'edit/' + row.item.id_pengajuan"
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
import { mapActions, mapState } from "vuex";

export default {
  middleware: ["pages/subdivisi"],
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch(
        "subordinate/pengajuanNeedApproved",
        store.$auth.$state.user[0].id_user
      ),
      store.dispatch(
        "subordinate/getsubordinates",
        store.$auth.$state.user[0].id_user
      ),
      store.dispatch(
        "subordinate/pengajuanSelesai",
        store.$auth.$state.user[0].id_user
      ),
    ]);
    return;
  },
  data() {
    return {
      key: "id_pengajuan",
      actions: [],
      fields: [
        { key: "fullname", label: "User" },
        { key: "kode_rkat", label: "Kode RKAT " },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "biaya_program", label: "Biaya Program" },
        { key: "periode_pencairan", label: "Periode Pencairan" },
        { key: "biaya_disetujui", label: "Biaya Disetujui" },
        { key: "created_at", label: "Tanggal Pengajuan" },
        "actions",
      ],
      fieldsSekniv: [
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "rkat", label: "Nama Program" },
        { key: "tanggal", label: "Waktu Pelaksanaan" },
        { key: "biaya_program", label: "RAB diajukan" },
        { key: "biaya_disetujui", label: "RAB disetujui" },
        { key: "pencairan", label: "Pencairan" },
        { key: "lpj_keuangan", label: "LPJ Keuangan" },
        { key: "lpj_kegiatan", label: "LPJ Kegiatan" },
        { key: "created_at", label: "Tanggal Pengajuan" },
        "actions",
      ],
      fieldsListPencairanFormat: [
        { key: "kode_rkat", label: "Kode RKAT" },
        { key: "rkat", label: "Nama Program" },
        { key: "tanggal", label: "Waktu Pelaksanaan" },
        { key: "biaya_program", label: "RAB diajukan" },
        { key: "biaya_disetujui", label: "RAB disetujui" },
        { key: "bank", label: "Bank" },
        { key: "no_rek", label: "No Rek" },
        { key: "atn", label: "Atas Nama" },
        { key: "created_at", label: "Tanggal Pengajuan" },
        "actions",
      ],
      listOnProggress: [],
      itemsneed: [],
      itemsAddListPencairan: [],
      data: [],
      filter1: null,
      filter2: null,
      itemsSelesai: [],
      itemsCadangan: [],
      listLPJKegiatan: [],
      belumLPJKegiatan: [],
      listPeriodePencairan: [],
      selected: null,
      options: [{ value: null, text: "Please select an option" }],
      period: null,
      selectedPeriod: null,
      biaya_disetujui_keuangan: null,
      userLogin: this.$store.state.auth.user[0].id_user,
      selected: {
        value: null,
        text: null,
        created_at: null,
      },
    };
  },
  computed: {
    ...mapState("subordinate", {
      subordinate: (state) => state.subordinate,
      subordinateneed: (state) => state.subordinateneed,
      peng: (state) => state.pengajuanDir,
    }),
  },
  mounted() {
    this.listOnProggress = this.subordinate;
    if (this.userLogin == 24) {
      // this.getItemForListPencairan();
    }
    this.itemsneed = this.subordinateneed;
    this.itemsSelesai = this.peng;
    this.itemsCadangan = this.peng;

    if (this.userLogin == 21) {
      this.getLPJKegiatan();
      this.getBelumLPJKegiatan();
    }

    if (
      this.userLogin == 21 ||
      this.userLogin == 22 ||
      (this.userLogin == 23) | (this.userLogin == 24)
    ) {
      this.getPeriod();
    }
  },
  methods: {
    ...mapActions("subordinate", [
      "getpengajuan",
      "pengajuanSelesai",
      "approved",
    ]),
    editListener() {
      // console.log(this.biaya_disetujui_keuangan);
      // this.biaya_disetujui_keuangan = this.$formatRupiah(this.biaya_disetujui_keuangan);
    },
    editRowHandler(data) {
      this.itemsAddListPencairan[data.index].isEdit =
        !this.itemsAddListPencairan[data.index].isEdit;
      this.itemsAddListPencairan.map((item) => {
        if (item.id_pengajuan != data.item.id_pengajuan) {
          item.isEdit = false;
        }
      });
      this.biaya_disetujui_keuangan = null;
    },
    submitRowHandler(data) {
      this.itemsAddListPencairan[data.index].isEdit =
        !this.itemsAddListPencairan[data.index].isEdit;
      this.$axios
        .get(
          `/period/${
            data.item.id_pengajuan
          }/${this.biaya_disetujui_keuangan.replace(/[^0-9]/g, "")}`
        )
        .then((res) => {
          this.getNeedApproved();
          this.getItemForListPencairan();
          console.log("success edit biaya disetujui");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    refresh() {
      this.$nuxt.refresh();
      this.selectPeriod();
    },
    addPeriod() {
      if (this.period) {
        this.$axios
          .post("/period", {
            period: this.period,
          })
          .then((res) => {
            this.period = null;
            this.getPeriod();
          });
      }
    },
    getPeriod() {
      this.$axios
        .get("/period")
        .then((res) => {
          for (let index = 0; index < res.data.data.length; index++) {
            this.options.push(res.data.data[index]);
          }
          this.selected.text = this.options[this.options.length - 1].text;
          this.selected.created_at =
            this.options[this.options.length - 1].created_at;
          this.$axios
            .get(
              `period/getByAtasan/${this.userLogin}/${
                this.options[this.options.length - 1].value
              }`
            )
            .then((res) => {
              this.listPeriodePencairan = res.data.data;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectPeriod() {
      let periodDetail = this.options.filter(
        (item) => item.value == this.selectedPeriod
      );
      this.selected.text = periodDetail[0].text;
      this.selected.created_at = periodDetail[0].created_at;
      if (
        this.userLogin == 21 ||
        this.userLogin == 22 ||
        this.userLogin == 23
      ) {
        this.$axios
          .get(`period/getByAtasan/${this.userLogin}/${this.selectedPeriod}`)
          .then((res) => {
            this.listPeriodePencairan = res.data.data;
          });
      } else {
        this.$axios.get(`period/${this.selectedPeriod}`).then((res) => {
          this.listPeriodePencairan = res.data.data;
        });
      }
    },
    addToList(params) {
      if (this.selectedPeriod && params.biaya_disetujui) {
        this.$axios
          .post(`/period/addList`, {
            id_pengajuan: params.id_pengajuan,
            id_period: this.selectedPeriod,
            message: "List pencairan",
            status_validasi: 2,
            id_struktur: 24,
            nama_status: "Direktorat Keuangan",
            next: 23,
          })
          .then((res) => {
            if (res.data) {
              let period = this.itemsneed.filter(
                (i) => i.id_pengajuan !== params.id_pengajuan
              );
              this.itemsneed = period;
              this.getItemForListPencairan();
              this.selectPeriod();
            }
          })
          .catch((e) => {
            console.log(e);
            this.failed("Whoops...");
          });
      } else {
        this.failed("Select period dan input biaya disetujui");
      }
    },
    deleteFromList(params) {
      this.$axios
        .post(`/period/addList`, {
          id_pengajuan: params,
          id_period: null,
          message: "List pencairan (Pending)",
          status_validasi: 0,
          id_struktur: 24,
          nama_status: "Direktorat Keuangan",
          next: 24,
        })
        .then((res) => {
          if (res.data) {
            this.getNeedApproved();
            this.selectPeriod();
          }
        })
        .catch((e) => {
          this.failed("Whoops...");
        });
    },
    approveAll() {
      this.$swal({
        title: "Warning!",
        text: "Setujui list pencairan ini?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader("loading...");
          let next = this.userLoin;
          if (this.userLogin == 23) {
            next = 22;
          }
          if (this.userLogin == 22) {
            next = 24;
          }

          for (
            let index = 0;
            index < this.listPeriodePencairan.length;
            index++
          ) {
            await this.approved({
              id: this.listPeriodePencairan[index].id_pengajuan,
              message: this.message,
              status_validasi: 2,
              id_struktur: this.userLogin,
              nama_status: this.$store.state.auth.user[0].fullname,
              next: next,
            })
              .then(() => {
                this.$nuxt.refresh();
              })
              .catch(() => {
                this.failed("Whoops Server Error");
              });
          }
          this.success("Berhasil terima pengajuan");
        }
      });
    },
    printAll() {
      // console.log(this.listPeriodePencairan);
      let print = [];
      for (let index = 0; index < this.listPeriodePencairan.length; index++) {
        print.push(this.listPeriodePencairan[index].id_pengajuan);
      }
      this.$axios
        .post(
          "/pengajuan/pdfByUSer/" + this.$store.state.auth.user[0].id_user,
          print
        )
        .then(() => {
          // window.open(
          //   "http://localhost:8000/g/" +
          //     btoa(this.$store.state.auth.user[0].id_user)
          // );
          window.open(
            "https://aperkat.uts.ac.id/api/g/" +
              btoa(this.$store.state.auth.user[0].id_user)
          );
        });
    },
    getNeedApproved() {
      this.$axios
        .get(`/pengajuan/pengajuanNeedApproved/${this.userLogin}`)
        .then((response) => {
          this.itemsneed = response.data.data.map((item) => ({
            ...item,
            isEdit: false,
          }));
        });
    },
    async runYearFilter() {
      this.itemsAddListPencairan = [];
      this.getItemForListPencairan();
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status_message === 0) return "table-success";
    },
    filter() {
      if (this.filter1 && this.filter2) {
        var startDate = new Date(this.filter1),
          endDate = new Date(this.filter2),
          result = [];

        if (this.itemsSelesai.length > this.itemsCadangan.length) {
          var result = this.itemsSelesai;
        } else {
          var result = this.itemsCadangan;
        }

        result = result.filter(
          (a) =>
            new Date(a.created_at) >= startDate &&
            new Date(a.created_at) <= endDate
        );
        this.itemsSelesai = result;
      } else {
        this.reset();
      }
    },
    reset() {
      this.listOnProggress = this.itemsCadangan;
    },
    async getItemForListPencairan() {
      this.$axios
        .get("/pengajuan/getItemForListPencairan")
        .then((res) => {
          if (res.data) {
            this.itemsAddListPencairan = res.data.map((item) => ({
              ...item,
              isEdit: false,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getLPJKegiatan() {
      this.$axios
        .get("/pengajuan/lpjKegiatan")
        .then((response) => {
          this.listLPJKegiatan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getBelumLPJKegiatan() {
      this.$axios.get("/pengajuan/belumLPJKegiatan").then((response) => {
        this.belumLPJKegiatan = response.data.data;
      });
    },
    aprroveLPJKegiatan(params) {
      this.$swal({
        title: "Warning!",
        text: "Terima LPJ Kegiatan ?",
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
          this.loader("loading...");
          this.approved({
            id: params,
            message: result.value,
            status_validasi: 4,
            id_struktur: 21,
            nama_status: this.$store.state.auth.user[0].fullname,
            next: 3333,
          })
            .then(async () => {
              this.success("Berhasil terima pengajuan");
              this.$nuxt.refresh();
            })
            .catch(() => {
              this.failed("Whoops Server Error");
            });
        }
      });
    },
    declineLPJKegiatan(params) {
      this.$swal({
        title: "Warning!",
        text: "Tolak LPJ Kegiatan ?",
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
          this.loader("loading...");
          this.approved({
            id: params,
            message: result.value,
            status_validasi: 0,
            id_struktur: 21,
            nama_status: this.$store.state.auth.user[0].fullname,
            next: 21,
          })
            .then(async () => {
              this.success("Berhasil tolak pengajuan");
              this.$nuxt.refresh();
            })
            .catch(() => {
              this.failed("Whoops Server Error");
            });
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

<style></style>
