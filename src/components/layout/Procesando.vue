<template>
  <!-- Modal -->
  <!-- data-bs-backdrop="static" -->
  <div
    class="modal fade in"
    id="modalProcesando"
    data-bs-keyboard="false"
    tabindex="-1"    
    aria-hidden="true"    
  >
  <!-- style="display: block;" -->
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body" v-if="isRequesting">Procesando...</div>
      </div>
    </div>
  </div>
  <!-- <div class="container" v-if="isRequesting">
      <h3>Cargando....................</h3>
  </div> -->
</template>
<script>
// import { Modal } from "bootstrap";
export default {
  computed: {
    isRequesting() {
    },
  },
};
</script>
