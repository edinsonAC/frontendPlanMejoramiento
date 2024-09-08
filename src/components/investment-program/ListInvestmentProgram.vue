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
  <a-modal v-model:open="open" title="Actualizar" :footer="null" :destroy-on-close="true" :width="900">
    <FormInvestmentProgram :update="true" :item="investmentProgram" :development-plans="developmentPlans"
                           @update-info="closeModal"></FormInvestmentProgram>
  </a-modal>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormInvestmentProgram from "./FormInvestmentProgram.vue";


const emit = defineEmits(['getList'])

const props = defineProps({
  developmentPlans: Array,
  data: Array,
  loader: Boolean
})
const investmentProgram = reactive({
  liesId: '',
  ejesId: '',
  prinNombre: '',
});
const open = ref(false);

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columns = [
  {
    title: 'Programa Inversión',
    dataIndex: 'prinNombre',
    key: 'prinNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.prinNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Eje Estratégico',
    dataIndex: ['lineaEstrategica', 'ejeEstrategico', 'ejesNombre'],
    key: ['lineaEstrategica', 'ejeEstrategico', 'ejesNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.lineaEstrategica.ejeEstrategico.ejesNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Línea Estratégica',
    dataIndex: ['lineaEstrategica', 'liesNombre'],
    key: ['lineaEstrategica', 'liesNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.lineaEstrategica.liesNombre.toString().toLowerCase().includes(value.toLowerCase()),
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
  investmentProgram.prinId = values.prinId
  investmentProgram.liesId = values.liesId
  investmentProgram.prinNombre = values.prinNombre
  investmentProgram.ejesId = values.lineaEstrategica.ejesId
  investmentProgram.pdiId = values.lineaEstrategica.ejeEstrategico.pdiId
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
