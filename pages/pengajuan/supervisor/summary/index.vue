<template>
  <div class="row card shadow mb-4">
    <div class="col-xl-12 col-lg-12 card-body">
      <!-- <button @click="onClick">Click me!</button> -->
      <b-table
        striped
        small
        show-empty
        responsive
        hover
        :fields="fields"
        :items="data"
      >
        <!-- index -->
        <template #head(index)>No.</template>
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <!-- actions -->
        <template #cell(actions)="data">
          <NuxtLink :to="'/pengajuan/supervisor/summary/' + data.item.id">
            Detail
          </NuxtLink>
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
      key: "id",
      actions: [],
      fields: [
        {
          key: "index",
          label: "ID",
          width: "10px",
        },
        {
          key: "name",
          label: "Name",
          sortable: true,
          // width: "100px",
        },
        "Actions",
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get("/user/unit")
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
  },
};
</script>
