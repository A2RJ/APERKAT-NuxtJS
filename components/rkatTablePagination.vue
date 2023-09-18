<template>
  <div class="row card shadow mb-4">
    <div class="col-xl-12 col-lg-12 card-body">
      <input type="text" v-model="searchQuery" @input="search" />
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th>No.</th>
            <th>Kode RKAT</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in rkats.data" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ user.kode_rkat }}</td>
            <td>{{ user.user?.fullname }}</td>
          </tr>
        </tbody>
      </table>
      <div class="rkats">
        <ul>
          <li v-if="rkats.current_page > 1">
            <a @click="changePage(rkats.current_page - 1)">Previous</a>
          </li>
          <li
            v-for="page in pages"
            :key="page"
            :class="{ active: page === rkats.current_page }"
          >
            <a @click="changePage(page)">{{ page }}</a>
          </li>
          <li v-if="rkats.current_page < rkats.last_page">
            <a @click="changePage(rkats.current_page + 1)">Next</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "rkat",
  data() {
    return {
      rkats: {},
      searchQuery: "",
    };
  },
  mounted() {
    this.loadRkat();
  },
  computed: {
    pages() {
      if (!this.rkats.to) {
        return [];
      }
      const from = this.rkats.current_page - 2;
      const to = this.rkats.current_page + 2;
      return [...Array(this.rkats.last_page).keys()]
        .filter((page) => page >= from && page <= to)
        .map((page) => page + 1);
    },
  },
  methods: {
    async loadRkat(page = 1) {
      const apiUrl = `http://127.0.0.1:8000/test/rkat?page=${page}&search=${this.searchQuery}`;
      try {
        const { data } = await axios.get(apiUrl);
        this.rkats = data;
      } catch (error) {
        console.error(error);
      }
    },
    async search() {
      this.loadRkat(); 
    },
    changePage(page) {
      if (page >= 1 && page <= this.rkats.last_page) {
        this.loadRkat(page);
      }
    },
  },
};
</script>
