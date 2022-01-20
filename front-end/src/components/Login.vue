<template>
<main>
  <section class="section__login">
    <img src="../assets/images/logo_black.png" alt="Groupomania">
    <h1>Bienvenue</h1>

      <form class="form__login">

        <div class="login__info">
          <input id="pseudo" 
          type="pseudo" 
          name="pseudo"
          placeholder="Pseudonyme"
          v-model="check_pseudo"
          required>
          <p v-if="check_pseudo == false" class="login_err"> Pseudo invalide </p>
        </div>

        <div class="login__info">
          <input id="email" 
          type="email" 
          name="email" 
          placeholder="E-mail"
          v-model="check_email"
          required>
          <p v-if="check_email == false" class="login_err"> Email invalide </p>
        </div>
        
        <div class="login__info">
          <input id="password" 
          type="password" 
          name="password" 
          placeholder="Mot de passe"
          v-model="check_password"
          required>
          <p v-if="check_password == false" class="login_err"> Mot de passe inccorect </p>
        </div>

         <button> Connexion </button>
      </form>

      <div class="login__redirect">
        <p>Vous n'avez pas encore de compte ?</p>
        <button><router-link to="/">S'inscrire</router-link></button> 
      </div>

  </section>
</main>
</template>

<script>



export default {

};
</script>


<style lang="scss" scoped>

main {
  display: flex;
  justify-content: center;
}

section{
  display:flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 200px;
  margin-bottom: 200px;
  width:40%;
  border: 2px solid black;
  height: 400px;
}

img {
  width: 60%;
}

.form__login {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 200px;
}

.login__info {
  
}

</style>