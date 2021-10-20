<template>  
    <the-header></the-header>  
  <div class="container-fluid m-0 p-0 h-100">
    <router-view />
  </div>
  <teleport to="body">
    <Procesando></Procesando>
  </teleport>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import Procesando from "./components/layout/Procesando.vue"
import axios from "axios";
export default {
  components: { TheHeader,Procesando },
  created() {
    this.$store.dispatch("tryLogin");
     
    axios.interceptors.request.use(
      (config) => {
        console.info('axios interceptor config request. Requesting......');
        // this.$store.commit("loading", true);
        return config;
      },
      (error) => {
        console.info('axios interceptor error request. Error Requesting......');
        // this.$store.commit("loading", false);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        console.info('axios interceptor response response. Responsed......');
        // this.$store.commit("loading", false);
        return response;
      },
      (error) => {
        console.info('axios interceptor errorResponse. Responsed......');
        // this.$store.commit("loading", false);
        return Promise.reject(error);
      }
    );  
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.min.css";
</style>
