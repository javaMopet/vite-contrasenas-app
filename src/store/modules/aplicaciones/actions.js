import axios from "axios";
import router from "../../../router/index.js";
const host = "http://localhost:3000/aplicaciones/";

export default {
  async listarAplicaciones(context) {
    console.log('listando aplicaciones')
    await axios
      .get(host, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + context.rootGetters.token,
        },
      })
      .then((response) => {
        context.commit("addAplicaciones", getResults(response.data));
      })
      .catch(function (error) {
        // handle error        
        tratarError(error, context);
      })
      .then(function () {
        console.info("then");
      });
  }, 
  async saveOrUpdate(context, payload) {    
    var method = "";
    var url = host;
    if (payload.mode === "Guardar") {
      method = "POST";
      payload.aplicacion.empleado_id = context.rootGetters.empleadoId;
    } else if (payload.mode === "Actualizar") {
      method = "PUT";
      url = url + payload.aplicacion.id
    }    
    await axios({
      method: method,
      url: url,
      headers: {
        'Content-type': 'application/json',
        Authorization: "Bearer " + context.rootGetters.token,
      },
      data: JSON.stringify(payload.aplicacion),
    }).then((response) => {      
      const responseData = response.data.data;   
      console.log(responseData);
      const aplicacionResponse = {
        id: responseData.attributes.id,
        nombre: responseData.attributes.nombre,
        version: responseData.attributes.version,
      };      
      context.commit("saveOrUpdate", {
        mode: payload.mode,
        indice: payload.indice,
        aplicacion: aplicacionResponse
      });
    }).catch(function (error) {
      console.log("error en saveOrUpdate");
      console.log(error);
      tratarError(error, context);
    }).then(function () {
      console.info("then save or update");
    });
  },
  requestDelete(context, payload) {
    const indice = payload.indice;
    const aplicacionId = payload.aplicacion.id;

    fetch(host + aplicacionId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + context.rootGetters.token,
      },
    }).then((response) => {
      if (response.ok) {
        context.commit("spliceAplicacion", {
          indice: indice,
        });
      }
    });
  },
};

const getResults = (response) => {  
  const responseData = response.data;  
  const results = [];
  for (const id in responseData) {
    results.push({
      id: responseData[id].attributes.id,
      nombre: responseData[id].attributes.nombre,
      version: responseData[id].attributes.version,
    });
  }  
  // console.log(results);
  return results;
};

const tratarError = (error, context) => {
  if (error.response) {
    const status = error.response.status;

    if (status === 403) {
      context.dispatch("logout", "", { root: true }); //Se especifica que la accion es del módulo root
      router.replace("/auth/login?sessionExpired=true");
      return;
    }
  } else if (error.request) {
    if (error.request.timeout === 0 && error.request.status === 0) {
      throw new Error("No hay conexion al aplicacion de datos.");
    }
    throw new Error("No es posible realizar la petición al aplicacion");
  } else {
    // Something happened in setting up the request that triggered an Error    
  }
};
