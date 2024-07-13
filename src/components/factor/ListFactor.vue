<template>
  <a-table :data-source="data" :columns="columns" size="small"
           :scroll="{ y: 200 }"
           :pagination="{ showSizeChanger: true }"
           :loading="loader">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span style="color: #1890ff">Name</span>
      </template>
    </template>
    <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      <div style="padding: 8px">
        <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon>
            <SearchOutlined/>
          </template>
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }"/>
    </template>
    <template #bodyCell="{ text, column }">
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
        >
          <mark
              v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
              :key="i"
              class="highlight"
          >
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
    </template>
  </a-table>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';

const props = defineProps({
  data: Array,
  loader: Boolean
})

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'factNombre',
    key: 'factNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.factNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Tipo Factor',
    dataIndex: ['tipoFactor', 'tifaNombre'],
    key: ['tipoFactor', 'tifaNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.tipoFactor.tifaNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
];
const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};
const handleReset = clearFilters => {
  clearFilters({
    confirm: true,
  });
  state.searchText = '';
};
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
