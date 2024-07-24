<template>
  <a-row type="flex" justify="start">
    <a-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
      <a-card class="card-chart">
        <a-row type="flex" justify="end">

        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup>
import {onMounted} from "vue";
import {storeApp} from "../../stores/store.js";

const store = storeApp()

onMounted(() => {
  /*store.setLoader(false)*/
})
</script>
<style scoped>

</style>