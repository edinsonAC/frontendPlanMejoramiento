<template>
  <a-row type="flex" justify="space-around" style="margin-bottom: 1%" align="bottom">
    <a-col :xs="20" :sm="20" :md="12" :lg="12" :xl="12">
      <label>Seleccionar tarea</label>
      <a-select style="width: 100%" v-model:value="tareId">
        <a-select-option v-for="task in data" :key="task.tareId" :value="task.tareId">
          {{ task.tareNombre }}
        </a-select-option>
      </a-select>
    </a-col>
    <a-col :xs="20" :sm="20" :md="5" :lg="5" :xl="5">
      <a-button @click="getExecutions">Aceptar</a-button>
    </a-col>
    <a-col :xs="20" :sm="20" :md="5" :lg="5" :xl="5">
      <a-button type="primary" @click="showModal">Registrar Ejecución</a-button>
    </a-col>
  </a-row>
  <a-table :data-source="executions" :columns="columns" size="small"
           :scroll="{ y: 200 }"
           :pagination="{ showSizeChanger: true }"
           :loading="loaderTable">
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
  <a-modal v-model:open="open" title="Ejecución" :footer="null" :destroy-on-close="true" :width="900">
    <FormExecution
        @save-info="refresh"
        :item="task" :update="execution.ejecId != null" :users="users"
        :tareId="tareId"></FormExecution>
  </a-modal>
</template>
<script setup>
import {computed, onBeforeMount, reactive, ref} from 'vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import axiosInstance from "../../plugins/axios.js";
import ProgressBar from "../improvement-action/ProgressBar.vue";
import {useRoute} from "vue-router";
import {openNotification} from "../../lib/util.js";
import FormExecution from "./FormExecution.vue";

const route = useRoute()

const emit = defineEmits(['getList'])
const props = defineProps({
  acmeId: Number,
  data: Array,
  loader: Boolean
})

onBeforeMount(() => {
  getUsers()
})
const plmeId = computed(() => {
  return route.params.plan
})
const open = ref(false);
const tareId = ref("");
const executions = ref([]);

const execution = reactive({
  ejecId: null,
  ejecDescripcion: '',
  ejecAvance: '',
  tareId: '',
  ejecFechaEjecucion: '',
  usuaId: '',
  ejecSemestre: '',
  ejecAnio: ''
});

const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const loaderTable = ref(false);

const searchInput = ref();
const columns = [
  {
    title: 'Descripción',
    dataIndex: 'ejecDescripcion',
    key: 'ejecDescripcion',
    customFilterDropdown: true,
    onFilter: (value, record) => record.ejecDescripcion.toString().toLowerCase().includes(value.toLowerCase()),
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
    title: 'Fecha',
    dataIndex: 'ejecFechaEjecucion',
    key: 'ejecFechaEjecucion',
    customFilterDropdown: true,
    onFilter: (value, record) => record.ejecFechaEjecucion.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'Avance',
    dataIndex: 'ejecAvance',
    key: 'ejecAvance',
    customFilterDropdown: true,
    onFilter: (value, record) => record.ejecAvance.toString().toLowerCase().includes(value.toLowerCase()),
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

  execution.ejecId = values.ejecId
  execution.ejecDescripcion = values.ejecDescripcion
  execution.ejecAvance = values.ejecAvance
  execution.tareId = values.tareId
  execution.ejecFechaEjecucion = values.ejecFechaEjecucion
  execution.usuaId = values.usuaId
  execution.ejecSemestre = values.ejecSemestre
  execution.ejecAnio = values.ejecAnio
  open.value = true
}
const showModal = (values) => {
  if (tareId.value == "")
    return openNotification("warning", "Atención", "Debe seleccionar una tarea")
  open.value = true
}


const users = ref([])
const getUsers = (values) => {
  axiosInstance('/user/improvement-plan/' + plmeId.value).then(res => {
    if (res.status == 200 || res.status == 201) {
      users.value = res.data
    }
  })
}

const getExecutions = () => {
  if (tareId.value == "")
    return openNotification("warning", "Atención", "Debe seleccionar una tarea")

  loaderTable.value = true
  axiosInstance('/execution/task/' + tareId.value)
      .then(res => {
        if (res.status == 200 || res.status == 201) {
          executions.value = res.data
          loaderTable.value = false
        }
      }).catch(err => {
    loaderTable.value = false
  })
}
const refresh = (values) => {
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
