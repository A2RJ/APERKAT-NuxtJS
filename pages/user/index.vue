<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">User</h6>
    </div>
    <div class="card-body">
      <b-row>
        <b-col lg="6" class="my-1 flot-right" />

        <b-col lg="6" class="my-1 flot-right">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''"
                  >Clear</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-table
        :filter="filter"
        @filtered="onFiltered"
        :current-page="currentPage"
        :per-page="perPage"
        striped
        hover
        :items="items"
        :fields="fields"
      >
        :items="items" :fields="fields">
        <template #cell(fullname)="row">
          <p>{{ row.item.fullname | capitalize }}</p>
        </template>
        <template #cell(created_at)="row">
          <p>{{ row.item.created_at | convertDate }}</p>
        </template>
        <template #cell(nama_struktur)="row">
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

        <template #cell(Action)="row">
          <NuxtLink
            class="btn btn-sm btn-outline-info mt-1"
            :to="'user/edit/' + row.item.id_user"
            :key="'edit' + row.index"
            >Ubah</NuxtLink
          >
          <button
            class="btn btn-sm btn-outline-danger mt-1"
            @click="deleteUser(row)"
          >
            Hapus
          </button>
        </template>
      </b-table>
      <b-row>
        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  middleware: ["pages/user", "roles/sekniv"],
  async asyncData({ store }) {
    await Promise.all([store.dispatch("user/getuser")]);
    return;
  },
  data() {
    return {
      key: "id_user",
      actions: [
        {
          name: "Tambah",
          type: "link",
          link: "user/add",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
        {
          name: "Reset",
          type: "func",
          func: "reset",
          color: "btn btn-sm btn-outline-primary mt-1 ml-2",
        },
      ],
      fields: [
        { key: "fullname", label: "User" },
        { key: "nama_struktur", label: "Pelaksana" },
        { key: "created_at", label: "Register Date" },
        "Action",
      ],
      items: [],
      filter: "",
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
    };
  },
  computed: {
    ...mapState("user", {
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.items = this.user;
    this.totalRows = this.items.length;
  },
  methods: {
    ...mapActions("user", ["getuser", "deleteuser"]),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length
      // this.currentPage = 1
    },
    async deleteUser(row) {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus user ini?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.deleteuser(row.item.id_user);
            await this.reload();
            this.$swal({
              width: 300,
              icon: "success",
              title: "Congrats!",
              text: "User data telah dihapus",
            });
            this.$nuxt.refresh();
          } catch (error) {
            this.$swal({
              width: 300,
              icon: "error",
              title: "Oops...",
              text: "Cek server atau koneksi anda",
            });
          }
        }
      });
    },
    async deleteAll() {
      this.$swal({
        title: "Warning!",
        text: "Yakin menghapus user ini?",
        icon: "warning",
        width: 300,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.$axios.post("/user/destroy");
            this.$swal({
              width: 300,
              icon: "success",
              title: "Congrats!",
              text: "User data telah dihapus",
            });
            this.$nuxt.refresh();
          } catch (error) {
            this.$swal({
              width: 300,
              icon: "error",
              title: "Oops...",
              text: "Cek server atau koneksi anda",
            });
          }
        }
      });
    },
  },
};
</script>

<style></style>
