<template>
  <div class="container-lg">
    <div id="liveAlertPlaceholder"></div>
    <h2 class="text-dark my-3">Servicios</h2>
    <!-- TODO: LISTA DE SERVIDORES  -->
    <div class="container-fluid mt-4 p-0">
      <div class="container-fluid p-0 my-1">
        <button
          class="btn btn-outline-dark"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#formServicio"
          @click="addNew"
        >
          Add
        </button>
      </div>
      <!-- v-else-if="          !isLoading && filteredServicios && filteredServicios.length > 0        " -->
      <table class="table table-sm table-dark">
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
      <!-- <div class="text-dark d-flex align-items-center">
        No se ha registrado ningun servicio. Comienza agregando servicios.
      </div> -->
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
          :servicioId="servicioModificar.id"
          :servicioIndice="servicioModificar.indice"
          :servicioServidorId="servicioModificar.servidorId"
          :servicioAplicacionId="servicioModificar.aplicacionId"
          :servicioPuerto="servicioModificar.puerto"
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
      error: null,
      saving: null,
      mensajeError: "",
      indice_eliminar: null,
      id_eliminar: null,
      servicioModificar: {
        indice: null,
        id: null,
        servidorId: null,
        aplicacionId: null,
        puerto: null,
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
    addNew() {
      try {
        this.servicioModificar.indice = null;
        this.servicioModificar.id = null;
        this.servicioModificar.servidorId = null;
        this.servicioModificar.aplicacionId = null;
      } catch (error) {
        this.alert(error || "Error desconocido.", "danger");
      }
    },
    preDelete(indice, id) {
      console.log(indice);
      console.log(id);

      this.indice_eliminar = indice;
      this.id_eliminar = id;
    },
    preUpdate(indice, servicio) {
      this.servicioModificar = {
        id: servicio.id,
        indice: indice,
        servidorId: servicio.servidorId,
        aplicacionId: servicio.aplicacionId,
        puerto: servicio.puerto,
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
  mounted() {
    try {
      this.$store.dispatch("servicios/resetServicios");
      this.$store.dispatch("servicios/listarServicios");
      console.log("Despues de obtener el listado de servicios");
    } catch (error) {
      this.alert(error || "Error desconocido.", "danger");
    }
  },
};
</script>
