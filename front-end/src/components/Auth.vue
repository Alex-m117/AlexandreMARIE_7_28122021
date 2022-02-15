<template>
<main>
  
 <div class="form">
    <h2 class="title__login" v-if="mode == 'login'"> Connexion </h2>
    <h2 class="title__signup" v-if="mode == 'signup'"> Inscription </h2>
 

    <p class="subtitle__signup" v-if="mode == 'login'"> Vous n'avez pas encore de compte ? <br> <span class="switch__mode" @click="switchToSignup()"> <fa icon="user-plus"/> Créer un compte </span></p>
    <p class="subtitle__login" v-if="mode == 'signup'"> Vous avez déjà un compte ? <br> <span class="switch__mode" @click="switchToLogin()"> <fa icon="sign-in-alt"/> Se connecter </span></p> 

      <form @submit.prevent="Connexion" v-if="mode == 'login'" class="form__auth">

        <div class="form__login">
        <input v-if="mode == 'login'"
          v-model="email"
          id="email__login" 
          type="email"  
          placeholder="E-mail"
          required>
          <p v-if="errors.email && mode == 'login'" class="crtl">Email incorrect</p>
        </div>
      
        <div class="form__login">
          <input v-if="mode == 'login'"
          v-model="password"
          id="password__login" 
          type="password" 
          placeholder="Mot de passe"
          required>
          <p v-if="errors.password && mode == 'login'" class="crtl">8 caractères, 1 majuscule, 1 chiffre</p>
        </div>

        <p v-if="invalid.login == true && mode == 'login'" class="account__error"> <fa icon="exclamation"/> Email ou mot de passe incorrect </p>

          <button :disabled="!valideForm" class="validLogin" v-if="mode == 'login' " @click="login()"> Connexion </button>
      </form>

      <form @submit.prevent="Inscription" v-if="mode == 'signup'" class="form__auth">
        
        <div class="form__signup">
          <input v-if="mode == 'signup'"
          v-model="pseudo"
          id="pseudo__signup" 
          type="pseudo" 
          placeholder="Pseudonyme"
          required>
          <p v-if="errors.pseudo && mode == 'signup'" class="crtl">Pseudo incorrect</p>
        </div>
      
        <div class="form__signup">
          <input v-if="mode == 'signup'"
          v-model="email"
          id="email__signup" 
          type="email"  
          placeholder="E-mail"
          required>
          <p v-if="errors.email && mode == 'signup'" class="crtl">Email incorrect</p>
        </div>
 
        <div class="form__signup">
          <input v-if="mode == 'signup'"
          v-model="password"
          id="password__signup" 
          type="password" 
          placeholder="Mot de passe"
          required>
          <p v-if="errors.password && mode == 'signup'" class="crtl">8 caractères, 1 majuscule, 1 chiffre</p>
        </div>
  
        <p v-if="invalid.signup == true && mode == 'signup'" class="account__error"> <fa icon="exclamation"/> Email déjà utilisé </p>

          <button :disabled="!valideForm" class="validSignup" v-if="mode == 'signup' " @click="signup()"> Inscription </button>
      </form>

   </div>
  
</main>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      mode: 'login',
      pseudo:'',
      email: '',
      password:'',
      errors: {
        pseudo: false,
        email: false,
        password: false,
      },
      invalid: {
        signup: false,
        login: false,
      }
      
    }
  },
  computed:{
    valideForm: function() {
      if  (this.mode == 'signup') {
        if (this.pseudo !="" && this.email !="" && this.password !="") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email !="" && this.password !=""){
          return true;
        } else {
          return false;
        }
      }
    }
  },
   
  methods: {
    switchToSignup: function() {
      this.mode = 'signup';
    },
    switchToLogin: function() {
      this.mode = 'login';
    },
    validationSignup: function() {
      //eslint-disable-next-line
      const regexEmail = new RegExp ("^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$");
      const regexPseudo = new RegExp ("^([a-zA-Z0-9-_ ]{2,30})$");
      //eslint-disable-next-line
      const regexPassword = new RegExp ("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}");
      regexPseudo.test(this.pseudo) ? 
      (this.errors.pseudo = false) : (this.errors.pseudo = true);
      regexEmail.test(this.email) ? 
      (this.errors.email = false) : (this.errors.email = true);
      regexPassword.test(this.password) ? 
      (this.errors.password = false) : (this.errors.password = true);
      console.log(regexPseudo.test(this.pseudo))
      console.log(regexEmail.test(this.email))
      console.log(regexPassword.test(this.password))
      return ( 
        regexPseudo.test(this.pseudo) &&
        regexEmail.test(this.email) &&
        regexPassword.test(this.password)
      );
    },
    validationLogin: function() {
      //eslint-disable-next-line
      const regexEmail = new RegExp ("^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$");
      //eslint-disable-next-line
      const regexPassword = new RegExp ("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}");
     
      regexEmail.test(this.email) ? 
      (this.errors.email = false) : (this.errors.email = true);
      regexPassword.test(this.password) ? 
      (this.errors.password = false) : (this.errors.password = true);
      console.log(regexPassword.test(this.password))
      console.log(regexEmail.test(this.email))
      return ( 
        regexEmail.test(this.email) &&
        regexPassword.test(this.password)
      );
    },
    login: function() {
      this.email = document.querySelector('#email__login').value;
      this.password = document.querySelector('#password__login').value;
      if (this.validationLogin()) {
        const tag = this;

        const data = {
          email: this.email,
          password: this.password
        }
        axios.post('http://localhost:3000/api/user/login', data)
        .then(response => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('admin', response.data.admin);
          console.log(response);
          tag.$router.push('Home')
        })
        .catch(error => {
          if(error.response.status === 403) {
            this.invalid.login = true
          }
        })
      }
    }, 
    signup: function() {
      this.pseudo = document.querySelector('#pseudo__signup').value
      this.email = document.querySelector('#email__signup').value
      this.password = document.querySelector('#password__signup').value
      if (this.validationSignup()) {
        const tag = this;
        const signup = {
          pseudo: this.pseudo,
          email: this.email,
          password: this.password,
        }
        const login = {
          email: tag.email,
          password: tag.password,
        }
        axios.post('http://localhost:3000/api/user/signup', signup)
          .then(response => {
            console.log(response)
            axios.post('http://localhost:3000/api/user/login', login)
              .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('admin', response.data.admin);
                tag.$router.push('Home');
                console.log(response);
                return;
              })
              .catch(error => {
                console.log(error)
                 if(error.response.status === 403) {
                  this.invalid.login = true
                 }
              })
          .catch( function(error) {
            if(error.response.status === 403) {
              this.invalid.signup = true
            }
          })
        })
      }
    }, 
  },  
}
</script>

<style lang="scss" scoped>

main {
  display: flex;
  justify-content: center;
}

.form {
  display:flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 200px;
  margin-bottom: 200px;
  border-radius: 20px;
  box-shadow: 5px 5px 5px 5px #D3D3D3;
  height: auto;
  background-color: #eaeaea;
  padding:20px;
}

.subtitle__signup {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50px;
}

.subtitle__login {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50px;
}

.form__auth {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
}

.form__signup {
  display:flex;
  flex-direction: column;
  height: 65px;
  width: 100%;
}

.form__login {
  display:flex;
  flex-direction: column;
  height: 65px;
  width: 100%;
}

input {
  background-color: #312F2F;
  color: white;
  height: 40px;
  text-align: center;
  border: none;
  border-radius: 10px;
}

.crtl {
  display: flex;
  justify-content: center;;
  color: rgb(185, 9, 9);
  padding:0;
  margin:0;
}

.switch__mode {
  margin-top: 15px;
  margin-bottom: 10px;
  background-color: white;
  padding:5px;
  border-radius: 10px;
  cursor: pointer;
}

.validLogin {
  margin-top: 5px;
  background-color: #312F2F;
  color: white;
  border: none;
  border-radius: 15px;
  height: 30px;
}

.validSignup {
  margin-top: 5px;
  background-color: #312F2F;
  color: white;
  border: none;
  border-radius: 15px;
  height: 30px;
}

.account__error {
  font-weight: 600;
  color: rgb(204, 56, 56);
}

button:disabled {
  background-color: #D3D3D3;
  color: black;
}

</style>