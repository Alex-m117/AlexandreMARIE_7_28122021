<template>
<section>

  <div class="user" >
    <div class="user__header">
      <div class="user__return">
        <router-link :to="('/home')">
          <fa icon="arrow-circle-left" class="icon__return"/>
        </router-link>
        <button v-if=" userId == userId_crtl || admin == true" class="delete__user" @click="deleteUser()">
          <fa icon="user-slash"/> Supprimer le compte
        </button>
      </div>
      <div class="user__title">
        <div class="user__name"> {{ this.userParams[0].pseudo }} </div> 
          <form v-if=" userId == userId_crtl || admin == true" @submit.prevent="Modifier" class="modify__name">
            <input
              v-model="pseudo"
              type="text"
              id="modify__pseudo"
              placeholder="Votre nouveau pseudonyme"
            />
            <button class="modify__pseudo" @click="modifyPseudo()" > Modifier </button>
          </form>
        </div>
      </div>
      <div class="user__profil">
        <div class="photo__block">
          <div class="user__photo">
          <img class="user__pic" v-bind:src="this.userParams[0].photo">
            <form v-if=" userId == userId_crtl || admin == true" @submit.prevent="Modifier" class="modify__pic">
              <input
                @change="onChange"
                type="file"
                name="image"
                id="modify__photo"
                />
              <button class="modify__photo" @click="modifyPic()" > Modifier </button>
            </form>
          </div>
        </div>
        <div class="user__info">
      
          <h2 class="user__email"> E-mail </h2>
          <p class="email"> {{ this.userParams[0].email }} </p>

          <h2 class="user__biography"> Biographie </h2>
          <p class="bio"> {{ this.userParams[0].biography }} </p>

          <form v-if=" userId == userId_crtl || admin == true" @submit.prevent="Modifier" class="modify__bio">
            <input
              v-model="biography"
              type="text"
              id="modify__bio"
              placeholder="Votre nouvelle biographie"
            />
            <button class="modify__biography" @click="modifyBio()" > Modifier </button>
          </form>
        </div>
    </div>
  </div>
  <div class="user__footer"></div>
 
</section>
</template>

<script>
import axios from "axios";

export default {
  name : 'User',

  data: function() {
    return {
      user: null,
      userId: this.$route.params.userId,
      userParams: [0],
      userId_crtl: localStorage.getItem("userId"),
      admin: localStorage.getItem("admin"),
      pseudo: '',
      biography: '',
    }
  },

  methods: {
    onChange(event) {
      this.image = event.target.files[0];
    },
    getUser() {
      const tag = this;
      const token = localStorage.getItem("token");
      const userId = this.$route.params.userId;

      axios.get(`http://localhost:3000/api/user/account/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        this.data = response.data.result;
        this.userParams = (JSON.parse(JSON.stringify(this.data)));
      })
      .catch(error => {
        if(error.response && error.response.status === 401) {
          console.log(error)
          tag.$router.push('/');
        }
      })
    },
    modifyPseudo: function() {
      const tag = this;
      const token = localStorage.getItem("token");
      const userId = this.$route.params.userId;
      this.pseudo = document.getElementById('modify__pseudo').value;
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");
      const data = new FormData();

      if (this.pseudo !="") {
        data.append("pseudo", this.pseudo);
      }
      if (userId == user || admin == true) {
        if (this.pseudo) {
          axios.put(`http://localhost:3000/api/user/account/${userId}`, data, {
            headers: {
              'Accept': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log(response)
            document.getElementById('modify__pseudo').value = null;
            tag.$router.go();
          })
          .catch(error => {
            if(error.response && error.response.status === 401) {
              console.log(error)
              tag.$router.push('/');
            }
          })
        }
      }
    },
    modifyPic: function() {
      const tag = this;
      const token = localStorage.getItem("token");
      const userId = this.$route.params.userId;
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");

      const data = new FormData();

      if (this.image !="") {
        data.append("image", this.image);
      }
      if (userId == user || admin == true) {
        if (this.image) {
          axios.put(`http://localhost:3000/api/user/account/${userId}`, data, {
            headers: {
              'Content-Type': "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log(response)
            tag.$router.go();
          })
          .catch(error => {
            if(error.response && error.response.status === 401) {
              console.log(error)
              tag.$router.push('/');
            }
          })
        }  
      }
    },
    modifyBio: function() {
      const tag = this;
      const token = localStorage.getItem("token");
      const userId = this.$route.params.userId;
      this.biography = document.getElementById('modify__bio').value;
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");
      const data = new FormData();

      if (this.biography !="") {
        data.append("biography", this.biography);
      }
      if (userId == user || admin == true) {
        if (this.biography) {
          axios.put(`http://localhost:3000/api/user/account/${userId}`, data, {
            headers: {
              'Accept': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log(response)
            document.getElementById('modify__bio').value = null;
            tag.$router.go();
          })
          .catch(error => {
            if(error.response && error.response.status === 401) {
              console.log(error)
              tag.$router.push('/');
            }
          })
        }
      }
    },
    deleteUser: function() {
      const tag = this;
      const token = localStorage.getItem("token");
      const userId = this.$route.params.userId;
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");
      

      if (userId == user || admin == true) {
        if (confirm("Confirmez-vous la suppression de votre compte, cette action est irréversible!"))
          axios.delete(`http://localhost:3000/api/user/account/${userId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log(response)
            localStorage.removeItem('user')
            localStorage.removeItem('admin')
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            tag.$router.push('/')
          })
          .catch(error => {
            if(error.response && error.response.status === 401) {
              console.log(error)
            }
          })
        }
      }
    },
  mounted() {
    this.getUser()
  }
}
</script>

<style scoped lang="scss">

section {
  display:flex;
  justify-content: center;;
  width: 100%;
}

.user {
  display: flex;
  flex-direction: column;
  box-shadow: #D3D3D3 0px 2px 4px 0px, #D3D3D3 0px 2px 16px 0px;
  border-radius: 25px;
  margin-top: 80px;
  margin-bottom: 100px;
  width: 80%;
}

.user__header {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
}

.user__return {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 30px;
}

.delete__user {
  margin-right: 30px;
  border: none;
  background-color: #D2F1E4;
  border: 2px solid #eaeaea;
  color: #312F2F;
  font-weight: 600;
  padding: 10px;
  border-radius: 20px;
}

.icon__return {
  font-size: 30px;
  margin-left: 30px;
  color: #312F2F;
}

.user__title {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 30px;
  height: 90px;
}

.modify__name {
  display: flex;
  border-radius: 10px;
  border: 2px solid #eaeaea;
  flex-direction: row;
  width: 40%;
}

.modify__pseudo {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
  border: none;
  font-weight: 600;
  color: #312F2F;
  background-color: #D2F1E4;
  width: 30%;
  height: 30px; 
}

#modify__pseudo {
  width: 70%;
  margin-left: 10px;
  border: none;
}

.user__profil {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

.user__name {
  font-size: 30px;
}

.photo__block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin-bottom: 50px;
}
.user__info {
  width: 40%;
}

.user__email {
  margin-left: 5px;
}

.email {
  margin-left: 5px;
}

.bio {
  margin-left: 5px;
}

.user__biography {
  margin-left: 5px;
}

.user__photo {
  display: flex;
  flex-direction: column;
  width: 80%;
  box-shadow: 3px 3px 3px 3px #D3D3D3;
  object-fit: cover;
  align-items: center;
  border-radius: 15px;
}

.modify__photo {
  width: 50%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #eaeaea;
  font-weight: 600;
  color: #312F2F;
  background-color: #D2F1E4;
  width: 30%;
  height: 30px; 
}

#modify__photo {
  font-weight: 600;
  color: #312F2F;
}

.user__pic {
  width: 100%;
  border: 2px solid green;
  border-radius: 15px;
  height: 300px;
}

.modify__pic {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.bio {
  text-overflow: ellipsis;
  width: 90%;
  height: auto;
}

#modify__bio {
  width: 70%;
  margin-left: 10px;
  border: none;
}

.modify__biography {
  width: 30%;
  border: none;
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
  background-color: #D2F1E4;
  color: #312F2F;
  font-weight: 600;
}

.modify__bio {
  display: flex;
  border-radius: 10px;
  border: 2px solid #eaeaea;
  width: 90%;
  height: 30px;
}

.user__footer {
  margin-top: 30px;
}

// Média Queries

@media (min-width: 280px) and (max-width: 400px) {

.user {
  width: 95%;
}

.user__profil {
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 70px;
}

.icon__return {
  margin-left: 0px;
}

.delete__user {
  margin-right: 0px;
}

.user__return {
  justify-content: space-around;
}

#modify__pseudo {
  font-size: 70%;
}

#modify__photo {
  width: 90%;
}

.modify__name {
  width: 95%;
}

.photo__block {
  width: 100%;
}

.user__photo {
  width: 95%;
}

.user__info {
  width: 95%;
}

.modify__bio {
  width: 100%;
}

};

@media (min-width: 400px) and (max-width: 660px) {

.user {
  width: 80%;
}

.user__profil {
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 70px;
}

.modify__name {
  width: 85%;
}

.photo__block {
  width: 100%;
}

.user__photo {
  width: 85%;
}

.user__info {
  width: 85%;
}

.modify__bio {
  width: 100%;
}

};

@media (min-width: 660px) and (max-width: 850px) {

.user {
  width: 70%;
}

.user__profil {
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 70px;
}

.modify__name {
  width: 60%;
}

.photo__block {
  width: 100%;
}

.user__photo {
  width: 60%;
}

.user__info {
  width: 60%;
}

.modify__bio {
  width: 100%;
}

};

@media (min-width: 900px) {

.user {
  width: 80%;
}

};

@media (min-width: 1200px) {

.user {
  width: 60%;
}

};

@media (min-width: 1500px) {

.user {
  width: 50%;
}

};

</style>