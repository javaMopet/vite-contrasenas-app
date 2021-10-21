<template>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-primary" id="formTitleLabel">{{ tituloAccion }}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <form
        class="form-wrap container mt-2"
        @submit.prevent="saveOrUpdateAplicacion"
      >
        <div class="modal-body">
          <div>
            <div class="form-group">
              <label for="name" class="form-label">Nombre Aplicacion:</label>
              <!-- v-bind:value="nombreProp" -->
              <input
                id="name"
                v-model.trim="aplicacion.nombre"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isNombreValid() && nombreBlured,
                }"
                v-on:blur="nombreBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar el nombre del aplicacion.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="version">Version:</label>
              <input
                v-model="aplicacion.version"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isVersionValid() && versionBlured,
                }"
                v-on:blur="versionBlured = true"
              />
              <div class="invalid-feedback">
                Favor de ingresar la version del aplicacion.
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
                v-if="aplicacion.id"
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
      aplicacion: {
        id: null,
        nombre: null,
        version: null,
      },
      nombreBlured: false,
      versionBlured: false,
    };
  },
  watch: {
    aplicacionId(value) {
      this.aplicacion.id = value;
      this.indice = this.aplicacionIndice;
      this.aplicacion.nombre = this.aplicacionNombre;
      this.aplicacion.version = this.aplicacionVersion;
    },
  },
  computed: {
    mode() {
      const mode = this.aplicacion.id
        ? this.aplicacion.id > 0
          ? "Actualizar"
          : "Guardar"
        : "Guardar";
      return mode;
    },
    tituloAccion() {
      return this.aplicacion.id
        ? this.aplicacion.id > 0
          ? "Actualizar Aplicacion"
          : "Guardar Aplicacion"
        : "Guardar Aplicacion";
    },
  },
  emits: ["savedAplicacion"],
  props: ["aplicacionNombre", "aplicacionId", "aplicacionVersion", "aplicacionIndice"],
  methods: {
    async saveOrUpdateAplicacion() {
      if (this.validate()) {
        try {
          await this.$store.dispatch("aplicaciones/saveOrUpdate", {
            indice: this.indice,
            aplicacion: this.aplicacion,
            mode: this.mode,
          });
          this.submitted = true;
          this.$emit("savedAplicacion", {
            errorCode: 0,
            message: "El aplicacion se ha guardado exitosamente.",
          });
          this.reiniciarAplicacion();
        } catch (error) {
          this.$emit("savedAplicacion", {
            errorCode: 1,
            message: error,
          });
        }
      }
    },
    nuevo() {
      this.reiniciarAplicacion();
    },
    reiniciarAplicacion() {
      this.indice = null;
      this.aplicacion.id = null;
      this.aplicacion.nombre = null;
      this.aplicacion.version = null;
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
      return this.aplicacion.nombre && this.aplicacion.nombre != "";
    },
    isVersionValid() {
      return this.aplicacion.version && this.aplicacion.version != "";
    },
  },
};
</script>
