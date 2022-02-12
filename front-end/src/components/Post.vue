<template>

<section>

  <div class="navbar">
    <div class="home__control">
      <router-link :to="{ name: 'User', params: { userId : userId } } ">
        <img class="profil__home" v-bind:src="user.photo">
      </router-link>
      <fa icon="sign-out-alt" @click="logOut()" />
    </div>
  </div>

  <div class="create__post"> 
    <form class="new__post" @submit.prevent="Publier">
      <div class="form__post"> 
        <input
          v-model="message"
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
        <button :disabled="!validePost" class="valid__post" @click="createPost()"> Publier </button>
      </div>
    </form> 
  </div>

  <div class="post" v-for="post in posts" v-bind:key="post.id_post">

    <div class="profil__post">
      <div class="profil__info">
      <router-link :to="{ name: 'User', params: { userId : post.userId } } ">
        <img class="profil__pic" v-bind:src="post.photo">
      </router-link>
        <div class="profil__author">
          <span class="profil__pseudo"> {{ post.pseudo }} </span>
          <span class="profil__date"> {{ formatDate(post.date_message) }} </span>
        </div>
        <div class="post__moderate">
          <router-link :to="{ params: { id : post.id_post } } ">
            <fa v-if="post.userId == userId || admin == true" class="modify__post" icon="edit" @click="modify_view()" />
          </router-link>
          <!-- <router-link :to="{ params: { id : post.id_post } } "> -->
            <fa v-if="post.userId == userId || admin == true" class="delete__post" icon="trash" @click="deletePost(post.id_post, post.userId)"/>
          <!-- </router-link> -->
        </div>
      </div> 
      <div v-if="post.message !='' " class="display__text">
        <span class="post__message"> {{ post.message }} </span>
      </div>
      <div v-if="post.image" class="display__image">
        <span class="post__image"> <img v-bind:src="post.image" class="image"> </span>
      </div>
      <div class="post__comment"> 
        <div class="comment__status">
          <fa icon="comments" /> Commentaires
        </div>
      </div>
      <router-link :to="{ params: { id : post.id_post } } ">
        <form class="new__comment" @submit.prevent="Publier" @click="createComment()">
          <input
            type="text"
            name="comment"
            id="comment__create"
            placeholder="Ajouter un commentaire"
            required
          />
          <button class="valid__comment"> Publier </button>
        </form>
      </router-link>

      <div class="comments" v-for="comment in comments" v-bind:key="comment.postId" > 
        <div v-if="comment.postId == post.id_post" class="comment_id"> 
          <div class="commentaire">
          <router-link :to="{ name: 'User', params: { userId : comment.userId } } ">
            <img class="comment__photo" v-bind:src="comment.photo">
          </router-link>
            <div class="comment__block">
              <div class="comment__info">
                <span class="comment__pseudo"> {{ comment.pseudo }} </span>
                <div class="comment__moderate">
                    <fa v-if="comment.userId == userId || admin == true" class="delete__post" icon="trash" @click="deleteComment()"/> 
                </div>
              </div>
              <div class="comment__post">
                <p class="comment__comment"> {{ comment.comment }} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<modify v-bind:visible="visible" v-bind:modify_view="modify_view"></modify>

</section>

</template>

<script>
import Post_modify from "./layouts/Post_modify.vue"
import axios from "axios";

export default {
  name : 'Post',
  components: {
    'modify' : Post_modify
  },
  data: function() {
    return {
      posts: [],
      user: [],
      comments: [],
      id: null,
      admin: localStorage.getItem("admin"),
      userId: localStorage.getItem("userId"),
      message:'',
      text:'',
      formData: {
        message: null,
        image: null,
      },
      visible: false,
    }
  },
  computed:{
    validePost: function() {
      if (this.message !="") {
        return true;
      } else {
        return false;
      }
    },
    valideComment: function() {
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
      this.message = document.getElementById('text__create').value;
    
      const data = new FormData();

      data.append("userId", this.userId);
      if (this.message !="") {
        data.append("message", this.message);
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
          this.$router.go();
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
    deletePost: function(id_post, userId) {
      const token = localStorage.getItem("token");
      this.userId = localStorage.getItem("userId");
      const admin = localStorage.getItem("admin");

      if (this.userId === userId || admin == true)
      axios.delete (`http://localhost:3000/api/post/${id_post}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response, "post supprimé")
        this.$router.go();
      })
      .catch(error => {
        console.log(error)
      })
    },
    getComment: function() {
      const token = localStorage.getItem("token");
      this.userId = localStorage.getItem("userId");
      const postId = this.$route.params.id;
      const tag = this;

      axios.get(`http://localhost:3000/api/post/${postId}/comments/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        this.data = response.data.result;
        this.comments = (JSON.parse(JSON.stringify(this.data)));
        this.getPosts()
      })
      .catch(error => {
        if(error.response && error.response.status === 401) {
          tag.$router.push('/');
        }
      })
    },
    createComment: function() {
      const token = localStorage.getItem("token");
      const postId = parseInt(this.$route.params.id);
      this.comment = document.getElementById('comment__create').value;
      const data = new FormData();

      if (this.comment !="") {
        data.append("comment", this.comment);
      }
      if (this.comment) {
        axios.post(`http://localhost:3000/api/post/${postId}/comments/`, data, {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log(response)
          document.getElementById('comment__create').value = "";
          //this.$router.go();
          this.getComment();
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    deleteComment: function() {
      const token = localStorage.getItem("token");
      this.userId = localStorage.getItem("userId");
      const user = localStorage.getItem("user");
      const admin = localStorage.getItem("admin");
      const commentId = this.$route.params.id;

      if (this.userId === user || admin == true)
      axios.delete (`http://localhost:3000/api/post/comments/${commentId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response, "post supprimé")
        this.$router.go();
      })
      .catch(error => {
        console.log(error)
      })
    },

    logOut: function() {
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      this.$router.push('/')
    },
    modify_view: function() {
      this.visible = !this.visible
    }
  },
  mounted() {
    const token = localStorage.getItem("token");
    this.userId = localStorage.getItem("userId");
    const userId = this.userId;
    const tag = this;

    axios.get(`http://localhost:3000/api/user/account/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      this.data = response.data.result[0];
      const user = (JSON.parse(JSON.stringify(this.data)));
      localStorage.setItem('user', user.id);
    })
    .catch(error => {
      if(error.response && error.response.status === 404) {
        console.log(error)
        tag.$router.push('/');
      }
    })
    this.getPosts()
    this.getComment()
  },
}
</script>

<style lang="scss" scoped>

section {
  width: 100%;
}

.profil__home {
  display: flex;
  object-fit: cover;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 1px solid red;
}

.home__control {
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  width: 90%;
}

.fa-user {
  font-size: 30px;
}

.fa-sign-out-alt {
  margin-left: 25px;
  font-size: 30px;
}

.invisible {
  display: none;
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

.valid__post {
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
  margin-bottom: 30px;
}

.profil__post{
  display: flex;
  flex-direction: column;
  width: 80%;
  border-radius: 20px;
  box-shadow: 3px 3px 3px 3px #D3D3D3;
}

.profil__info {
  display: flex;
  flex-direction: row;
  margin: 10px;
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
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.post__message {
  display: flex;
  width: 95%;
  margin: 20px;
}

.display__image {
  object-fit: cover;
  width: 100%;
  height: 500px;;
  border: 2px solid red;
}

//Commentaires

.comment_id {
  display: flex;
}

.comment__status {
  margin: 10px;
}

.new__comment {
  display:flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 30px;
}

#comment__create {
  width: 70%;
  border: 2px solid #d3d3d3;
  border-radius: 20px;
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
}

.valid__comment {
  margin-top: 10px;
  border-style: none;
  text-decoration: none;
  font-weight: 600;
  background-color: #d3d3d3;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
}

.commentaire {
  display:flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
  border-radius: 25px;
  min-width: 40%;
}

.comment__block {
  display: flex;
  flex-direction: column;
  min-width: 40%;
  border-radius: 25px;
  width: auto;
  background-color: #D2F0E4;
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.comment__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  height: 55px;
  width: 100%;
}

.comment__photo {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 1px solid red;
  object-fit: cover;
  margin-top: 5px;
}

.comment__moderate {
  display:flex;
  flex-direction: row;
  width: 50px;
  justify-content: space-around;
}

.comment__comment {
  display: flex;
  align-items: center;
  margin-top: auto;
  margin-left: 10px;
  margin-right: 10px;
  width: 95%;
}

// média queries

@media (min-width: 280px) {

.profil__post{
  width: 95%;
}

.new__post {
  width: 95%;
}

.home__control {
  width: 95%;
}

.display__image {
  height: 350px;
}

};

@media (min-width: 550px) {

.profil__post{
  width: 80%;
}

.new__post {
  width: 80%;
}

.home__control {
  width: 90%;
}

};

@media (min-width: 700px) {

.profil__post{
  width: 70%;
}

.new__post {
  width: 70%;
}

.home__control {
  width: 85%;
}

};

@media (min-width: 800px) {

.profil__post{
  width: 60%;
}

.new__post {
  width: 60%;
}

.home__control {
  width: 80%;
}

};

@media (min-width: 900px) {

.profil__post{
  width: 50%;
}

.new__post {
  width: 50%;
}

.home__control {
  width: 75%;
}

};

@media (min-width: 1600px) {

.profil__post{
  width: 40%;
}

.new__post {
  width: 40%;
}

.home__control {
  width: 70%;
}

};

</style>