<template>
  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="
          content-wrapper
          d-flex
          align-items-center
          text-center
          error-page
          bg-primary
        ">
        <div class="row flex-grow">
          <div class="col-lg-7 mx-auto">
            <div class="row align-items-center d-flex flex-row">
              <div class="col-lg-6 text-lg-right pr-lg-4">
                <h1 class="display-1 mb-0">404</h1>
              </div>
              <div class="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                <h2>¡LO SENTIMOS!</h2>
                <h3 class="font-weight-light">
                  No se encontró la página que está buscando.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</template>

<script setup>
import {storeApp} from "../stores/store.js";
import {onMounted} from "vue";

const store = storeApp()

onMounted(() => store.setLoader(false))

</script>
<style scoped>
.d-flex {
  display: flex;
}

.text-center {
  text-align: center;
}

.align-items-center {
  align-items: center;
}

.page-body-wrapper.full-page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.page-body-wrapper {
  min-height: calc(100vh - 70px);
  background: #eff3f5;
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: rgb(239, 243, 245);
  padding-left: 0;
  padding-right: 0;
}

.page-body-wrapper {
  min-height: calc(100vh - 70px);
  background: #eff3f5;
  padding-left: 0;
  padding-right: 0;
}

.error-page {
  min-height: 100vh;
}

.content-wrapper {
  padding: 1.5rem 0;
  width: 100%;
  -webkit-flex-grow: 1;
  flex-grow: 1;
}

.text-center {
  text-align: center !important;
}

.flex-grow {
  flex-grow: 1;
}

.container-scroller {
  overflow: hidden;
}

.error-page h1 {
  font-size: 9.375rem;
  line-height: 1;
}

.display-1 {
  font-size: 3.75rem;
}

.mb-0,
.my-0 {
  margin-bottom: 0 !important;
}

@media (min-width: 992px) {
  .text-lg-right {
    text-align: right !important;
  }

  .pr-lg-4,
  .px-lg-4 {
    padding-right: 1.5rem !important;
  }

  .pl-lg-4,
  .px-lg-4 {
    padding-left: 1.5rem !important;
  }

  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .error-page .error-page-divider {
    border-left: 3px solid rgba(255, 255, 255, 0.2);
  }

  .text-lg-left {
    text-align: left !important;
  }

  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 767px) and (min-width: 200px) {
  .d-flex {
    display: block;
  }
}
</style>