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
              <label for="servidor" class="form-label">Servidor:</label>              
              <select
                name="servidor"
                class="form-select"
                aria-labelledby="Seleccionar el servidor"
                required
                v-model="servicio.servidor_id"
              >
                <option value="" disabled selected>
                  -- Selecciona el servidor --
                </option>
                <option
                  v-for="servidor in filteredServidores"
                  :key="servidor.id"
                  :value="servidor.id"
                >
                  {{ servidor.nombre }}
                </option>
              </select>
              <div class="invalid-feedback">
                Favor de ingresar el nombre del servidor.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="version">Aplicacion:</label>
              <select
                name="aplicacion"
                class="form-select"
                aria-labelledby="Seleccionar la aplicacion"
                required
                v-model="servicio.aplicacion_id"
              >
                <option value="" disabled selected>
                  -- Selecciona la aplicación --
                </option>
                <option
                  v-for="aplicacion in filteredAplicaciones"
                  :key="aplicacion.id"
                  :value="aplicacion.id"
                >
                  {{ aplicacion.nombre }} v.{{ aplicacion.version }}
                </option>
              </select>
              <div class="invalid-feedback">
                Favor de ingresar la aplicació.
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="version">Puerto:</label>
              <input
                type="number"
                v-model="servicio.puerto"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isPuertoValid() && puertoBlured,
                }"
                v-on:blur="puertoBlured = true"
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
        servidor_id: null,
        aplicacion_id: null,
        puerto: null,
      },      
      puertoBlured: false,
    };
  },
  watch: {
    servicioId(value) {
      this.servicio.id = value;
      this.indice = this.servicioIndice;
      this.servicio.servidor_id = this.servicioServidorId;
      this.servicio.aplicacion_id = this.servicioAplicacionId;
      this.servicio.puerto = this.servicioPuerto
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
    filteredServidores() {
      return this.$store.getters["servidores/servidores"];
    },
    filteredAplicaciones() {
      return this.$store.getters["aplicaciones/aplicaciones"];
    },
  },
  emits: ["savedServicio"],
  props: ["servicioId", "servicioIndice","servicioServidorId","servicioAplicacionId", "servicioPuerto"],
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
      this.servicio.servidor_id = null;
      this.servicio.aplicacion_id = null;
      this.servicio.puerto = null;
      this.puertoBlured = false;      
    },
    validate() {
      var formValid = true;
      this.puertoBlured = true;
      if (!this.isPuertoValid()) {
        formValid = false;
      }
      return formValid;
    },    
    isPuertoValid() {
      return this.servicio.puerto && this.servicio.puerto != "";
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("servidores/listarServidores");
      await this.$store.dispatch("aplicaciones/listarAplicaciones");
    } catch (error) {
      this.alert(error || "Error desconocido.", "danger");
    }
  },
};
</script>
