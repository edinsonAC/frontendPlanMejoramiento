<template>
  <a-table :data-source="data" :columns="store.isAdmin ? columnsAdmin : columns" size="small"
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
      <template v-if="column.dataIndex.includes('plmeId')">
        <router-link :to="`/plan-mejoramiento/${text}/factores`">
          <a-button v-if="text" type="primary"
                    size="small"> Ver Factores
          </a-button>
        </router-link>
      </template>
      <template v-else-if="column.dataIndex.includes('plmeAnioInicio')">
        <span>{{text}}-{{record.plmeSemestreInicio}}</span>
      </template>
      <template v-else-if="column.dataIndex.includes('plmeAnioFin')">
        <span>{{text}}-{{ record.plmeSemestreFin}}</span>
      </template>
      <template v-else>
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
    </template>
  </a-table>
  <a-modal v-model:open="open" title="Actualizar" :footer="null" :destroy-on-close="true" :width="900">
    <FormImprovementPlan :update="true" :item="improvementPlan" :programs="programs"
                         :development-plans="developmentPlans"
                         @update-info="closeModal"></FormImprovementPlan>
  </a-modal>
</template>
<script setup>
import {reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormImprovementPlan from "./FormImprovementPlan.vue";
import {storeApp} from "../../stores/store.js";
import router from "../../router/index.js";

const store = storeApp()
const emit = defineEmits(['getList'])

const props = defineProps({
  programs: Array,
  data: Array,
  developmentPlans: Array,
  loader: Boolean
})
const improvementPlan = reactive({
  pracId: '',
  plmeNombre: '',
  plmeId: '',
});
const open = ref(false);

const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();
const columnsAdmin = [
  {
    title: 'Nombre',
    dataIndex: 'plmeNombre',
    key: 'plmeNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Inicio',
    dataIndex: 'plmeAnioInicio',
    key: 'plmeAnioInicio',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeAnioInicio.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Fin',
    dataIndex: 'plmeAnioFin',
    key: 'plmeAnioFin',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeAnioFin.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Programa Académico',
    dataIndex: ['programaAcademico', 'pracNombre'],
    key: ['programaAcademico', 'pracNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.programaAcademico.pracNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'PDI',
    dataIndex: ['planDesarrolloInstitucional', 'pdiNombre'],
    key: ['planDesarrolloInstitucional', 'pdiNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.planDesarrolloInstitucional.pracNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '',
    dataIndex: 'plmeId',
    key: 'plmeId',
  },
];
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'plmeNombre',
    key: 'plmeNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Fecha Inicio',
    dataIndex: 'plmeFechaInicio',
    key: 'plmeFechaInicio',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeFechaInicio.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Fecha Fin',
    dataIndex: 'plmeFechaFin',
    key: 'plmeFechaFin',
    customFilterDropdown: true,
    onFilter: (value, record) => record.plmeFechaFin.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'PDI',
    dataIndex: ['planDesarrolloInstitucional', 'pdiNombre'],
    key: ['planDesarrolloInstitucional', 'pdiNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.planDesarrolloInstitucional.pracNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '',
    dataIndex: 'plmeId',
    key: 'plmeId',
    width: 250
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
  improvementPlan.pracId = values.pracId
  improvementPlan.plmeNombre = values.plmeNombre
  improvementPlan.plmeId = values.plmeId
  improvementPlan.plmeFechaInicio = values.plmeFechaInicio
  improvementPlan.plmeFechaFin = values.plmeFechaFin
  improvementPlan.pdiId = values.pdiId
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
