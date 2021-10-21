export default {
    saveOrUpdate(state,payload){
        if(payload.mode === 'Guardar'){
            state.servicios.push(payload.servicio);
        }else if(payload.mode === 'Actualizar'){
            console.log("Actualizando listado en el indice: " + payload.indice);
            state.servicios.splice(payload.indice,1,payload.servicio);
        }        
    },
    addServicios(state, payload){
        state.servicios = payload;
    },
    spliceServicio(state, payload){
        const indice = payload.indice;        
        state.servicios.splice(indice, 1);
    }
}