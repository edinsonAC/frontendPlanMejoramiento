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
            :placeholder="`Buscar ${column.title}`"
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
          Buscar
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Limpiar
        </a-button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }"/>
    </template>
    <template #bodyCell="{ record, text, column }">
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex" @click="rowClick(record)">
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
      <span v-else @click="rowClick(record)" class="pointer">
        {{ text }}
      </span>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="Actualizar" :footer="null" :width="800" :destroy-on-close="true">
    <FormDevelopmentPlan :update="true" :item="developmentPlan" @update-info="closeModal"></FormDevelopmentPlan>
  </a-modal>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormDevelopmentPlan from "./FormDevelopmentPlan.vue";

const emit = defineEmits(['getList'])

const props = defineProps({
  data: Array,
  loader: Boolean
})
const developmentPlan = reactive({
  pracId: '',
  pdiNombre: '',
  pdiDescripcion: '',
  tifaId: '',
});
const open = ref(false);

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'pdiNombre',
    key: 'pdiNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.pdiNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Periodo',
    dataIndex: 'pdiPeriodo',
    key: 'pdiPeriodo',
    customFilterDropdown: true,
    onFilter: (value, record) => record.pdiPeriodo.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Descriccpión',
    dataIndex: 'pdiDescripcion',
    key: 'pdiDescripcion',
    customFilterDropdown: true,
    onFilter: (value, record) => record.pdiDescripcion.toString().toLowerCase().includes(value.toLowerCase()),
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

const closeModal = () => {
  open.value = false
  emit('getList')
}

const rowClick = (values) => {
  developmentPlan.pdiId = values.pdiId
  developmentPlan.pdiNombre = values.pdiNombre
  developmentPlan.pdiDescripcion = values.pdiDescripcion
  developmentPlan.pdiPeriodo = values.pdiPeriodo
  open.value = true
}
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.pointer {
  cursor: pointer;
}
</style>
