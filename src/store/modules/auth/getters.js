export default {
    empleadoId(state){
        return state.empleadoId;
    },
    empleadoLogin(state){
        return state.empleadoLogin;
    },
    empleadoNombre(state){
        return state.empleadoNombre;
    },
    isEmpleadoAdmin(state){                
        if (state.empleadoRol && parseInt(state.empleadoRol) === 1){
            return true;
        }
        return false;
    },
    token(state){
        return state.token;
    },
    isAuthenticated(state){          
        return !!state.token; //Con la doble marca de exclamacion convertimos a booleano
    }
};