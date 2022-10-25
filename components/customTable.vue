<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12" class="my-1">
        <span v-for="action in actions" :key="action.name">
          <NuxtLink
            v-if="action.type == 'link'"
            :class="action.color"
            :to="action.link"
            >{{ action.name }}</NuxtLink
          >
          <button
            v-else
            :class="action.color"
            size="sm"
            @click="functionIndex(action.func)"
          >
            {{ action.name }}
          </button>
        </span>
      </b-col>
      <b-col lg="12" class="my-1">
        <b-row>
          <b-col lg="4" class="my-1">
            <b-form-group
              label="Filter"
              label-for="years"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-6
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="years"
                v-model="perYear"
                :options="yearOption"
                size="sm"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col lg="4" class="my-1">
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-6
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col lg="4" class="my-1">
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
      </b-col>
    </b-row>
    <!-- :fixed="true" -->
    <b-table
      :items="
        perYear == ''
          ? items
          : items.filter((item) => item.period.substring(0, 4) == perYear)
      "
      :fields="fieldsTable"
      :select-mode="selectMode"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :bordered="true"
      responsive
      head-variant="light"
      id="table-transition-example"
      :tbody-transition-props="transProps"
      hover
      show-empty
      ref="selectableTable"
      selectable
      @filtered="onFiltered"
      @row-selected="onRowSelected"
      selectedVariant="success"
      small
    >
      <template #head(index)>
        <span aria-hidden="true">
          <b-form-checkbox v-model="selectAll" name="check-button"
            >No.</b-form-checkbox
          >
        </span>
      </template>
      <template #cell(index)="data">
        <b-form-checkbox v-if="data.rowSelected" v-model="checked" disabled>
          {{ data.index + 1 }}
        </b-form-checkbox>
        <span v-else aria-hidden="true">{{ data.index + 1 }}</span>
      </template>
      <template
        v-for="slot in Object.keys($scopedSlots)"
        v-slot:[toCellName(slot)]="props"
      >
        <slot v-bind="props" :name="slot" />
      </template>
    </b-table>
    <b-row>
      <b-col lg="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="
            countRows !== 0 && countRows < totalRows ? countRows : totalRows
          "
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: [
    "items",
    "fields",
    "html",
    "perYearFilterState",
    "tableName",
    "actions",
  ],
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      id: this.html,
      fieldsTable: ["index"],
      selectMode: "multi",
      selected: [],
      selectAll: false,
      checked: true,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, 25, { value: 100, text: "Show a lot" }],
      filter: null,
      countRows: 0,
      perYear: "",
      yearOption: [],
    };
  },
  computed: {
    totalRows() {
      return this.perYear == ""
        ? this.items.length
        : this.items.filter(
            (item) => item.period.substring(0, 4) == this.perYear
          ).length;
    },
    ...mapState("customTable", {
      success: (state) => state.success,
      errors: (state) => state.errors,
    }),
  },
  mounted() {
    for (let index = 0; index < this.fields.length; index++) {
      this.fieldsTable.push(this.fields[index]);
    }
    this.filterYear();
  },
  methods: {
    ...mapActions("customTable", ["action"]),
    reload(params) {
      this.items = params;
    },
    onRowSelected(items) {
      this.selected = items;
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
      this.selectAll = true;
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
      this.selectAll = false;
    },
    onFiltered(filteredItems) {
      this.countRows = filteredItems.length;
      this.currentPage = 1;
    },
    toCellName(slot) {
      return `cell(${slot})`;
    },
    getAllSelected() {
      const a = [];
      for (let index = 0; index < this.selected.length; index++) {
        a.push(this.selected[index][this.id]);
      }
      return a;
    },
    functionIndex(func, link) {
      if (func == "deleteAll") {
        this.$parent.deleteAll();
      } else if (func == "print") {
        const params = [];
        for (let index = 0; index < this.items.length; index++) {
          params.push(this.items[index][this.id]);
        }
        this.$parent.print(params);
      } else if (func == "importRKAT") {
        this.$parent.importRKAT();
      } else if (func == "selectAll") {
        this.selectAllRows();
      } else if (func == "clearSelected") {
        this.clearSelected();
      } else if (func == "deleteSelected") {
        const a = this.getAllSelected();
        if (a.length > 0) {
          this.$parent.deleteRows(this.getAllSelected());
        }
      } else if (func == "printSelected") {
        const a = this.getAllSelected();
        if (a.length > 0) {
          this.$parent.print(this.getAllSelected());
        }
      }
    },
    filterYear() {
      const yearNow = new Date().getFullYear();
      const year = [{ value: "", text: "All" }];
      for (let index = 2021; index <= yearNow; index++) {
        year.push({ value: index, text: index });
      }
      this.yearOption = year;
      this.perYear = yearNow;
      // console.log(this.items);
    },
  },
  watch: {
    selectAll: function () {
      if (this.selectAll) {
        this.selectAllRows();
      } else {
        this.clearSelected();
      }
    },
    items: function () {
      this.filterYear();
    },
  },
};
</script>

<style>
table#table-transition-example .flip-list-move {
  transition: transform 1s;
}
</style>
