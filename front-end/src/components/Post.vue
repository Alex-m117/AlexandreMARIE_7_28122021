<template>
<section>

  <navbar>
    <div class="home__control">
      <fa icon="user"/> 
      <fa icon="sign-out-alt"/>
    </div>
  </navbar>

  <div class="create__post"> 
    <form class="new__post" @submit.prevent="Publier">
      <div class="form__post"> 
        <input 
          type="text"
          name="message"
          id="text__create"
          placeholder="  Quoi de neuf ?"
        />
      </div>
      <div class="form__file"> 
        <input class="file"
          @change="onChange"
          ref="file"
          type="file"
          name="image"
          id="file__create"
          accept="image/png, image/jpeg"
        />
      </div> 
      <div class="form__valid"> 
        <button :disabled= "!valideCreate" class="valid__create" @click="createPost()"> Publier </button>
      </div>
    </form> 
  </div>

  <div class="post" v-for="post in posts" v-bind:key="post.id_post">
    <div class="profil__post">
      <div class="profil__info">
      <img class="profil__pic" v-bind:src="post.photo">
        <div class="profil__author">
          <span class="profil__pseudo"> {{ post.pseudo }} </span>
          <span class="profil__date"> {{ formatDate(post.date_message) }} </span>
        </div>
        <div class="post__moderate">
          <fa  class="modify__post" icon="edit"/>
          <fa  class="delete__post" icon="trash"/> 
        </div>
      </div> 
      <div v-if="post.message != '' " class="display__text">
        <span class="post__message"> {{ post.message }} </span>
      </div>
      <div v-if="post.image" class="display__image">
        <span class="post__image"> <img v-bind:src="post.image" class="image"> </span>
      </div>

      <div class="post__comment"> 
        <div class="comment__status">
          <fa icon="comments" @click="displayComments" /> 
        </div>
      </div>
      <div class="comments" v-for="comment in comments" v-bind:key="comment.postId" > 

        <div v-if="comment.postId == post.id_post" class="co"> {{ comment }} </div>
      </div>


    </div>
  </div>
  


</section>
</template>

<script>
import axios from "axios";

export default {
  name : 'Post',
  data: function() {
    return {
      posts: [],
        id: null,
        formData: {
          message: null,
          image: null
        }

    }
  },
  computed:{
    valideCreate: function() {
      if (this.text !="") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
  formatDate: function(createdDate){
    const dateISO = new Date(createdDate)
    const format = { year: 'numeric', month: 'long', day: 'numeric'};
    let date = dateISO.toLocaleDateString('fr-FR', format);
      if(createdDate){
        return `Posté le ${date}`;
      }
  },
  onChange(event) {
    this.image = event.target.files[0];
  },
  createPost: function() {
    const token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    this.message = document.querySelector('#text__create').value;
    
    const data = new FormData();

    data.append("userId", this.userId);
    if (this.message !="") {
      data.append("messsage", this.message);
    }
    if (this.image !="") {
      data.append("image", this.image,);
    }
    if (this.message || this.image) {
      axios.post('http://localhost:3000/api/post/add/', data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response);
        document.querySelector('#text__create').value = null;
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  getPosts: function() {
    const token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");

    const tag = this;
    axios.get('http://localhost:3000/api/post/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      this.data = response.data.result;
      this.posts = (JSON.parse(JSON.stringify(this.data)));
    })
    .catch(error => {
      if(error.response && error.response.status === 401) {
        tag.$router.push('/');
      }
    })
  },
  getComment: function() {
    const token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    const postId = this.$route.params.id_post;

    const tag = this;
    axios.get(`http://localhost:3000/api/post/${postId}/comments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      this.data = response.data.result;
      this.comments = (JSON.parse(JSON.stringify(this.data))); 
    })
    .catch(error => {
      if(error.response && error.response.status === 401) {
        tag.$router.push('/');
      }
    })
  






  }










 
  },
  mounted() {
    this.getPosts()
    this.getComment()
  },
}
</script>

<style lang="scss" scoped >

section {
  width: 100%;
}

.home__control {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 90%;
}

.fa-user {
  font-size: 30px;
  margin-right: 5%;
}

.fa-sign-out-alt {
  font-size: 30px;
}

// créer un post

.create__post {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;;
  margin-bottom: 40px;
}

.new__post {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 170px;
  width: 80%;
  align-items: center;
  border-radius: 25px;
  box-shadow: 3px 3px 3px 3px #D3D3D3;
}

.form__post {
  display:flex;
  width: 100%;
  justify-content: center;
}

#text__create {
  display: flex;
  width: 85%;
  border: 2px solid #d3d3d3;
  border-radius: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 15px;
}

.placeholder {
  margin-left: 50px;
}

.form__file {
  display: flex;
  width: 85%;
  flex-direction: column;
}

.file {
  text-overflow: hidden;
  font-weight: 600;
}

.form__valid {
  display: flex;
  width: 100%;
  justify-content: center;
  
}

.valid__create {
   border-style: none;
   width: 40%;
   height: 30px;
   font-weight: 600;
   background-color: #d3d3d3;
   border-radius: 15px;
   margin-bottom: 15px;
   cursor: pointer;
}










.post {
  display:flex;
  justify-content: center;
  margin-bottom: 20px;
 
}

.profil__post{
  display: flex;
  flex-direction: column;
  width: 80%;
  border:2px solid black;
}

.profil__info {
  display: flex;
  flex-direction: row;
  margin: 5px;
  border: 2px solid yellow;
}

.profil__pic {
  object-fit: cover;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
  border: 1px solid red;
}

.profil__author {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90%;
}

.post__moderate {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.display__text {
  display:flex;
  width: 100%;
  border: 2px solid green;
}

.post__message {
  display: flex;
  width: 95%;
  margin: 20px;
}

.display__image {
  object-fit: cover;
  width: 100%;
  height: 300px;;
  border: 2px solid red;
}







</style>