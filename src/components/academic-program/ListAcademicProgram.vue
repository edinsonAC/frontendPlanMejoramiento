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
      <span @click="rowClick(record)" class="pointer">
        {{ text }}
      </span>
    </template>
  </a-table>
  <a-modal v-model:open="open" title="Actualizar" :footer="null">
    <FormAcademicProgram :update="true" :item="academicProgram" @update-info="closeModal"></FormAcademicProgram>
  </a-modal>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormAcademicProgram from "./FormAcademicProgram.vue";

const emit = defineEmits(['getList'])
const props = defineProps({
  data: Array,
  loader: Boolean
})


const open = ref(false);
const academicProgram = reactive({
  pracId: '',
  pracNombre: '',
  pracCodigo: '',
});

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'pracNombre',
    key: 'pracNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.pracNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Código',
    dataIndex: 'pracCodigo',
    key: 'pracCodigo',
    customFilterDropdown: true,
    onFilter: (value, record) =>
        record.pracCodigo.toString().toLowerCase().includes(value.toLowerCase()),
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

const rowClick = (values) => {
  console.log("row ", values)
  academicProgram.pracCodigo = values.pracCodigo
  academicProgram.pracNombre = values.pracNombre
  academicProgram.pracId = values.pracId
  open.value = true

}

const closeModal = () => {
  open.value = false
  emit('getList')
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
