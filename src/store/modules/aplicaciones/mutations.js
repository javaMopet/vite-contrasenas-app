export default {
    saveOrUpdate(state,payload){
        if(payload.mode === 'Guardar'){
            state.aplicaciones.push(payload.aplicacion);
        }else if(payload.mode === 'Actualizar'){
            console.log("Actualizando listado en el indice: " + payload.indice);
            state.aplicaciones.splice(payload.indice,1,payload.aplicacion);
        }        
    },
    addAplicaciones(state, payload){
        state.aplicaciones = payload;
    },
    spliceAplicacion(state, payload){
        const indice = payload.indice;        
        state.aplicaciones.splice(indice, 1);
    }
}