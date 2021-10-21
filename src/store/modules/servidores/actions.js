import axios from "axios";
import router from "../../../router/index.js";
const host = "http://localhost:3000/api/v1/servidores/";

const thenResponse = (response, context) => {
  context.dispatch("endRequest", "", { root: true });
  if (response.ok) {
    return response.json();
  } else {
    statusResponseError(response, response.json(), context);
  }
};
const statusResponseError = (httpResponse, responseData, context) => {
  if (httpResponse.status === 403) {
    context.dispatch("logout", "", { root: true }); //Se especifica que la accion es del módulo root
    router.replace("/auth/login?sessionExpired=true");
    return;
  } else if (httpResponse.status === 422) {
    const mensajes = responseData.messages;
    const mensajeError = mensajes.includes("Nombre has already been taken")
      ? "Ya existe un servidor con el mismo nombre"
      : mensajes;
    throw new Error(mensajeError || "El servidor no puede ser guardado");
  }
  throw new Error(
    httpResponse.message || "Error desconocido al intentar guardar el servidor."
  );
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
      throw new Error("No hay conexion al servidor de datos.");
    }
    throw new Error("No es posible realizar la petición al servidor");
  } else {
    // Something happened in setting up the request that triggered an Error    
  }
};

const getResults = (response) => {
  const responseData = response.data;
  const results = [];
  for (const id in responseData) {
    results.push({
      id: responseData[id].attributes.id,
      nombre: responseData[id].attributes.nombre,
      ip: responseData[id].attributes.ip,
    });
  }
  return results;
};

export default {
  async listarServidores(context) {
    await axios
      .get(host, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + context.rootGetters.token,
        },
      })
      .then((response) => {
        context.commit("addServidores", getResults(response.data));
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
    console.log("save or update from actions servidores...");
    var method = "";
    var url = host;
    if (payload.mode === "Guardar") {
      method = "POST";
      payload.servidor.empleado_id = context.rootGetters.empleadoId;
    } else if (payload.mode === "Actualizar") {
      method = "PUT";
      url = url + payload.servidor.id
    }
    console.log(url);

    console.log(payload.servidor);
    // THIS IS WHERE YOU SUBMIT DATA TO SERVER
    await axios({
      method: method,
      url: url,
      headers: {
        'Content-type': 'application/json',
        Authorization: "Bearer " + context.rootGetters.token,
      },
      data: JSON.stringify(payload.servidor),
    }).then((response) => {
      console.log("Respondido correctamente");      
      const responseData = response.data.data;   
      console.log(responseData);
      const servidorResponse = {
        id: responseData.attributes.id,
        nombre: responseData.attributes.nombre,
        ip: responseData.attributes.ip,
      };
      console.log("indice en saver or update actions");
      console.log(payload.indice);
      context.commit("saveOrUpdate", {
        mode: payload.mode,
        indice: payload.indice,
        servidor: servidorResponse
      });
    }).catch(function (error) {
      console.log("error en saveOrUpdate");
      console.log(error);
      tratarError(error, context);
    }).then(function () {
      console.info("then save or update");
    });

    // const responseData = await httpResponse.json();

    // if (!httpResponse.ok) {
    //   statusResponseError(httpResponse, responseData, context);
    // } else {
    //   const servidorCreado = {
    //     id: responseData.data.id,
    //     nombre: responseData.data.attributes.nombre,
    //     ip: responseData.data.attributes.ip,
    //   };
    //   context.commit("addServidor", servidorCreado);
    // }
  },
  requestDelete(context, payload) {
    const indice = payload.indice;
    const servidorId = payload.servidor.id;

    fetch(host + servidorId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + context.rootGetters.token,
      },
    }).then((response) => {
      if (response.ok) {
        context.commit("spliceServidor", {
          indice: indice,
        });
      }
    });
  },
};
