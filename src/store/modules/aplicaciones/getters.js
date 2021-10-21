export default {
    aplicaciones(state){
        return state.aplicaciones;
    },
    hasAplicaciones(state){
        return state.aplicaciones  && state.aplicaciones.length > 0;
    }
}