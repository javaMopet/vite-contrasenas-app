<template>
  <div class="container-lg">
    <div id="liveAlertPlaceholder"></div>
    <h2 class="text-dark my-3">Servicios</h2>
    <!-- TODO: LISTA DE SERVIDORES  -->
    <div class="container-fluid mt-4 p-0">
      <div class="container-fluid p-0 my-1">
        <button
          class="btn btn-outline-success"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#formServicio"
          @click="reiniciarServicioModificar"
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
          !isLoading && filteredServicios && filteredServicios.length > 0
        "
      >
        <caption>
          Lista de servicios
        </caption>
        <thead>
          <tr>            
            <th scope="col">Nombre del Servidor</th>
            <th scope="col">Nombre de la aplicación</th>
            <th scope="col">Puerto</th>
            <th scope="col" width="80px"></th>
            <th scope="col" width="80px"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(servicio, indice) in filteredServicios"
            :key="servicio.id"
          >            
            <td>{{ servicio.nombreServidor }}</td>
            <td>{{ servicio.nombreAplicacion }}</td>
            <td>{{ servicio.puerto }}</td>
            <td>
              <button
                class="btn btn-outline-primary me-3 p-1"
                data-bs-toggle="modal"
                data-bs-target="#formServicio"
                @click="preUpdate(indice, servicio)"
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
                @click="preDelete(indice, servicio.id)"
              >
                <i class="bi bi-x-octagon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-dark d-flex align-items-center" v-else>
        No se ha registrado ningun servicio. Comienza agregando servicios.
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
              Eliminar Servicio
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Esta seguro que desea eliminar el servicio?</p>
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
              @click="eliminarServicio"
            >
              Eliminar Servicio
            </button>
          </div>
        </div>
      </div>
    </div>
    <teleport to="body">
      <div
        class="modal fade"
        id="formServicio"
        data-bs-backdrop="modal"
        tabindex="-1"
        aria-labelledby="formTitleLabel"
        aria-hidden="true"
      >
        <form-servicio
          @savedServicio="postSaveServicio"
          :aplicacionId="aplicacionModificar.id"
          :aplicacionIndice="aplicacionModificar.indice"
          :aplicacionNombre="aplicacionModificar.nombre"
          :aplicacionVersion="aplicacionModificar.version"
        ></form-servicio>
      </div>
    </teleport>
  </div>
</template>
<script>
import FormServicio from "../servicios/FormServicio.vue";
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
      // servicios: [],
    };
  },
  components: { FormServicio },
  computed: {
    filteredServicios() {
      return this.$store.getters["servicios/servicios"];
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    postSaveServicio(data) {
      if (data.errorCode === 0) {
        this.alert(data.message, "success");
      } else if (data.errorCode > 0) {
        this.alert(data.message, "danger");
      }
      var myModalEl = document.getElementById("formServicio");
      var modal = Modal.getInstance(myModalEl);
      modal.toggle();
    },
    reiniciarServicioModificar() {
      this.aplicacionModificar.indice = null;
      this.aplicacionModificar.id = null;
      this.aplicacionModificar.nombre = null;
      this.aplicacionModificar.version = null;
    },
    preDelete(indice, id) {
      this.indice_eliminar = indice;
      this.id_eliminar = id;
    },
    preUpdate(indice, servicio) {
      this.aplicacionModificar = {
        id: servicio.id,
        indice: indice,
        nombre: servicio.nombre,
        version: servicio.version,
      };
    },
    eliminarServicio() {
      try {
        this.$store.dispatch("servicios/requestDelete", {
          indice: this.indice_eliminar,
          servicio: {
            id: this.id_eliminar,
          },
        });
        this.alert("Servicio eliminado.", "success");
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
      await this.$store.dispatch("servicios/listarServicios");
    } catch (error) {
      this.alert(error || "Error desconocido.", "danger");
    }
  },
};
</script>