<template>
  <div class="row">
    <!-- Area Chart -->
    <div class="col-xl-12 col-lg-12">
      <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div
          class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
        >
          <h6 class="m-0 font-weight-bold text-primary">
            Pengajuan Sub Divisi
          </h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
          <b-tabs content-class="mt-3" v-if="userLogin == 120">
            <b-tab title="Pencairan" active>
              <custom-table
                :items="listPencairan"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
          </b-tabs>
          <b-tabs content-class="mt-3" v-else-if="userLogin == 121">
            <b-tab title="LPJ Keuangan" active>
              <custom-table
                :items="listLPJKeuangan"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
            <b-tab title="Belum LPJ Keuangan">
              <custom-table
                :items="belumUploadLPJKeuangan"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
          </b-tabs>
          <b-tabs content-class="mt-3" v-else>
            <b-tab title="Need Approval" active>
              <custom-table
                :items="subdivisineed"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
            <b-tab title="LPJ Kegiatan" v-if="userLogin == 21">
              <custom-table
                :items="listLPJKegiatan"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
            <b-tab title="Belum LPJ Kegiatan" v-if="userLogin == 21">
              <custom-table
                :items="belumUploadLPJKegiatan"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
            <b-tab title="On Progress">
              <custom-table
                :items="items"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
            <b-tab
              title="Completed"
              v-if="
                userLogin == 21 ||
                userLogin == 22 ||
                userLogin == 23 ||
                userLogin == 24
              "
            >
              <custom-table
                :items="listCompleted"
                :fields="fields"
                :html="key"
                :actions="actions"
              >
                <template v-slot:fullname="row">
                  <p>
                    {{ row.item.fullname | capitalize }} <br />
                    <b-badge
                      v-if="row.item.validasi_status == 0"
                      variant="danger"
                      >Ditolak: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 1"
                      variant="warning"
                      >Input/Revisi: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 2"
                      variant="success"
                      >Diterima: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 3"
                      variant="success"
                      >Pencairan: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 4"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                    <b-badge
                      v-if="row.item.validasi_status == 5"
                      variant="success"
                      >Completed: {{ row.item.nama_status }}</b-badge
                    >
                  </p>
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
                  <NuxtLink
                    class="btn btn-sm btn-outline-info"
                    :to="'edit/' + row.item.id_nonrkat"
                    :key="'edit' + row.index"
                    target="_blank"
                    >Detail</NuxtLink
                  >
                </template>
              </custom-table>
            </b-tab>
          </b-tabs>
        </div>
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
        "nonrkat/getSubdivisi",
        store.$auth.$state.user[0].id_user
      ),
      store.dispatch(
        "nonrkat/subDivisiNeed",
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
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "created_at", label: "Waktu Pengajuan" },
        "actions",
      ],
      items: [],
      subdivisineed: [],
      userLogin: this.$store.state.auth.user[0].id_user,
      listPencairan: [],
      listLPJKeuangan: [],
      listLPJKegiatan: [],
      belumUploadLPJKeuangan: [],
      belumUploadLPJKegiatan: [],
      listCompleted: [],
    };
  },
  computed: {
    ...mapState("nonrkat", {
      subdivisinon: (state) => state.subdivisinon,
      subdivisineedData: (state) => state.subdivisineedNonrkat,
    }),
  },
  mounted() {
    this.items = this.subdivisinon;
    this.subdivisineed = this.subdivisineedData;

    if (this.userLogin == 120) {
      this.getListPencairan();
    }

    if (this.userLogin == 121) {
      this.getListLPJKeuangan();
      this.getBelumUploadLPJKeuangan();
    }

    if (this.userLogin == 21) {
      this.getListLPJKegiatan();
      this.getBelumUploadLPJKegiatan();
      this.getCompleted();
    }

    if (
      this.userLogin == 21 ||
      this.userLogin == 22 ||
      this.userLogin == 23 ||
      this.userLogin == 24
    ) {
      this.getCompleted();
    }
  },
  methods: {
    ...mapActions("nonrkat", ["getSubdivisi"]),
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status_message === 0) return "table-success";
    },
    getListPencairan() {
      this.$axios
        .get("/nonrkat/listPencairan")
        .then((response) => {
          this.listPencairan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getListLPJKeuangan() {
      this.$axios
        .get("/nonrkat/listLPJKeuangan")
        .then((response) => {
          this.listLPJKeuangan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getListLPJKegiatan() {
      this.$axios
        .get("/nonrkat/listLPJKegiatan")
        .then((response) => {
          this.listLPJKegiatan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getBelumUploadLPJKeuangan() {
      this.$axios
        .get("/nonrkat/belumUploadLPJKeuangan")
        .then((response) => {
          this.belumUploadLPJKeuangan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getBelumUploadLPJKegiatan() {
      this.$axios
        .get("/nonrkat/belumUploadLPJKegiatan")
        .then((response) => {
          this.belumUploadLPJKegiatan = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCompleted() {
      this.$axios
        .get("/nonrkat/getCompleted")
        .then((response) => {
          this.listCompleted = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
