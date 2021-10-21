import axios from "axios";
import router from "../../../router/index.js";
const host = "http://localhost:3000/servicios/";

export default {
  async listarServicios(context) {
    console.log('listando Servicios')
    await axios
      .get(host, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + context.rootGetters.token,
        },
      })
      .then((response) => {
        context.commit("addServicios", getResults(response.data));
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
      payload.servicio.empleado_id = context.rootGetters.empleadoId;
    } else if (payload.mode === "Actualizar") {
      method = "PUT";
      url = url + payload.servicio.id
    }    
    await axios({
      method: method,
      url: url,
      headers: {
        'Content-type': 'application/json',
        Authorization: "Bearer " + context.rootGetters.token,
      },
      data: JSON.stringify(payload.servicio),
    }).then((response) => {      
      const responseData = response.data.data;   
      console.log(responseData);
      const servicioResponse = {
        id: responseData.attributes.id,
        nombre: responseData.attributes.nombre,
        version: responseData.attributes.version,
      };      
      context.commit("saveOrUpdate", {
        mode: payload.mode,
        indice: payload.indice,
        servicio: servicioResponse
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
    const servicioId = payload.servicio.id;

    fetch(host + servicioId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + context.rootGetters.token,
      },
    }).then((response) => {
      if (response.ok) {
        context.commit("spliceservicio", {
          indice: indice,
        });
      }
    });
  },
};

const getResults = (response) => {  
  const responseData = response.data;  
  const results = [];
  console.log(responseData);
  for (const id in responseData) {
    results.push({      
      id: responseData[id].attributes.id,
      nombreServidor: responseData[id].attributes.servidor.nombre,
      nombreAplicacion:responseData[id].attributes.aplicacion.nombre,
      puerto: responseData[id].attributes.puerto,
    });
  }  
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
      throw new Error("No hay conexion al servicio de datos.");
    }
    throw new Error("No es posible realizar la petición al servicio");
  } else {
    // Something happened in setting up the request that triggered an Error    
  }
};
