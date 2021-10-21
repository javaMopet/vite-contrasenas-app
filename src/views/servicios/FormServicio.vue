<template>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-primary" id="formTitleLabel">
          {{ tituloAccion }}
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <form
        class="form-wrap container mt-2"
        @submit.prevent="saveOrUpdateServicio"
      >
        <div class="modal-body">
          <div>
            <div class="form-group">
              <label for="name" class="form-label">Servidor:</label>
              <!-- v-bind:value="nombreProp" -->
              <input
                id="name"
                v-model.trim="servicio.nombre"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isNombreValid() && nombreBlured,
                }"
                v-on:blur="nombreBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar el nombre del servicio.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="version">Aplicacion:</label>
              <input
                v-model="servicio.version"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isVersionValid() && versionBlured,
                }"
                v-on:blur="versionBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar la version del servicio.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="version">Puerto:</label>
              <input type="number"
                v-model="servicio.puerto"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isVersionValid() && versionBlured,
                }"
                v-on:blur="versionBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar la version del servicio.
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="container-fluid p-0 row">
            <div
              class="
                container-fluid
                p-0
                m-0
                col-sm-6
                d-flex
                justify-content-start
              "
            >
              <button
                class="btn btn-success me-2"
                type="button"
                @click="nuevo"
                v-if="servicio.id"
              >
                Nuevo
              </button>
            </div>
            <div class="col-sm-3 p-0">
              <button
                type="button"
                class="btn btn-warning"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
            </div>
            <div class="col-sm-3 p-0">
              <button type="submit" class="btn btn-primary w-100">
                {{ mode }}
              </button>
            </div>
          </div>
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
      servicio: {
        id: null,
        nombre: null,
        version: null,
      },
      nombreBlured: false,
      versionBlured: false,
    };
  },
  watch: {
    servicioId(value) {
      this.servicio.id = value;
      this.indice = this.servicioIndice;
      this.servicio.nombre = this.servicioNombre;
      this.servicio.version = this.servicioVersion;
    },
  },
  computed: {
    mode() {
      const mode = this.servicio.id
        ? this.servicio.id > 0
          ? "Actualizar"
          : "Guardar"
        : "Guardar";
      return mode;
    },
    tituloAccion() {
      return this.servicio.id
        ? this.servicio.id > 0
          ? "Actualizar Servicio"
          : "Guardar Servicio"
        : "Guardar Servicio";
    },
  },
  emits: ["savedServicio"],
  props: ["servicioNombre", "servicioId", "servicioVersion", "servicioIndice"],
  methods: {
    async saveOrUpdateServicio() {
      if (this.validate()) {
        try {
          await this.$store.dispatch("servicios/saveOrUpdate", {
            indice: this.indice,
            servicio: this.servicio,
            mode: this.mode,
          });
          this.submitted = true;
          this.$emit("savedServicio", {
            errorCode: 0,
            message: "El servicio se ha guardado exitosamente.",
          });
          this.reiniciarServicio();
        } catch (error) {
          this.$emit("savedServicio", {
            errorCode: 1,
            message: error,
          });
        }
      }
    },
    nuevo() {
      this.reiniciarServicio();
    },
    reiniciarServicio() {
      this.indice = null;
      this.servicio.id = null;
      this.servicio.nombre = null;
      this.servicio.version = null;
      this.versionBlured = false;
      this.nombreBlured = false;
    },
    validate() {
      var formValid = true;

      this.nombreBlured = true;
      if (!this.isNombreValid()) {
        formValid = false;
      }
      this.versionBlured = true;
      if (!this.isVersionValid()) {
        formValid = false;
      }
      return formValid;
    },
    isNombreValid() {
      return this.servicio.nombre && this.servicio.nombre != "";
    },
    isVersionValid() {
      return this.servicio.version && this.servicio.version != "";
    },
  },
};
</script>
