<template>
  <a-row type="flex" justify="end" style="margin-bottom: 1%">
    <a-button type="primary" size="small" @click="showModal">Registrar Tarea</a-button>
  </a-row>
  <a-table :data-source="data" :columns="columns" size="small"
           :scroll="{ y: 200 }"
           :pagination="{ showSizeChanger: true }"
           :loading="loader">
    <template #header>
      edinson
    </template>
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
            :placeholder="`Buscar ${column.dataIndex}`"
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
  <a-modal v-model:open="open" title="Tarea" :footer="null" :destroy-on-close="true" :width="900">
    <FormTask :item="task" :update="task.tareId != null" :users="users" :responsibles="responsibles"></FormTask>
  </a-modal>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import FormTask from "./FormTask.vue";
import axiosInstance from "../../plugins/axios.js";

const emit = defineEmits(['getList'])
const props = defineProps({
  data: Array,
  loader: Boolean
})

onBeforeMount(() => {
  /*getUsers()*/
  getResponsibles()
})

const open = ref(false);
const task = reactive({
  tareId: null,
  tareNombre: '',
  tareDescripcion: '',
  tarePeso: '',
  tareMeta: '',
  tareLineaBase: '',
  tareDocumentoLineaBase: '',
  acmeId: '',
  tareFechaInicio: '',
  tareFechaFin: '',
  usuaId: '',
  respId: '',
  tareRecursos: '',
  tareOrden: 0
});

const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const searchInput = ref();
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'tareNombre',
    key: 'tareNombre',
    customFilterDropdown: true,
    onFilter: (value, record) => record.tareNombre.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Descripción',
    dataIndex: 'tareDescripcion',
    key: 'tareDescripcion',
    customFilterDropdown: true,
    onFilter: (value, record) => record.tareDescripcion.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Asignado a',
    dataIndex: ['usuario', 'usuaNombre'],
    key: ['usuario', 'usuaNombre'],
    customFilterDropdown: true,
    onFilter: (value, record) => record.usuario.usuaNombre.toString().toLowerCase().includes(value.toLowerCase()),
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
    dataIndex: 'tareFechaInicio',
    key: 'tareFechaInicio',
    customFilterDropdown: true,
    onFilter: (value, record) => record.tareFechaInicio.toString().toLowerCase().includes(value.toLowerCase()),
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
    dataIndex: 'tareFechaFin',
    key: 'tareFechaFin',
    customFilterDropdown: true,
    onFilter: (value, record) => record.tareFechaFin.toString().toLowerCase().includes(value.toLowerCase()),
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
  task.tareId = values.tareId
  task.tareNombre = values.tareNombre
  task.tareDescripcion = values.tareDescripcion
  task.usuaId = values.usuaId
  task.respId = values.respId
  task.tarePeso = values.tarePeso
  task.tareMeta = values.tareMeta
  task.tareLineaBase = values.tareLineaBase
  task.tareDocumentoLineaBase = values.tareDocumentoLineaBase
  task.acmeId = values.acmeId
  task.tareFechaInicio = values.tareFechaInicio
  task.tareFechaFin = values.tareFechaFin
  task.tareRecursos = values.tareRecursos
  task.tareOrden = values.tareOrden
  open.value = true
}
const showModal = (values) => {
  open.value = true
}

const responsibles = ref([])
const getResponsibles = (values) => {
  axiosInstance('/responsible', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      responsibles.value = res.data
    }
  })
}

const users = ref([])
const getUsers = (values) => {
  axiosInstance('/user', values).then(res => {
    if (res.status == 200 || res.status == 201) {
      users.value = res.data
    }
  })
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
