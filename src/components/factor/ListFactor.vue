<template>
  <a-table v-if="plan" :data-source="data" :columns="columnsPlan" size="small"
           :scroll="{ y: 600 }"
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
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex" @click="goActionImprovement(record)">
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
      <span v-else @click="goActionImprovement(record)" class="pointer">
        {{ text }}
      </span>
    </template>
  </a-table>
  <a-table v-else :data-source="data" :columns="columns" size="small"
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
    <FormFactor :update="true" :item="factor" :agrements="agrements" :factor-types="factorTypes"
                @update-info="closeModal"></FormFactor>
  </a-modal>
</template>
<script setup>
import {computed, reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormFactor from "./FormFactor.vue";
import router from "../../router/index.js";
import {useRoute} from "vue-router";

const emit = defineEmits(['getList'])

const props = defineProps({
  factorTypes: Array,
  agrements: Array,
  data: Array,
  loader: Boolean,
  plan: Boolean,
})
const factor = reactive({
  pracId: '',
  factNombre: '',
  factDescripcion: '',
  acueId: '',
  tifaId: '',
});
const open = ref(false);

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columnsPlan = [
  {
    title: 'Nombre Factor',
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
];
const columns = [
  {
    title: 'Nombre Factor',
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
    key: 'tipoFactor',
    filterMultiple: false,
    filters: [
      {
        text: 'Institucional',
        value: 1,
      },
      {
        text: 'Académico',
        value: 2,
      },
    ],
    onFilter: (value, record) => {
      return record.tipoFactor && record.tipoFactor.tifaId === value;
    },
  },
  {
    title: 'Acuerdo',
    dataIndex: ['acuerdo', 'acueNombre'],
    key: ['acuerdo', 'acueNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.acuerdo.acueNombre.toString().toLowerCase().includes(value.toLowerCase()),
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
  factor.tifaId = values.tifaId
  factor.acueId = values.acueId
  factor.factNombre = values.factNombre
  factor.factDescripcion = values.factDescripcion
  factor.factId = values.factId
  open.value = true
}

const route = useRoute()
const plmeId = computed(() => {
  return route.params.plan
})
const goActionImprovement = (values) => {
  const factor = values.factId
  router.push(`/plan-mejoramiento/${plmeId.value}/factor/${factor}/acciones-mejoras`)
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
