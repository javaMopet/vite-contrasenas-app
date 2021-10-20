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
            <th scope="col">Id</th>
            <th scope="col">indice</th>
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
            <td>{{ servidor.id }}</td>
            <td>{{ indice }}</td>
            <td>{{ servidor.nombre }}</td>
            <td>{{ servidor.ip }}</td>
            <td>
              <button
                class="btn btn-primary text-ligth me-3 p-1"
                @click="preUpdate(indice, servidor)"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
            <td>
              <a
                role="button"
                class="control-button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                @click="preDelete(indice, servidor.id)"
                ><i
                  class="bi bi-x-octagon"
                  style="font-size: 14px !important"
                ></i>
                Eliminar</a
              >
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
      id="exampleModal"
      data-bs-backdrop="static"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-primary">
            <h5 class="modal-title" id="exampleModalLabel">
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
import { Modal } from "bootstrap";

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
      // var modal = bootstrap.modal.getInstance(myModalEl);
      var modal = Modal.getInstance(myModalEl);
      modal.toggle();
    },
    loadServidores() {},
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
        this.mandarAlertaAccionSuccess("se ha eliminado correctamente.");
      } catch (error) {
        this.mandarAlertaAccionError(error.message);
      }
    },
    mandarAlertaAccionSuccess(mensaje) {
      this.saving = true;
      this.mensajeSuccess = mensaje;
      this.mensajeError = "";
      setTimeout(() => {
        this.saving = null;
      }, 4000);
    },
    mandarAlertaAccionError(mensaje) {
      this.saving = true;
      this.mensajeSuccess = "";
      this.mensajeError = mensaje;
      setTimeout(() => {
        this.saving = null;
      }, 4000);
    },
    alert(message, type) {
      var alertPlaceholder = document.getElementById("liveAlertPlaceholder");
      var wrapper = document.createElement("div");
      wrapper.innerHTML =
        '<div class="alert alert-' +
        type +
        ' alert-dismissible" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

      alertPlaceholder.append(wrapper);
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
<style lang="scss" scoped>
.control-button {
  padding: 2px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  color: red;
  &:hover {
    background-color: rgba(168, 15, 15, 0.7);
    color: white;
    font-weight: bold;
    border-radius: 6px;
  }
}
</style>
