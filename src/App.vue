<template>
  <the-header></the-header>  
  <div class="container-fluid m-0 p-0 h-100">
    <router-view />
  </div>
  <teleport to="body">
    <transition>
      <div id="miModal" class="modal-request" v-if="isProcesando">
        <div class="modal-request-contenido p-0">
          <div class="container-fluid bg-white p-2 m-0">
            <h1>Procesando..</h1>
            <div class="lds-ellipsis">
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import axios from "axios";
export default {
  components: { TheHeader },
  data() {
    return {
      requestsNumber: 0,
    };
  },
  computed: {
    isProcesando() {
      return this.requestsNumber > 0;
    },
  },
  created() {
    this.$store.dispatch("tryLogin");

    axios.interceptors.request.use(
      (config) => {
        // console.log(config.url);
        // console.log(config.method);
        this.requestsNumber++;
        return config;
      },
      (error) => {
        console.info("axios interceptor error request. Error Requesting......");
        // this.$store.commit("loading", false);
        // modal.hide();
        this.requestsNumber--;
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        console.info("axios interceptor response response. Responsed......");
        this.requestsNumber--;
        return response;
      },
      (error) => {
        console.info("axios interceptor errorResponse. Responsed......");
        this.requestsNumber--;
        return Promise.reject(error);
      }
    );
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.min.css";
</style>
<style scoped>
/** MODAL css**/
.modal-request-contenido {
  background-color: gray;
  width: 400px;
  padding: 10px 20px;
  margin: 20% auto;
  position: relative;
  opacity: 1 !important;
}

.modal-request {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.85;
  pointer-events: auto;
  /* transition: all 2s; */
}

/** ANIMATION **/
.v-enter-from{
  opacity:0;
}

.v-enter-active{
transition: all 0.5s ease-out;
}

.v-enter-to{
  opacity: 0.85;
}
.v-leave-from{
  opacity: 0.85;
}

.v-leave-active{
  transition: all 0.5s ease-in;
}
.v-leave-to{
  opacity: 0;
}

/** https://loading.io/css/ */
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ellipsis div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ddd;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 6px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 6px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 45px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
</style>
