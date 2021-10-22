<template>
  <div class="container-fluid sesion">
    <div class="container-fluid">
      <div class="container row">
        <div class="col-12 col-md-6 p-0 mt-5">
          <img
            src="/images/password_image.jpg"
            class="figure-img img-fluid z-depth-2 rounded-circle"
            alt="image"
            data-holder-rendered="true"
          />
        </div>
        <div class="col-12 col-md-6 m-0 p-0">
          <div class="container-fluid d-flex align-items-center h-100">
            <div class="container ms-5">
              <div class="display-3 text-white fw-bold presentacion">
                BEST <span class="secure">Secure</span>
              </div>
              <hr class="linea" />
              <div class="display-3 text-white fw-bold presentacion2">
                PASSWORD MANAGER
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,600;0,700;1,600&display=swap");
.sesion {
  height: 94vh;
  background: rgba(50, 51, 90, 0.85);
}
.linea {
  width: 80% !important;
  height: 9px;
  text-align: left;
  margin-left: 0;
  color: rgb(0, 252, 34);
  opacity: 1;
}
.secure {
  color: rgb(0, 252, 34);
  font-family: "Titillium Web", sans-serif;
}
.presentacion {
  font-family: "Titillium Web", sans-serif;
  font-style: italic;
}
.presentacion2 {
  font-family: "Titillium Web", sans-serif;
}
</style>
