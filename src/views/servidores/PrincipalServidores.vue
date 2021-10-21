<template>
  <div class="container-lg">
    <div id="liveAlertPlaceholder"></div>
    <h2 class="text-dark my-3">Servidores</h2>
    <!-- TODO: LISTA DE SERVIDORES  -->
    <div class="container-fluid mt-4 p-0">
      <div class="container-fluid p-0 my-1">
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#formServidor"
          @click="reiniciarServidorModificar"
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
          !isLoading && filteredServidores && filteredServidores.length > 0
        "
      >
        <caption>
          Lista de servidores
        </caption>
        <thead>
          <tr>            
            <th scope="col">Nombre del Servidor</th>
            <th scope="col">Dirección IP</th>
            <th scope="col" width="120px"></th>
            <th scope="col" width="120px"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(servidor, indice) in filteredServidores"
            :key="servidor.id"
          >            
            <td>{{ servidor.nombre }}</td>
            <td>{{ servidor.ip }}</td>
            <td>
              <button
                class="btn btn-outline-primary me-3 p-1"
                data-bs-toggle="modal"
                data-bs-target="#formServidor"
                @click="preUpdate(indice, servidor)"
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
                @click="preDelete(indice, servidor.id)"
              >
                <i class="bi bi-x-octagon"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-dark d-flex align-items-center" v-else>
        No se ha registrado ningun servidor. Comienza agregando servidores.
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
              Eliminar Servidor
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Esta seguro que desea eliminar el servidor?</p>
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
              @click="eliminarServidor"
            >
              Eliminar Servidor
            </button>
          </div>
        </div>
      </div>
    </div>
    <teleport to="body">
      <div
        class="modal fade"
        id="formServidor"
        data-bs-backdrop="modal"
        tabindex="-1"
        aria-labelledby="formTitleLabel"
        aria-hidden="true"
      >
        <form-servidor
          @savedServidor="postSaveServidor"
          :servidorId="servidorModificar.id"
          :servidorIndice="servidorModificar.indice"
          :servidorNombre="servidorModificar.nombre"
          :servidorIp="servidorModificar.ip"
        ></form-servidor>
      </div>
    </teleport>
  </div>
</template>
<script>
import FormServidor from "../servidores/FormServidor.vue";
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
      servidorModificar: {
        indice: null,
        id: null,
        nombre: null,
        ip: null,
      },
      // servidores: [],
    };
  },
  components: { FormServidor },
  computed: {
    filteredServidores() {
      return this.$store.getters["servidores/servidores"];
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    postSaveServidor(data) {
      if (data.errorCode === 0) {
        this.alert(data.message, "success");
      } else if (data.errorCode > 0) {
        this.alert(data.message, "danger");
      }
      var myModalEl = document.getElementById("formServidor");
      var modal = Modal.getInstance(myModalEl);
      modal.toggle();
    },
    reiniciarServidorModificar() {
      this.servidorModificar.indice = null;
      this.servidorModificar.id = null;
      this.servidorModificar.nombre = null;
      this.servidorModificar.ip = null;
    },
    preDelete(indice, id) {
      this.indice_eliminar = indice;
      this.id_eliminar = id;
    },
    preUpdate(indice, servidor) {
      this.servidorModificar = {
        id: servidor.id,
        indice: indice,
        nombre: servidor.nombre,
        ip: servidor.ip,
      };
    },
    eliminarServidor() {
      try {
        this.$store.dispatch("servidores/requestDelete", {
          indice: this.indice_eliminar,
          servidor: {
            id: this.id_eliminar,
          },
        });
        this.alert("Servidor eliminado.", "success");
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
      await this.$store.dispatch("servidores/listarServidores");
    } catch (error) {
      this.alert(error || "Error desconocido.", "danger");
    }
  },
};
</script>

