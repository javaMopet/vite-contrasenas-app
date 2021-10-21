<template>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="formTitleLabel">AgregarServidor</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <form
        class="form-wrap container mt-2"
        @submit.prevent="saveOrUpdateServidor"
      >
        <div class="modal-body">
          <div>
            <div class="form-group">
              <label for="name" class="form-label"
                >Nombre Servidor: {{ indice }} -
                {{ servidor.id }}</label
              >
              <!-- v-bind:value="nombreProp" -->
              <input
                id="name"
                v-model.trim="servidor.nombre"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isNombreValid() && nombreBlured,
                }"
                v-on:blur="nombreBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar el nombre del servidor.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="ip">Ip:</label>
              <input
                v-model="servidor.ip"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isIpValid() && ipBlured,
                }"
                v-on:blur="ipBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar la ip del servidor.
              </div>
            </div>
            <div class="container d-flex justify-content-center">
              <button
                class="btn btn-success me-2"
                type="button"
                @click="nuevo"
                v-if="servidor.id"
              >
                Nuevo
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">{{ mode }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
<!--end form-wrapper-->

<script>
export default {
  data() {
    return {
      indice: null,
      servidor: {
        id: null,
        nombre: null,
        ip: null,
      },
      nombreBlured: false,
      ipBlured: false,
    };
  },
  watch: {
    servidorId(value) {
      this.servidor.id = value;
      this.indice = this.servidorIndice;
      this.servidor.nombre = this.servidorNombre;
      this.servidor.ip = this.servidorIp;
    },
  },
  computed: {
    mode() {
      const mode = this.servidor.id
        ? this.servidor.id > 0
          ? "Actualizar"
          : "Guardar"
        : "Guardar";
      return mode;
    }
  },
  emits: ["savedServidor"],
  props: ["servidorNombre", "servidorId", "servidorIp", "servidorIndice"],
  methods: {
    async saveOrUpdateServidor() {
      if (this.validate()) {
        try {
          await this.$store.dispatch("servidores/saveOrUpdate", {
            indice: this.indice,
            servidor: this.servidor,
            mode: this.mode,
          });
          this.submitted = true;
          this.$emit("savedServidor", {
            errorCode: 0,
            message: "El servidor se ha guardado exitosamente.",
          });          
          this.reiniciarServidor();
        } catch (error) {          
          this.$emit("savedServidor", {
            errorCode: 1,
            message: error,
          });
        }
      }
    },
    nuevo() {
      this.reiniciarServidor();
    },
    reiniciarServidor() {
      this.indice = null;
      this.servidor.id = null;
      this.servidor.nombre = null;
      this.servidor.ip = null;
      this.ipBlured = false;
      this.nombreBlured = false;
    },
    validate() {      
      var formValid = true;
      
      this.nombreBlured = true;
      if (!this.isNombreValid()) {
        formValid = false;
      }
      this.ipBlured = true;
      if (!this.isIpValid()) {
        formValid = false;
      }      
      return formValid;
    },
    isNombreValid() {            
      return (this.servidor.nombre && this.servidor.nombre != "");
    },
    isIpValid() {
      var reg =
        /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/gi;
      return reg.test(this.servidor.ip);
    }
  },
};
</script>
