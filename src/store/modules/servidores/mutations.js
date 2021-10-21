export default {
    saveOrUpdate(state,payload){
        if(payload.mode === 'Guardar'){
            state.servidores.push(payload.servidor);
        }else if(payload.mode === 'Actualizar'){
            console.log("Actualizando listado en el indice: " + payload.indice);
            state.servidores.splice(payload.indice,1,payload.servidor);
        }        
    },
    addServidores(state, payload){
        state.servidores = payload;
    },
    spliceServidor(state, payload){
        const indice = payload.indice;        
        state.servidores.splice(indice, 1);
    }
}