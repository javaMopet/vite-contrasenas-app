<template>
  <div class="container-lg">
    <div id="liveAlertPlaceholder"></div>
    <h2 class="text-dark my-3">Aplicaciones</h2>
    <!-- TODO: LISTA DE SERVIDORES  -->
    <div class="container-fluid mt-4 p-0">
      <div class="container-fluid p-0 my-1">
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#formAplicacion"
          @click="reiniciarAplicacionModificar"
        >
          Add
        </button>
      </div>
      <div class="d-flex align-items-center text-info" v-if="isLoading">
        <strong>Loading...</strong>
        <div
          class="spinner-grow ml-auto"
          role="status"
          aria-hidden="true"
        ></div>
      </div>
      <table
        class="table table-sm table-light"
        v-else-if="
          !isLoading && filteredAplicaciones && filteredAplicaciones.length > 0
        "
      >
        <caption>
          Lista de aplicaciones
        </caption>
        <thead>
          <tr>            
            <th scope="col">Nombre del Aplicacion</th>
            <th scope="col">Versión</th>
            <th scope="col" width="80px"></th>
            <th scope="col" width="80px"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(aplicacion, indice) in filteredAplicaciones"
            :key="aplicacion.id"
          >            
            <td>{{ aplicacion.nombre }}</td>
            <td>{{ aplicacion.version }}</td>
            <td>
              <button
                class="btn btn-outline-primary me-3 p-1"
                data-bs-toggle="modal"
                data-bs-target="#formAplicacion"
                @click="preUpdate(indice, aplicacion)"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
            <td>
              <button
                role="button"
                class="btn btn-outline-danger me-3 p-1"
                data-bs-toggle="modal"
                data-bs-target="#modalConfirm"
                @click="preDelete(indice, aplicacion.id)"
              >
                <i class="bi bi-x-octagon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-dark d-flex align-items-center" v-else>
        No se ha registrado ningun aplicacion. Comienza agregando aplicaciones.
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalConfirm"
      data-bs-backdrop="static"
      tabindex="-1"
      aria-labelledby="modalConfirmLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-primary">
            <h5 class="modal-title" id="modalConfirmLabel">
              Eliminar Aplicacion
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Esta seguro que desea eliminar el aplicacion?</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="eliminarAplicacion"
            >
              Eliminar Aplicacion
            </button>
          </div>
        </div>
      </div>
    </div>
    <teleport to="body">
      <div
        class="modal fade"
        id="formAplicacion"
        data-bs-backdrop="modal"
        tabindex="-1"
        aria-labelledby="formTitleLabel"
        aria-hidden="true"
      >
        <form-aplicacion
          @savedAplicacion="postSaveAplicacion"
          :aplicacionId="aplicacionModificar.id"
          :aplicacionIndice="aplicacionModificar.indice"
          :aplicacionNombre="aplicacionModificar.nombre"
          :aplicacionVersion="aplicacionModificar.version"
        ></form-aplicacion>
      </div>
    </teleport>
  </div>
</template>
<script>
import FormAplicacion from "../aplicaciones/FormAplicacion.vue";
import { Modal, Alert } from "bootstrap";

export default {
  data: function () {
    return {
      isLoading: false,
      error: null,
      saving: null,
      mensajeError: "",
      indice_eliminar: null,
      id_eliminar: null,
      aplicacionModificar: {
        indice: null,
        id: null,
        nombre: null,
        version: null,
      },
      // aplicaciones: [],
    };
  },
  components: { FormAplicacion },
  computed: {
    filteredAplicaciones() {
      return this.$store.getters["aplicaciones/aplicaciones"];
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    postSaveAplicacion(data) {
      if (data.errorCode === 0) {
        this.alert(data.message, "success");
      } else if (data.errorCode > 0) {
        this.alert(data.message, "danger");
      }
      var myModalEl = document.getElementById("formAplicacion");
      var modal = Modal.getInstance(myModalEl);
      modal.toggle();
    },
    reiniciarAplicacionModificar() {
      this.aplicacionModificar.indice = null;
      this.aplicacionModificar.id = null;
      this.aplicacionModificar.nombre = null;
      this.aplicacionModificar.version = null;
    },
    preDelete(indice, id) {
      this.indice_eliminar = indice;
      this.id_eliminar = id;
    },
    preUpdate(indice, aplicacion) {
      this.aplicacionModificar = {
        id: aplicacion.id,
        indice: indice,
        nombre: aplicacion.nombre,
        version: aplicacion.version,
      };
    },
    eliminarAplicacion() {
      try {
        this.$store.dispatch("aplicaciones/requestDelete", {
          indice: this.indice_eliminar,
          aplicacion: {
            id: this.id_eliminar,
          },
        });
        this.alert("Aplicacion eliminado.", "success");
      } catch (error) {
        this.alert(error.message, "danger");
      }
    },
    alert(message, type) {
      var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
      var wrapper = document.createElement("div");
      wrapper.innerHTML =
        '<div class="alert alert-' +
        type +
        ' alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

      alertPlaceholder.append(wrapper);

      setTimeout(() => {
        var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
        alertPlaceholder.innerHTML = "";
      }, 3000);
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("aplicaciones/listarAplicaciones");
    } catch (error) {
      this.alert(error || "Error desconocido.", "danger");
    }
  },
};
</script>