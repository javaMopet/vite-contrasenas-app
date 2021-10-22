<template>
  <section class="container-fluid bg-dark">
    <nav class="navbar navbar-expand-lg navbar-dark navbar-sticky">
      <div class="container-fluid">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <router-link to="/" class="nav-link text-light fw-bold p-0 m-0">
            <span class="secure">Secure</span> Password
            <img
              src="/images/5291171.png"
              alt="logo"
              style="width: 35px; height: 35px"
            />
          </router-link>
        </ul>
        <button
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#Navigation"
          aria-controls="Navigation"
          aria-expanded="false"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="Navigation">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item active ms-3" v-if="isLoggedIn">
              <!-- <a href="#" class="nav-link">Servicios</a> -->
              <router-link to="/servicios" class="nav-link"
                >Servicios</router-link
              >
            </li>
            <li class="nav-item dropdown" v-if="isLoggedIn">
              <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Administrador</a
              >
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/servidores" class="dropdown-item"
                    >Servidores</router-link
                  >
                </li>
                <li>
                  <router-link to="/aplicaciones" class="dropdown-item"
                    >Aplicaciones</router-link
                  >
                </li>
                <li v-if="isAdminUser"><hr class="dropdown-divider" /></li>
                <li v-if="isAdminUser">
                  <router-link to="/admin/empleados" class="dropdown-item"
                    >Empleados</router-link
                  >
                </li>
              </ul>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <router-link
              :class="{
                btn: true,
                'btn-light': isLoginRoute,
                'btn-outline-light': !isLoginRoute,
                'me-2': true,
              }"
              to="/auth/login"
              v-if="!isLoggedIn"
              >Login</router-link
            >
            <router-link
              :class="{
                btn: true,
                'btn-light': !isLoginRoute,
                'btn-outline-light': isLoginRoute,
                'me-2': true,
              }"
              to="/auth/signup"
              v-if="!isLoggedIn"
              >SignUp</router-link
            >
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item active ms-3" v-if="isLoggedIn">
                <!-- <a href="#" class="nav-link">Servicios</a> -->
                <router-link to="/servicios" class="nav-link">{{
                  usuarioSesionNombre
                }}</router-link>
              </li>
            </ul>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item active ms-3" v-if="isLoggedIn">                
                <router-link to="" @click="logout" class="salir"><i class="bi bi-person-x fs-5"></i> Salir</router-link>                
              </li>
            </ul>

            <!-- <button
              class="btn btn-info text-dark p-1"
              type="button"
              v-if="isLoggedIn"
              @click="logout"
            >
              <i class="bi bi-box-arrow-right"></i>
              <span> Salir</span>
            </button> -->
          </div>
        </div>
      </div>
    </nav>
  </section>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/auth/login");
    },
  },
  computed: {
    isAdminUser() {
      return this.$store.getters.isEmpleadoAdmin;
    },
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    usuarioSesionLogin() {
      return this.$store.getters.empleadoLogin;
    },
    usuarioSesionNombre() {
      return this.$store.getters.empleadoNombre;
    },
    isLoginRoute() {
      const mode = this.$route.params.mode;
      return mode === "login" ? true : false;
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Akronim&family=Ephesis&display=swap");

.logo {
  font-family: "Akronim", cursive;
  font-size: 1.5rem;
  font-weight: bold;
  color: lightblue;
}
.secure {
  color: rgb(0, 252, 34);
  font-family: "Titillium Web", sans-serif;
}
.salir{
  font-weight: bold;  
  color: aquamarine;
  padding: 5px;
  border: 1px solid rgb(132, 228, 215);
  border-radius: 10px;
  text-decoration: none;
}
.salir:hover{
    /* background-color: rgb(20, 4, 49); */
    background-color: rgb(104, 103, 105);
    padding: 5px;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid chartreuse;    
    text-decoration: none;
}
</style>
