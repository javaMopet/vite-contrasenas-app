<template>
  <div class="container" style="height: 30px">
    <the-header></the-header>
  </div>
  <div class="container-fluid m-0 p-0 h-100">
    <router-view />
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
export default {
  components: { TheHeader },
  created() {
    this.$store.dispatch("tryLogin");
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.min.css";
</style>
