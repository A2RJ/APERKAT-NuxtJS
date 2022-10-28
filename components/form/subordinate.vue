<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12" v-if="this.$route.params.id">
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Status Pengajuan</h6>
        </div>
        <div class="container-timeline pl-3 pt-3">
          <ul>
            <li
              v-for="(status, index) in status.data"
              :key="index"
              :class="status.status ? 'approve' : 'decline'"
            >
              <p class="h6 fw-bold">{{ status.nama_struktur }}</p>
              <span v-if="status.lpj">
                <span v-for="(lpj, index) in status.lpj" :key="index">
                  <p :class="lpj.status ? 'text-success' : 'text-danger'">
                    {{ lpj.nama_struktur }}
                  </p>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-xl-12 col-lg-12" v-if="this.$route.params.id">
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Aksi</h6>
        </div>
        <div class="card-body">
          <button
            class="btn btn-sm btn-outline-warning m-1 mr-2"
            @click="draftLaporanKeuangan()"
          >
            Download template laporan keuangan
          </button>
          <button class="btn btn-sm btn-outline-success m-1" @click="print">
            Print pengajuan
          </button>
          <a
            v-show="form.lpj_keuangan"
            :href="
              'https://aperkat.uts.ac.id/api/public/file/' + form.lpj_keuangan
            "
            target="_blank"
          >
            <button class="btn btn-sm btn-outline-success m-1">
              LPJ Keuangan
            </button>
          </a>
          <a
            v-show="form.lpj_kegiatan"
            :href="
              'https://aperkat.uts.ac.id/api/public/file/' + form.lpj_kegiatan
            "
            target="_blank"
          >
            <button class="btn btn-sm btn-outline-success m-1">
              LPJ Kegiatan
            </button>
          </a>
          <p v-show="pencairan && pencairan.length > 0">Daftar pencairan:</p>

          <a
            v-show="form.pencairan !== null && form.pencairan !== 'default.jpg'"
            class="btn btn-sm btn-outline-success m-1"
            :href="
              'https://aperkat.uts.ac.id/api/public/file/' + form.pencairan
            "
            target="_blank"
          >
            Bukti Pencairan
          </a>
          <a
            v-for="(pencairan, index) in pencairanImg"
            :key="index"
            class="btn btn-sm btn-outline-success m-1"
            :href="
              'https://aperkat.uts.ac.id/api/public/file/' + pencairan.images
            "
            target="_blank"
            rel="noopener noreferrer"
            >Pencairan {{ index + 1 }} RP. {{ pencairan.nominal | currency }}</a
          >
          <br />
          <div>
            <div v-show="formLPJKeuangan" class="m-3">
              <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label-size="sm"
                label="LPJ Keuangan"
                label-for="LPJKeuangan"
              >
                <b-form-file
                  id="LPJKeuangan"
                  v-model="LPJKeuangan"
                  :state="Boolean(LPJKeuangan)"
                  placeholder="Choose or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf"
                ></b-form-file>
              </b-form-group>
              <button
                class="btn btn-sm btn-outline-success float-right"
                @click="uploadLPJKeuangan"
              >
                LPJ Keuangan
              </button>
            </div>
            <br />
            <div v-show="formLPJKegiatan" class="m-3">
              <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label-size="sm"
                label="LPJ Kegiatan"
                label-for="LPJKegiatan"
              >
                <b-form-file
                  id="LPJKegiatan"
                  v-model="LPJKegiatan"
                  :state="Boolean(LPJKegiatan)"
                  placeholder="Choose or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf"
                ></b-form-file>
              </b-form-group>
              <button
                class="btn btn-sm btn-outline-success float-right"
                @click="uploadLPJKegiatan"
              >
                LPJ Kegiatan
              </button>
            </div>
            <br />
            <div v-show="formLPJ1Format" class="m-3">
              <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label-size="sm"
                label="LPJ (keuangan dan kegiatan disatukan)"
                label-for="LPJKeuanganKegiatan"
              >
                <b-form-file
                  v-model="file1"
                  :state="Boolean(file1)"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                ></b-form-file>
                <div class="mt-3">
                  Selected file: {{ file1 ? file1.name : "" }}
                </div>
                <!-- <b-form-file
                  id="LPJKeuanganKegiatan"
                  v-model="LPJNewFormat"
                  :state="Boolean(LPJNewFormat)"
                  placeholder="Choose or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".pdf, .jpg, .png"
                ></b-form-file>
                <div class="mt-3">
                  Selected file: {{ LPJNewFormat ? LPJNewFormat.name : "" }}
                </div> -->
              </b-form-group>
              <button
                class="btn btn-sm btn-outline-success float-right"
                @click="uploadLPJNewFormat"
              >
                Upload LPJ
              </button>
            </div>
          </div>
          <br />
          <div v-show="option" class="m-3">
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="Pesan"
              label-for="message"
            >
              <b-form-input
                id="message"
                size="sm"
                class="mb-3"
                v-model="message"
              ></b-form-input>
              <div class="float-right">
                <button class="btn btn-sm btn-outline-danger" @click="tolak">
                  Tolak <span v-show="terimaLPJ">LPJ</span>
                </button>
                <button class="btn btn-sm btn-outline-success" @click="terima">
                  Terima <span v-show="terimaLPJ">LPJ</span>
                </button>
              </div>
            </b-form-group>
          </div>
        </div>
      </div>
    </div>

    <div
      class="col-xl-12 col-lg-12"
      v-if="this.$route.name == 'pengajuan-subordinate-add'"
    >
      <div class="card mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Referensi</h6>
        </div>
        <div class="card-body">
          <b-button
            class="btn btn-sm my-2 mr-2"
            variant="outline-success"
            @click="downloadFile()"
            >Download Template RAB
          </b-button>
          <b-button
            class="btn btn-sm my-2 mr-2"
            variant="outline-success"
            @click="satuanHarga()"
            >Referensi Satuan Harga
          </b-button>
        </div>
      </div>
    </div>

    <div
      :class="
        this.$route.params.id ? 'col-xl-8 col-lg-7' : 'col-xl-12 col-lg-12'
      "
    >
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Pengajuan</h6>
        </div>
        <div class="card-body">
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Kode RKAT"
            label-for="kode_rkat"
            :class="{ 'form-group--error': $v.kode_rkat.$error }"
          >
            <v-select
              v-model.trim="$v.kode_rkat.$model"
              :options="options"
              :value="kode_rkat"
              @input="getDataRKAT"
            ></v-select>
            <b-form-text id="kode_rkat" v-if="!$v.kode_rkat.required">
              <i class="text-danger">Kode RKAT is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Nama Kegiatan"
            label-for="nama_kegiatan"
          >
            <b-form-input
              v-model="rkat.nama_kegiatan"
              id="nama_kegiatan"
              size="sm"
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Latar belakang pelaksanaan kegiatan"
            label-for="latar_belakang"
            :class="{ 'form-group--error': $v.form.latar_belakang.$error }"
          >
            <b-form-textarea
              v-model.trim="$v.form.latar_belakang.$model"
              id="textarea"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-form-text
              id="latar_belakang"
              v-if="!$v.form.latar_belakang.required"
            >
              <i class="text-danger"
                >Latar belakang pelaksanaan kegiatan is required</i
              >
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Tujuan Kegiatan"
            label-for="tujuan"
          >
            <b-form-textarea
              v-model="rkat.tujuan"
              id="textarea"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
              readonly
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Sasaran"
            label-for="sasaran"
            :class="{ 'form-group--error': $v.form.sasaran.$error }"
          >
            <b-form-input
              v-model.trim="$v.form.sasaran.$model"
              id="sasaran"
              size="sm"
            ></b-form-input>
            <b-form-text id="sasaran" v-if="!$v.form.sasaran.required">
              <i class="text-danger">Sasaran is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Target Capaian"
            label-for="target_capaian"
            :class="{ 'form-group--error': $v.form.target_capaian.$error }"
          >
            <b-form-textarea
              v-model.trim="$v.form.target_capaian.$model"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
              id="target_capaian"
            ></b-form-textarea>
            <b-form-text
              id="target_capaian"
              v-if="!$v.form.target_capaian.required"
            >
              <i class="text-danger">Target capaian is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Bentuk Pelaksanaan Program"
            label-for="bentuk_pelaksanaan_program"
            :class="{
              'form-group--error': $v.form.bentuk_pelaksanaan_program.$error,
            }"
          >
            <b-form-input
              v-model.trim="$v.form.bentuk_pelaksanaan_program.$model"
              id="bentuk_pelaksanaan_program"
              size="sm"
            ></b-form-input>
            <b-form-text
              id="bentuk_pelaksanaan_program"
              v-if="!$v.form.bentuk_pelaksanaan_program.required"
            >
              <i class="text-danger">Bentuk pelaksanaan program is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Tempat Program"
            label-for="tempat_program"
            :class="{ 'form-group--error': $v.form.tempat_program.$error }"
          >
            <b-form-textarea
              v-model.trim="$v.form.tempat_program.$model"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
              id="tempat_program"
            ></b-form-textarea>
            <b-form-text
              id="tempat_program"
              v-if="!$v.form.tempat_program.required"
            >
              <i class="text-danger">Tempat program is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Tanggal"
            label-for="tanggal"
            :class="{ 'form-group--error': $v.form.tanggal.$error }"
          >
            <b-form-datepicker
              id="tanggal"
              v-model.trim="$v.form.tanggal.$model"
              class="mb-2"
              size="sm"
              today-button
              reset-button
              close-button
              locale="IDN"
            ></b-form-datepicker>
            <b-form-text id="tanggal" v-if="!$v.form.tanggal.required">
              <i class="text-danger">Tanggal is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Bidang Terkait"
            label-for="bidang_terkait"
            :class="{ 'form-group--error': $v.form.bidang_terkait.$error }"
          >
            <b-form-input
              v-model.trim="$v.form.bidang_terkait.$model"
              id="bidang_terkait"
              size="sm"
            ></b-form-input>
            <b-form-text
              id="bidang_terkait"
              v-if="!$v.form.bidang_terkait.required"
            >
              <i class="text-danger">Bidang terkait is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="IKU"
            label-for="id_iku_parent"
            :class="{ 'form-group--error': $v.id_iku_parent.$error }"
          >
            <v-select
              v-model.trim="$v.id_iku_parent.$model"
              :options="parent"
              :value="id_iku_parent"
              @input="getIku1"
            ></v-select>
            <b-form-text id="id_iku_parent" v-if="!$v.id_iku_parent.required">
              <i class="text-danger">IKU is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label=""
            label-for="id_iku_child1"
            :class="{ 'form-group--error': $v.id_iku_child1.$error }"
          >
            <v-select
              v-model.trim="$v.id_iku_child1.$model"
              :options="child1"
              :value="id_iku_parent"
              @input="getIku2"
            ></v-select>
            <b-form-text id="id_iku_child1" v-if="!$v.id_iku_child1.required">
              <i class="text-danger">Sub IKU is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label=""
            label-for="id_iku_child2"
            :class="{ 'form-group--error': $v.id_iku_child2.$error }"
          >
            <v-select
              v-model.trim="$v.id_iku_child2.$model"
              :options="child2"
              :value="id_iku_child2"
              @input="getIku3"
            ></v-select>
            <b-form-text id="id_iku_child2" v-if="!$v.id_iku_child2.required">
              <i class="text-danger">Sub Sub is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Bank"
            label-for="bank"
            :class="{ 'form-group--error': $v.form.bank.$error }"
          >
            <b-form-input
              v-model.trim="$v.form.bank.$model"
              id="bank"
              size="sm"
            ></b-form-input>
            <b-form-text id="bank" v-if="!$v.form.bank.required">
              <i class="text-danger">Bank is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Atas Nama Penerima"
            label-for="atn"
            :class="{ 'form-group--error': $v.form.atn.$error }"
          >
            <b-form-input
              v-model.trim="$v.form.atn.$model"
              id="atn"
              size="sm"
            ></b-form-input>
            <b-form-text id="atn" v-if="!$v.form.atn.required">
              <i class="text-danger">ATN is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="No.Rekening"
            label-for="no_rek"
            :class="{ 'form-group--error': $v.form.no_rek.$error }"
          >
            <b-form-input
              v-model.trim="$v.form.no_rek.$model"
              id="no_rek"
              size="sm"
            ></b-form-input>
            <b-form-text id="no_rek" v-if="!$v.form.no_rek.required">
              <i class="text-danger">No.Rekening is required</i>
            </b-form-text>
            <b-form-text id="no_rek" v-if="!$v.form.no_rek.numeric">
              <i class="text-danger">No.Rekening is numeric</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Biaya Program"
            label-for="biaya_program"
            :class="{ 'form-group--error': $v.form.biaya_program.$error }"
          >
            <!-- v-model.trim="$v.form.biaya_program.$model" -->
            <b-form-input
              :value="$v.form.biaya_program.$model | currency"
              v-on:keyup="numberFormatBiayaProgram"
              id="biaya_program"
              size="sm"
              readonly
            ></b-form-input>
            <b-form-text
              id="biaya_program"
              v-if="!$v.form.biaya_program.required"
            >
              <i class="text-danger">Biaya program is required</i>
            </b-form-text>
          </b-form-group>

          <b-form-group
            v-show="button"
            label-cols="4"
            label-cols-lg="2"
            label-size="sm"
            label="Import RAB (.XLS/XLSX)"
            label-for="rab"
            :class="{ 'form-group--error': $v.file.$error }"
          >
            <b-button
              variant="outline-success btn-sm mr-2 mb-2"
              @click="toggleUploadRAB()"
              >Upload file RAB</b-button
            >
            <b-button
              variant="outline-success btn-sm mb-2"
              @click="toggleInputRAB()"
              >Input RAB manual</b-button
            >
          </b-form-group>

          <div v-if="uploadRAB" class="mb-5">
            <b-form-file
              id="rab"
              v-model.trim="$v.file.$model"
              :state="Boolean(file)"
              placeholder="Choose or drop it here..."
              drop-placeholder="Drop file here..."
              accept=".xls, .xlsx"
            ></b-form-file>
            <b-form-text id="rab" v-if="!$v.file.required">
              <i class="text-danger">Upload file </i>
            </b-form-text>
            <div class="mt-3" v-if="rab">
              Current file:
              <a
                :href="'https://aperkat.uts.ac.id/api/public/file/' + rab"
                target="_blank"
                >RAB
              </a>
            </div>
            <b-button
              variant="outline-success"
              class="btn btn-sm float-right my-2"
              @click="upload()"
              >Upload
            </b-button>
          </div>

          <div v-if="inputRAB" class="mb-5 custom-style">
            <b-table
              striped
              small
              responsive
              hover
              :items="itemsHeader"
              :fields="fields"
              v-show="button"
            >
              <template #cell(jenis_barang)>
                <b-form-textarea
                  id="nama_barang"
                  v-model="nama_barang"
                  max-rows="8"
                  required
                ></b-form-textarea>
              </template>
              <template #cell(harga_satuan)>
                <b-form-textarea
                  @keyup="numberFormatHargaSatuan"
                  id="satuan"
                  v-model="harga_satuan"
                  max-rows="8"
                  required
                ></b-form-textarea>
              </template>
              <template #cell(qty)>
                <b-form-textarea
                  id="qty"
                  v-model="qty"
                  max-rows="8"
                  required
                ></b-form-textarea>
              </template>
              <template #cell(total)>
                {{ (qty * harga_satuan.replaceAll(".", "")) | currency }}
              </template>
              <template #cell(keterangan)>
                <b-form-textarea
                  id="qty"
                  v-model="ket"
                  max-rows="8"
                  placeholder="Opsional"
                  required
                ></b-form-textarea>
              </template>
              <template #cell(action)>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-success"
                  @click="addRAB()"
                >
                  Tambah
                </button>
              </template>
            </b-table>
          </div>

          <div v-if="items.length > 0">
            <b-table
              striped
              small
              responsive
              hover
              :items="items"
              :fields="fields"
            >
              <template #cell(harga_satuan)="data">
                Rp. {{ data.item.harga_satuan | currency }}
              </template>
              <template #cell(total)="data">
                Rp. {{ data.item.total | currency }}
              </template>
              <template #cell(action)="data">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  v-show="button"
                  @click="hapus(data.item.no)"
                >
                  Hapus
                </button>
              </template>
            </b-table>
          </div>

          <button
            class="btn btn-sm btn-primary float-right"
            v-show="button"
            @click="submit"
          >
            Simpan Pengajuan
          </button>
        </div>
      </div>
    </div>

    <div class="col-xl-4 col-lg-5" v-if="this.$route.params.id">
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">History</h6>
        </div>
        <div class="card-body">
          <ul v-for="(history, index) in history" :key="index">
            <li
              :class="history.status_validasi ? 'text-success' : 'text-warning'"
            >
              {{ history.status_validasi ? "Diterima" : "Ditolak" }} oleh
              {{ history.message }} ({{ history.created_at | convertDate }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  required,
  numeric,
  maxLength,
  requiredIf,
} from "vuelidate/lib/validators";

export default {
  async created() {
    if (this.$route.params.id) {
      this.getDataRKAT(this.forms.kode_rkat);
      this.doubleIKU(this.forms.id_iku_child1, this.forms.id_iku_child2);
      this.getIku4(this.forms.id_iku_child1);
      this.getIku5(this.forms.id_iku_child2);
      this.ikuParent.data
        .filter((el) => el.code === 3)
        .forEach((el) => (this.id_iku_parent = el.label));
      this.rab = this.forms.rab;

      this.form = {
        kode_rkat: this.forms.kode_rkat,
        id_user: this.forms.id_user,
        next: this.forms.next,
        latar_belakang: this.forms.latar_belakang,
        sasaran: this.forms.sasaran,
        target_capaian: this.forms.target_capaian,
        bentuk_pelaksanaan_program: this.forms.bentuk_pelaksanaan_program,
        tempat_program: this.forms.tempat_program,
        tanggal: this.forms.tanggal,
        bidang_terkait: this.forms.bidang_terkait,
        id_iku_parent: this.forms.id_iku_parent,
        id_iku_child1: this.forms.id_iku_child1,
        id_iku_child2: this.forms.id_iku_child2,
        biaya_program: this.$formatRupiah(this.forms.biaya_program),
        bank: this.forms.bank,
        atn: this.forms.atn,
        no_rek: this.forms.no_rek,
        rab: this.forms.rab,
        status_pengajuan: "progress",
        pencairan: this.forms.pencairan,
        lpj_keuangan: this.forms.lpj_keuangan,
        lpj_kegiatan: this.forms.lpj_kegiatan,
        validasi_status: this.forms.validasi_status,
        nama_status: this.forms.nama_status,
      };

      // get rab
      await this.getRAB(this.$route.params.id);
    }
  },
  data() {
    return {
      file1: null,
      file2: null,
      form: {
        kode_rkat: null,
        id_user: this.$store.state.auth.user[0].id_user,
        latar_belakang: null,
        sasaran: null,
        target_capaian: null,
        bentuk_pelaksanaan_program: null,
        tempat_program: null,
        tanggal: null,
        bidang_terkait: null,
        id_iku_parent: null,
        id_iku_child1: null,
        id_iku_child2: null,
        biaya_program: null,
        bank: null,
        atn: null,
        no_rek: null,
        rab: null,
        status_pengajuan: "progress",
        pencairan: null,
        id_atasan: null,
        lpj_keuangan: null,
        lpj_kegiatan: null,
        validasi_status: 0,
        nama_status: 0,
      },
      id_iku_parent: [],
      id_iku_child1: [],
      id_iku_child2: [],
      kode_rkat: [],
      rkat: {
        nama_kegiatan: null,
        tujuan: null,
      },
      norek: null,
      button: true,
      selected: null,
      options: [],
      parent: [],
      child1: [],
      child2: [],
      option: [],
      redirects: "/pengajuan/subordinate",
      selectChild1: {
        name: "",
        value: "",
      },
      selectChild2: {
        name: "",
        value: "",
      },
      file: [],
      rab: false,
      message: "",
      formPencairan: false,
      pencairan: null,
      pencairanStatus: false,
      formLPJKeuangan: false,
      formLPJKegiatan: false,
      LPJKeuangan: [],
      LPJKegiatan: [],
      LPJNewFormat: [],
      formLPJ1Format: false,
      view: {
        pencairan: false,
        keuangan: false,
        kegiatan: false,
      },
      number: null,
      next: null,
      terimaLPJ: null,
      pencairanImg: [],
      buktiTFImage: null,
      pencairanNominal: null,
      userLogin: this.$store.state.auth.user[0].id_user,
      // rab
      nama_barang: "",
      harga_satuan: "",
      qty: "",
      ket: "",
      fields: [
        { key: "jenis_barang", label: "Jenis Barang" },
        { key: "harga_satuan", label: "Harga Satuan" },
        { key: "qty", label: "Qty" },
        { key: "total", label: "Total" },
        { key: "keterangan", label: "Keterangan" },
        { key: "action", label: "Action" },
      ],
      items: [],
      itemsHeader: [
        {
          jenis_barang: "jenis_barang",
          harga_satuan: "harga_satuan",
          qty: "qty",
          total: "total",
          keterangan: "ket",
          action: "action",
        },
      ],
      listData: [],
      total: 0,
      uploadRAB: false,
      inputRAB: false,
    };
  },
  validations: {
    kode_rkat: {
      required,
    },
    id_iku_parent: {
      required,
    },
    id_iku_child1: {
      required,
    },
    id_iku_child2: {
      required,
    },
    form: {
      id_user: {
        required,
      },
      latar_belakang: {
        required,
      },
      sasaran: {
        required,
      },
      target_capaian: {
        required,
      },
      bentuk_pelaksanaan_program: {
        required,
      },
      tempat_program: {
        required,
      },
      tanggal: {
        required,
      },
      bidang_terkait: {
        required,
      },
      biaya_program: {
        required,
      },
      bank: {
        required,
      },
      atn: {
        required,
      },
      no_rek: {
        required,
        numeric,
        maxLength: maxLength(20),
      },
    },
    file: {
      required: requiredIf(function () {
        this.$route.name == "pengajuan-subordinate-add";
      }),
    },
  },
  computed: {
    ...mapState("subordinate", {
      forms: (state) => state.data,
      status: (state) => state.status,
      history: (state) => state.history,
      errors: (state) => state.errors,
      kodeRKAT: (state) => state.kodeRKAT,
      approve: (state) => state.approve,
      decline: (state) => state.decline,
      ikuParent: (state) => state.ikuParent,
      ikuChild1: (state) => state.ikuChild1,
      ikuChild2: (state) => state.ikuChild2,
      errors: (state) => state.errors,
      pencairanImages: (state) => state.pencairan,
    }),
  },
  mounted() {
    this.load();
    this.options = this.kodeRKAT.data;
    this.parent = this.ikuParent.data;
    this.pencairanImg = this.pencairanImages.data;
  },
  methods: {
    ...mapActions("subordinate", [
      "storepengajuan",
      "getpengajuanID",
      "updatepengajuan",
      "approved",
      "declined",
      "getIkuChild1",
      "getIkuChild2",
      "getstatus",
    ]),
    load() {
      if (this.$route.params.id) {
        if (!this.status.isNewFormat) {
          this.button = false;
          this.option = false;
          // console.log(this.status.data[index - 1].status ); // untuk mengecek pengajuan sebelumnya
          // jika user login == atasan && status belum diterima && status sebelumnya diterima maka option true
          for (let index = 1; index < this.status.data.length; index++) {
            if (
              this.status.data[index].id_user == this.userLogin &&
              this.status.data[index].status == false &&
              this.status.data[index - 1].status !== false &&
              this.status.data[index + 1].id_user !== 1111
            ) {
              this.option = true;
            }
          }
          // jika dir keuangan maka upload pencairan
          if (
            // this.userLogin == 24 && // ubah kesini jika keuangan yg lakukan pencairan
            this.userLogin == 120 &&
            this.status.data[this.status.data.length - 4].status &&
            this.status.data[this.status.data.length - 3].status == false
          ) {
            this.form.lpj_keuangan && this.form.lpj_kegiatan
              ? (this.formPencairan = false)
              : ((this.formPencairan = true), (this.option = false));
          }
          // jika user login == pengaju && sudah pencairan maka formLPJ true
          if (
            this.status.data[0].id_user == this.userLogin &&
            this.status.data[this.status.data.length - 3].status &&
            this.status.data[this.status.data.length - 2].lpj[0].status == false
          ) {
            this.formLPJKeuangan = true;
            this.option = false;
          }
          if (
            this.status.data[0].id_user == this.userLogin &&
            this.status.data[this.status.data.length - 3].status &&
            this.status.data[this.status.data.length - 2].lpj[0].status &&
            this.status.data[this.status.data.length - 2].lpj[1].status == false
          ) {
            this.formLPJKegiatan = true;
            this.option = false;
          }
          // jika sekniv/dir keuangan maka tampilkan form terima/tolak lpj
          if (
            // (this.userLogin == 24 && // ubah kesini jika keuangan yg lakukan pencairan
            (this.userLogin == 121 &&
              this.forms.lpj_keuangan &&
              this.status.data[this.status.data.length - 2].lpj[0].status ==
                false) ||
            (this.userLogin == 21 &&
              this.forms.lpj_kegiatan &&
              this.status.data[this.status.data.length - 2].lpj[1].status ==
                false)
          ) {
            this.terimaLPJ = 4;
            this.option = true;
          }
        } else {
          this.button = false;
          this.option = false;

          this.status.data.forEach((item, index) => {
            if (
              item.id_user == this.userLogin &&
              item.status == false &&
              this.status.data[index - 1].status !== false &&
              this.status.data[index + 1].id_user !== 1111
            ) {
              this.option = true;
            }
          });

          if (
            this.status.data[0].id_user == this.userLogin &&
            this.status.data[this.status.data.length - 3].status &&
            this.status.data[this.status.data.length - 2].status == false
          ) {
            this.formLPJ1Format = true;
            this.option = false;
          }
        }

        // jika user adalah dir keuangan maka tidak bisa terima/revisi karena hanya bisa add to list
        if (+this.userLogin === 24) {
          this.option = false;
        }

        if (
          this.status.data[0].id_user == this.userLogin &&
          this.$route.name == "pengajuan-subordinate-edit-id"
        ) {
          this.$axios
            .get(`/pengajuan/validasi/${this.$route.params.id}`)
            .then((res) => {
              if (res.data) {
                this.button = true;
              } else {
                this.button = false;
              }
            });
        }
      }
    },
    replace() {
      // this.form.biaya_program = this.form.biaya_program.replaceAll(".", "");
    },
    downloadFile() {
      window.open(
        "https://aperkat.uts.ac.id/api/public/draftfile/RABTemplate2022.xlsx"
      );
    },
    satuanHarga() {
      window.open(
        `https://aperkat.uts.ac.id/api/public/draftfile/satuan_harga.xlsx`
      );
    },
    draftLaporanKeuangan() {
      window.open(
        `https://aperkat.uts.ac.id/api/public/draftfile/laporan-keuangan.docx`
      );
    },
    getIku1(value) {
      if (value) {
        this.form.id_iku_parent = value.code;
        this.getIkuChild1(value.code).then(() => {
          this.child1 = this.ikuChild1.data;
        });
      } else {
        this.child1 = [];
        this.child2 = [];
        this.id_iku_child1 = [];
        this.id_iku_child2 = [];
      }
    },
    getIku2(value) {
      if (value) {
        this.form.id_iku_child1 = value.code;
        this.getIkuChild2(value.code).then(() => {
          this.child2 = this.ikuChild2.data;
        });
      } else {
        this.child2 = [];
        this.id_iku_child2 = [];
      }
    },
    getIku3(value) {
      if (value) {
        this.form.id_iku_child2 = value.code;
      }
    },
    getIku4(value) {
      this.getIkuChild1(value).then(() => {
        this.child1 = this.ikuChild1.data;
      });
    },
    getIku5(value) {
      this.getIkuChild2(value).then(() => {
        this.child2 = this.ikuChild2.data;
      });
    },
    async doubleIKU(params1, params2) {
      this.$axios.get(`iku/child1ByID/${params1}`).then((res) => {
        this.id_iku_child1 = res.data.data.label;
      });

      this.$axios.get(`iku/child2ByID/${params2}`).then((res) => {
        this.id_iku_child2 = res.data.data.label;
      });
    },
    toggleInputRAB() {
      if (this.uploadRAB) this.uploadRAB = false;
      this.inputRAB = !this.inputRAB;
    },
    toggleUploadRAB() {
      if (this.inputRAB) this.inputRAB = false;
      this.uploadRAB = !this.uploadRAB;
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.failed("Pastikan semua fields diisi!");
      } else {
        this.loader("Saving pengajuan");
        this.replace();

        try {
          if (this.$route.name === "pengajuan-subordinate-edit-id") {
            const data = Object.assign(
              {
                id: this.$route.params.id,
                status_validasi: 1,
                message: "Update pengajuan",
                id_struktur: this.form.id_user,
                nama_status: this.$store.state.auth.user[0].fullname,
              },
              this.form
            );
            await this.$axios.post(`/pengajuan/${this.$route.params.id}`, data);
            await this.postRAB(this.$route.params.id);
            this.success("Data telah disimpan!");
            window.location.reload();
          } else {
            const data = Object.assign(
              {
                id_struktur: this.userLogin,
                status_validasi: 1,
                message: "Input pengajuan",
                nama_status: this.$store.state.auth.user[0].fullname,
                next: null,
              },
              this.form
            );
            const res = await this.$axios.post("/pengajuan", data);
            await this.postRAB(res.data.id_pengajuan);
            this.success("Data telah disimpan!");
            this.$router.push(this.redirects);
          }
        } catch (error) {
          let message = "";
          if (error.response) {
            message =
              error.response.data && error.response.data.message
                ? error.response.data.message
                : error.response.data;
          } else if (error.request) {
            message = error.request;
          } else {
            message = error.message;
          }
          this.failed(message);
        }
      }
    },
    async terima() {
      this.$swal({
        title: "Warning!",
        text: "Setujui pengajuan ini?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          for (let index = 1; index < this.status.data.length; index++) {
            if (
              this.status.data[index].id_user == this.userLogin &&
              this.status.data[index - 1].status !== false
            ) {
              this.next = this.status.data[index + 1].id_user;
            }
          }
          if (this.terimaLPJ == 4) {
            if (
              this.status.data[this.status.data.length - 2].lpj[0].status ==
                false &&
              this.status.data[this.status.data.length - 2].lpj[1].status ==
                false
            ) {
              this.next = 21;
            } else if (
              this.status.data[this.status.data.length - 2].lpj[0].status !==
                false &&
              this.status.data[this.status.data.length - 2].lpj[1].status ==
                false
            ) {
              this.next = 3333;
            }
          }
          try {
            this.loader("loading...");
            this.replace();
            await this.approved({
              id: this.$route.params.id,
              message: this.message,
              status_validasi: this.terimaLPJ ? this.terimaLPJ : 2,
              id_user: this.form.id_user,
              id_struktur:
                this.terimaLPJ && this.userLogin == 121 ? 24 : this.userLogin,
              nama_status:
                this.terimaLPJ && this.userLogin == 121
                  ? "Direktur Keuangan"
                  : this.$store.state.auth.user[0].fullname,
              next: this.terimaLPJ && this.userLogin == 121 ? 21 : this.next,
            });
            this.success("Berhasil terima pengajuan");
            this.option = false;
            this.$nuxt.refresh();
            if (this.form.lpj_keuangan && this.form.lpj_kegiatan)
              this.formLPJKeuangan = false;
            this.formLPJKegiatan = false;
          } catch (error) {
            this.failed("Whoops! gagal aksi terima pengajuan");
          }
        }
      });
    },
    async tolak() {
      this.$swal({
        title: "Warning!",
        text: "Tolak pengajuan ini?",
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
            this.replace();
            const data = {
              id: this.$route.params.id,
              message: this.message,
              status_validasi: 0,
              id_struktur: this.userLogin,
              nama_status: this.$store.state.auth.user[0].fullname,
              next: this.userLogin,
            };
            await this.$axios.post(
              `/pengajuan/decline/${this.$route.params.id}`,
              data
            );
            this.success("Berhasil tolak pengajuan");
            this.option = false;
            this.$nuxt.refresh();
            if (this.form.lpj_keuangan && this.form.lpj_kegiatan)
              this.formLPJKeuangan = false;
            this.formLPJKegiatan = false;
          } catch (error) {
            this.failed("Whoops! gagal aksi revisi pengajuan");
          }
        }
      });
    },
    // Fungsi upload file pencairan
    async buktiTF() {
      if (!this.pencairan && !this.pencairanNominal) {
        const status = this.checkFileSize(this.pencairan.size);
        if (status) {
          try {
            this.loader("loading...");
            const form = new FormData();
            form.append("file", this.pencairan);
            const res = await this.$axios.post("/pengajuan/upload", form);
            if (res.data) {
              this.buktiTFImage = res.data;
              const data = {
                pengajuan_id: this.$route.params.id,
                nominal: this.pencairanNominal.replaceAll(".", ""),
                images: this.buktiTFImage,
              };
              await this.$axios.post(`/pencairan`, data);
              this.success("Berhasil upload bukti pencairan");
              window.location.reload();
            } else {
              this.failed("Whoops! gagal upload bukti pencairan");
            }
          } catch (e) {
            console.log("Whoops! gagal upload bukti pencairan");
          }
        } else {
          this.failed("Ukuran file terlalu besar");
        }
      } else {
        this.failed("Pilih file dan input nominal");
      }
    },
    pencairanStatusChange() {
      this.pencairanStatus = true;
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
            this.replace();
            const data = {
              id: this.$route.params.id,
              message: "Pencairan selesai",
              status_validasi: 3,
              id_struktur: 24,
              next: 24,
              nama_status: "Direktur Keuangan",
              pencairan: "default.jpg",
            };
            await this.approved(data);
            this.success("Upload bukti pencairan selesai");
            this.formPencairan = false;
            this.$nuxt.refresh();
          } catch (error) {
            this.failed("Gagal upload bukti pencairan");
          }
        }
      });
    },
    async uploadLPJNewFormat() {
      if (this.file1.length != 0) {
        const form = new FormData();
        form.append("file", this.file1);

        let status = this.checkFileSize(this.file1.size);
        if (status) {
          try {
            this.loader("Uploading...");
            const res = await this.$axios.post("/pengajuan/upload", form);
            if (res.data) {
              this.form.lpj_keuangan = res.data;
              this.replace();
              await this.updatepengajuan({
                next: 24,
                status_validasi: 1,
                id: this.$route.params.id,
                message: "Upload LPJ (Keuangan dan Kegiatan)",
                lpj_keuangan: this.form.lpj_keuangan,
                id_struktur: this.userLogin,
                nama_status: this.$store.state.auth.user[0].fullname,
              });
              this.success("Data telah disimpan!");
              this.$nuxt.refresh();
            } else {
              this.failed("Whoops! gagal upload LPJ");
            }
          } catch (e) {
            this.failed("Whoops! gagal upload LPJ");
          }
        } else {
          this.failed("Ukuran file terlalu besar");
        }
      } else {
        this.failed("Select file");
      }
    },
    async uploadLPJKeuangan() {
      if (this.LPJKeuangan.length != 0) {
        const form = new FormData();
        form.append("file", this.LPJKeuangan);

        let status = this.checkFileSize(this.LPJKeuangan.size);
        if (status) {
          try {
            this.loader("Uploading...");
            const res = await this.$axios.post("/pengajuan/upload", form);
            if (res.data) {
              this.form.lpj_keuangan = res.data;
              this.replace();
              await this.updatepengajuan({
                next: 24,
                status_validasi: 1,
                id: this.$route.params.id,
                message: "Upload LPJ Keuangan",
                lpj_keuangan: this.form.lpj_keuangan,
                id_struktur: this.userLogin,
                nama_status: this.$store.state.auth.user[0].fullname,
              });
              this.success("Data telah disimpan!");
              this.$nuxt.refresh();
            } else {
              this.failed("Whoops! gagal upload LPJ keuangan");
            }
          } catch (e) {
            this.failed("Whoops! gagal upload LPJ keuangan");
          }
        } else {
          this.failed("Ukuran file terlalu besar");
        }
      } else {
        this.failed("Select file");
      }
    },
    async uploadLPJKegiatan() {
      if (this.LPJKegiatan.length != 0) {
        const form = new FormData();
        form.append("file", this.LPJKegiatan);

        let status = this.checkFileSize(this.LPJKegiatan.size);
        if (status) {
          try {
            this.loader("Uploading...");
            const res = await this.$axios.post("/pengajuan/upload", form);
            if (res.data) {
              this.form.lpj_kegiatan = res.data;
              this.replace();
              await this.updatepengajuan({
                next: 21,
                status_validasi: 1,
                id: this.$route.params.id,
                message: "Upload LPJ Kegiatan",
                lpj_kegiatan: this.form.lpj_kegiatan,
                id_struktur: this.userLogin,
                nama_status: this.$store.state.auth.user[0].fullname,
              });
              this.success("Data telah disimpan!");
              this.$nuxt.refresh();
            } else {
              this.failed("Whoops! gagal upload LPJ kegiatan");
            }
          } catch (e) {
            this.failed("Whoops! gagal upload LPJ kegiatan");
          }
        } else {
          this.failed("Ukuran file terlalu besar");
        }
      } else {
        this.failed("Pilih file LPJ Kegiatan");
      }
    },
    async undo() {
      this.$swal({
        title: "Warning!",
        text: "Tolak pengajuan ini?",
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
            this.replace();
            await this.declined({
              id: this.$route.params.id,
              message: this.message,
              status_validasi: 0,
              id_struktur: this.userLogin,
              nama_status: this.$store.state.auth.user[0].fullname,
              next: this.userLogin,
            });
            this.success("Berhasil tolak pengajuan");
            this.option = true;
            this.$nuxt.refresh();
            if (this.form.lpj_keuangan && this.form.lpj_kegiatan) {
              this.formLPJKeuangan = false;
              this.formLPJKegiatan = false;
            }
          } catch (error) {
            this.failed("Whoops! gagal undo aksi");
          }
        }
      });
    },
    // check file size
    checkFileSize(size) {
      let result = true;
      if (size > 2097152) {
        this.failed("Ukuran file max 2MB");
        result = false;
      }
      return result;
    },
    async print() {
      try {
        await this.$axios.post(
          "/pengajuan/pdfByUSer/" + this.userLogin,
          this.$route.params.id
        );
        window.open("https://aperkat.uts.ac.id/api/g/" + btoa(this.userLogin));
      } catch (error) {
        this.failed("Whoops! gagal unduh dokumen");
      }
    },
    getDataRKAT(value) {
      if (value) {
        this.$axios
          .get(`rkat/byKode/${value.code ? value.code : value}`)
          .then((res) => {
            this.rkat.nama_kegiatan = res.data.data.nama_program;
            this.rkat.tujuan = res.data.data.tujuan;
            this.form.kode_rkat = res.data.data.id_rkat;
            this.kode_rkat = res.data.data.kode_rkat;
          });
      }
    },
    async upload() {
      const form = new FormData();
      form.append("file", this.file);
      try {
        const res = await this.$axios.post("/pengajuan/importRAB", form);
        res.data.data.forEach((element) => {
          this.push({
            no: element.no,
            jenis_barang: element.jenis_barang,
            harga_satuan: element.harga_satuan,
            qty: element.qty,
            total: element.harga_satuan * element.qty,
            keterangan: element.keterangan,
          });
        });
      } catch (e) {
        this.failed(
          "Whoops! Pastikan file yang diupload sesuai dengan format."
        );
      }
    },
    async postRAB(params) {
      try {
        this.items.forEach((item) => {
          delete item.no;
          item.pengajuan_id = params;
        });
        await this.$axios.post(`/rab`, this.items);
      } catch (error) {
        this.failed("Gagal menambahkan data RAB");
      }
    },
    async getRAB(params) {
      try {
        const res = await this.$axios.get(`/rab/${params}`);
        if (res.data.length > 0) {
          res.data.forEach((element) => {
            this.push({
              no: Math.floor(Math.random() * 1000),
              jenis_barang: element.jenis_barang,
              harga_satuan: Number(element.harga_satuan),
              qty: Number(element.qty),
              total: Number(element.harga_satuan) * Number(element.qty),
              keterangan: element.keterangan,
            });
          });
        }
      } catch (error) {
        this.failed("Whoops! gagal mendapatkan data RAB");
      }
    },
    numberFormatHargaSatuan() {
      this.harga_satuan = this.$formatRupiah(this.harga_satuan);
    },
    sum() {
      let totalSum = this.items.reduce((acc, item) => {
        return acc + Number(item.qty * item.harga_satuan);
      }, 0);
      this.form.biaya_program = totalSum;
    },
    push({ no, jenis_barang, harga_satuan, qty, total, keterangan }) {
      if (jenis_barang && harga_satuan && qty && total) {
        this.items.push({
          no: no,
          jenis_barang: jenis_barang,
          harga_satuan: harga_satuan,
          qty: qty,
          total: total,
          keterangan: keterangan,
        });
        this.sum();
        this.nama_barang = "";
        this.harga_satuan = "";
        this.qty = "";
        this.ket = "";
      }
    },
    addRAB() {
      this.push({
        no: Math.floor(Math.random() * 1000),
        jenis_barang: this.nama_barang,
        harga_satuan: this.harga_satuan.replaceAll(".", ""),
        qty: this.qty,
        total: Number(
          this.harga_satuan.replaceAll(".", "") * this.qty.replaceAll(".", "")
        ),
        keterangan: this.ket,
      });
    },
    hapus(params) {
      let data = this.items.filter((i) => i.no !== params);
      this.items = [];
      for (let index = 0; index < data.length; index++) {
        this.push(data[index]);
      }
      this.sum();
    },
    numberFormatBiayaProgram() {
      this.form.biaya_program = this.$formatRupiah(this.form.biaya_program);
    },
    formatPencairanNominal() {
      this.pencairanNominal = this.$formatRupiah(this.pencairanNominal);
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

<style>
.custom-style > * {
  display: block !important;
}

/* Timeline */
.container-timeline {
  position: relative;
}

.container-timeline ul {
  margin: 0;
  padding: 0;
  padding-left: 20px;
  display: inline-block;
  counter-reset: wa-process-counter;
}

.container-timeline ul li {
  list-style: none;
  margin: 0;
  border-left: 1px solid rgb(0, 0, 0);
  padding: 0 0 30px 40px;
  position: relative;
  counter-increment: wa-process-counter;
}

.container-timeline ul li:last-child {
  border: 0;
}

.approve::before {
  position: absolute;
  border: 1px solid rgb(14, 182, 14);
  border-radius: 50px;
  height: 41px;
  width: 41px;
  text-align: center;
  line-height: 41px;
  left: -21px;
  top: 0;
  content: " ";
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwNy4yIDUwNy4yIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDcuMiA1MDcuMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGNpcmNsZSBzdHlsZT0iZmlsbDojMzJCQTdDOyIgY3g9IjI1My42IiBjeT0iMjUzLjYiIHI9IjI1My42Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojMEFBMDZFOyIgZD0iTTE4OC44LDM2OGwxMzAuNCwxMzAuNGMxMDgtMjguOCwxODgtMTI3LjIsMTg4LTI0NC44YzAtMi40LDAtNC44LDAtNy4yTDQwNC44LDE1MkwxODguOCwzNjh6Ii8+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTI2MCwzMTAuNGMxMS4yLDExLjIsMTEuMiwzMC40LDAsNDEuNmwtMjMuMiwyMy4yYy0xMS4yLDExLjItMzAuNCwxMS4yLTQxLjYsMEw5My42LDI3Mi44DQoJCWMtMTEuMi0xMS4yLTExLjItMzAuNCwwLTQxLjZsMjMuMi0yMy4yYzExLjItMTEuMiwzMC40LTExLjIsNDEuNiwwTDI2MCwzMTAuNHoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM0OC44LDEzMy42YzExLjItMTEuMiwzMC40LTExLjIsNDEuNiwwbDIzLjIsMjMuMmMxMS4yLDExLjIsMTEuMiwzMC40LDAsNDEuNmwtMTc2LDE3NS4yDQoJCWMtMTEuMiwxMS4yLTMwLjQsMTEuMi00MS42LDBsLTIzLjItMjMuMmMtMTEuMi0xMS4yLTExLjItMzAuNCwwLTQxLjZMMzQ4LjgsMTMzLjZ6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==");
}

.decline::before {
  position: absolute;
  border: 1px solid rgb(243, 90, 30);
  border-radius: 50px;
  height: 41px;
  width: 41px;
  text-align: center;
  line-height: 41px;
  left: -21px;
  top: 0;
  content: " ";
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxlbGxpcHNlIHN0eWxlPSJmaWxsOiNFMjFCMUI7IiBjeD0iMjU2IiBjeT0iMjU2IiByeD0iMjU2IiByeT0iMjU1LjgzMiIvPg0KPGc+DQoJDQoJCTxyZWN0IHg9IjIyOC4wMjEiIHk9IjExMy4xNDMiIHRyYW5zZm9ybT0ibWF0cml4KDAuNzA3MSAtMC43MDcxIDAuNzA3MSAwLjcwNzEgLTEwNi4wMTc4IDI1Ni4wMDUxKSIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIHdpZHRoPSI1NS45OTEiIGhlaWdodD0iMjg1LjY2OSIvPg0KCQ0KCQk8cmVjdCB4PSIxMTMuMTY0IiB5PSIyMjcuOTY4IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC0xMDYuMDEzNCAyNTUuOTg4NSkiIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiB3aWR0aD0iMjg1LjY2OSIgaGVpZ2h0PSI1NS45OTEiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K");
}

.waiting::before {
  position: absolute;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 50px;
  height: 41px;
  width: 41px;
  text-align: center;
  line-height: 41px;
  left: -21px;
  top: 0;
  content: " ";
  background: rgb(255, 255, 255);
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cmVjdCB4PSIyMjYiIHN0eWxlPSJmaWxsOiNBQkVDRUM7IiB3aWR0aD0iNjAiIGhlaWdodD0iMTIwIi8+CgkKCQk8cmVjdCB4PSI4Ny40MSIgeT0iNTcuNDExIiB0cmFuc2Zvcm09Im1hdHJpeCgtMC43MDcxIDAuNzA3MSAtMC43MDcxIC0wLjcwNzEgMjgzLjQ1MTUgMTE3LjQxMDYpIiBzdHlsZT0iZmlsbDojQUJFQ0VDOyIgd2lkdGg9IjU5Ljk5OSIgaGVpZ2h0PSIxMTkuOTk5Ii8+CjwvZz4KPGc+Cgk8cmVjdCB5PSIyMjYiIHN0eWxlPSJmaWxsOiM0MkM4QzY7IiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIi8+CgkKCQk8cmVjdCB4PSI1Ny40MDYiIHk9IjM2NC41ODQiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjcwNzEgMC43MDcxIC0wLjcwNzEgLTAuNzA3MSA0NzkuNDM2MiA1OTAuNTc5KSIgc3R5bGU9ImZpbGw6IzQyQzhDNjsiIHdpZHRoPSIxMTkuOTk5IiBoZWlnaHQ9IjU5Ljk5OSIvPgo8L2c+CjxnPgoJPHJlY3QgeD0iMjI2IiB5PSIzOTIiIHN0eWxlPSJmaWxsOiMwMkFDQUI7IiB3aWR0aD0iNjAiIGhlaWdodD0iMTIwIi8+CgkKCQk8cmVjdCB4PSIzNjQuNTc5IiB5PSIzMzQuNTkxIiB0cmFuc2Zvcm09Im1hdHJpeCgtMC43MDcxIDAuNzA3MSAtMC43MDcxIC0wLjcwNzEgOTUyLjYwNiAzOTQuNTk3NykiIHN0eWxlPSJmaWxsOiMwMkFDQUI7IiB3aWR0aD0iNTkuOTk5IiBoZWlnaHQ9IjExOS45OTkiLz4KPC9nPgo8cmVjdCB4PSIzOTIiIHk9IjIyNiIgc3R5bGU9ImZpbGw6IzAyNzM3MjsiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==");
}

@media (min-width: 1200px) {
  .container-timeline ul {
    display: flex;
    padding-left: 0;
    padding-top: 20px;
  }

  .container-timeline ul li {
    flex: 1 1 0;
    border-left: 0;
    border-top: 1px solid rgb(1, 7, 1);
    padding: 50px 2em 0 0;
  }

  .container-timeline ul li::before {
    left: 0;
    top: -21px;
  }
}
</style>
