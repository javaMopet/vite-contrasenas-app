export default {
    servicios(state){
        return state.servicios;
    },
    hasServicios(state){
        return state.servicios  && state.servicios.length > 0;
    }
}