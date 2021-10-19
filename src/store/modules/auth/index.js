import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      empleadoId: null ,
      empleadoRol:null,
      empleadoLogin:null,
      empleadoNombre:null,
      token: null
    };
  },
  mutations,
  actions,
  getters,
};
