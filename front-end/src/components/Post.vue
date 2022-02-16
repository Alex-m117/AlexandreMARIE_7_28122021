<template>

<section>

  <div class="navbar">
    <div class="home__control">
      <router-link :to="{ name: 'User', params: { userId : userId } } ">
        <img class="profil__home" v-bind:src="user.photo" crossorigin>
      </router-link>
      <fa icon="sign-out-alt" @click="logOut()" />
    </div>
  </div>

  <div class="create__post"> 
    <form class="new__post" @submit.prevent="Publier">
      <div class="form__post"> 
        <input
          v-model="message"
          maxlength="500"
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
          accept="image/png, image/jpeg, image/gif"
        />
      </div> 
      <div class="form__valid"> 
        <button :disabled="!validePost" class="valid__post" @click="createPost()"> Publier </button>
      </div>
    </form> 
  </div>

  <div v-if="displayPost">
    <div class="post" v-for="post in posts" v-bind:key="post.id_post">
      <div class="profil__post">
        <div class="profil__info">
        <router-link :to="{ name: 'User', params: { userId : post.userId } } ">
          <img class="profil__pic" v-bind:src="post.photo" crossorigin>
        </router-link>
          <div class="profil__author">
            <span class="profil__pseudo"> {{ post.pseudo }} </span>
            <span class="profil__date"> {{ formatDate(post.date_message) }} </span>
          </div>
          <div class="post__moderate">
            <router-link :to="{ params: { id : post.id_post } } ">
              <fa v-if="post.userId == userId || admin == true" class="modify__post" icon="edit" @click="modify_view()" />
            </router-link>
              <fa v-if="post.userId == userId || admin == true" class="delete__post" icon="trash" @click="deletePost(post.id_post, post.userId)"/>
          </div>
        </div> 
        <div v-if="post.message !='' " class="display__text">
          <span class="post__message"> {{ post.message }} </span>
        </div>
        <div v-if="post.image" class="display__image">
          <span class="post__image"> <img v-bind:src="post.image" class="image" crossorigin> </span>
        </div>
        <div class="post__comment"> 
          <div class="comment__status">
            <span class="comments__link"> 
              <fa icon="comments" />  Commentaires 
            </span> 
          </div>
        </div>
        <form class="new__comment" @submit.prevent="Publier">
          <router-link class="comment__submit" :to="{ params: { id : post.id_post } } ">    
            <input
              @change="add"
              type="text"
              name="comment"
              maxlength="300"
              id="comment__create"
              placeholder="Ajouter un commentaire"
              required
            />
          </router-link>
          <button class="valid__comment" @click="createComment()"> Publier </button>
        </form>
        <div class="comments" v-for="comment in comments" v-bind:key="comment.postId" > 
          <div v-if="comment.postId == post.id_post" class="comment_id"> 
            <div class="commentaire">
            <router-link :to="{ name: 'User', params: { userId : comment.userId } } ">
              <img class="comment__photo" v-bind:src="comment.photo" crossorigin>
            </router-link>
              <div class="comment__block">
                <div class="comment__info">
                  <div class="comment__pseudo"> {{ comment.pseudo }} 
                    <span class="comment__date"> {{ formatDate(comment.date_comment) }} </span>
                  </div>
                  <div class="comment__moderate">
                      <fa v-if="comment.userId == userId || admin == true" class="delete__post" icon="trash" @click="deleteComment(comment.id_comment, comment.userId)"/> 
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
  </div>

  <div v-else class="no__posts"> Aucun post pour le moment. </div>
  <div class="post__footer"></div>

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
        comment: null,
      },
      visible: false,
      displayPost: null,
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
        axios.post('http://localhost:8080/api/post/add/', data, {
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
      axios.get('http://localhost:8080/api/post/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        this.data = response.data.result;
        this.posts = (JSON.parse(JSON.stringify(this.data)));
        this.displayPost = this.posts[0];
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

      if (this.userId == userId || admin == true)
      axios.delete (`http://localhost:8080/api/post/${id_post}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response, "post supprimé")
        this.getComment();
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

      axios.get(`http://localhost:8080/api/post/${postId}/comments/`, {
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
    add: function(event) {
      this.comment = event.target.value;
    },
    createComment: function() {
      const token = localStorage.getItem("token");
      this.userId = localStorage.getItem("userId");
      const postId = this.$route.params.id;
      
      const data = new FormData();

      data.append("userId", this.userId);
      if (this.comment !="") {
        data.append("comment", this.comment);
      }
      if (this.comment) {
        axios.post(`http://localhost:8080/api/post/${postId}/comments/`, data, {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          console.log(response)
          this.$router.go();
          this.getComment();
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    deleteComment: function(id_comment, userId) {
      const token = localStorage.getItem("token");
      this.userId = localStorage.getItem("userId");
      const admin = localStorage.getItem("admin");

      if (this.userId == userId || admin == true)
      axios.delete (`http://localhost:8080/api/post/comments/${id_comment}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log(response, "post supprimé")
        this.getComment();
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

    axios.get(`http://localhost:8080/api/user/account/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      this.data = response.data.result[0];
      this.user = (JSON.parse(JSON.stringify(this.data)));
      localStorage.setItem('user', this.user.id); 
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

.profil__home {
  cursor: pointer;
  &:hover{
    transform: scale(1.1);
	};
}

.fa-sign-out-alt {
  margin-left: 25px;
  font-size: 30px;
  cursor: pointer;
  &:hover{
    transform: scale(1.1);
	};
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
  box-shadow: #D3D3D3 0px 2px 4px 0px, #D3D3D3 0px 2px 16px 0px;
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
  &:hover {
    border: 2px solid #5c5c5cb9;
    box-shadow: #D2F1E4 0px 2px 4px 0px, #D2F1E4 0px 2px 16px 0px;
	}
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
  font-weight: 600;
}

#file__create {
    cursor: pointer;
}

.form__valid {
  display: flex;
  width: 100%;
  justify-content: center;
}

.valid__post {
   border-style: none;
   width: 90px;
   height: 30px;
   font-weight: 600;
   color: #312F2F;
   border: 2px solid #D3D3D3;
   background-color:#D2F1E4;
   border-radius: 15px;
   margin-bottom: 15px;
   cursor: pointer;
    &:hover {
      box-shadow: 1px 1px 1px 1px #D3D3D3;
      opacity: 0.9;
    }
}

button:disabled {
  background-color: #D3D3D3;
  color: black;
}

.no__posts {
  display: flex;
  margin-top:100px;
  margin-bottom: 120px;
  justify-content: center;
  width: 100%;
}

.post {
  display:flex;
  justify-content: center;
  margin-bottom: 40px;
}

.profil__post{
  display: flex;
  flex-direction: column;
  width: 80%;
  border-radius: 20px;
  box-shadow: #D3D3D3 0px 2px 4px 0px, #D3D3D3 0px 2px 16px 0px;
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
  &:hover{
    box-shadow: 1px 1px 1px 1px #D3D3D3;
    transform: scale(1.04);
	};
}

.profil__author {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90%;
}

.profil__pseudo {
  font-weight: 500;
}

.profil__date {
  font-style: italic;
  color:#a1a1a1;
}

.post__moderate {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.fa-edit {
  font-size: 14px;
  color: #312F2F;
  cursor: pointer;
  &:hover {
    color: #345BE2;
    transform: scale(1.5);
	}; 
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
}

.post__image {
  width: 100%;
  height: 500px;
}

.image {
  width: 100%;
  height: 100% ;
}

.post__footer {
  margin-top: 100px;
}

//Commentaires

.comment_id {
  display: flex;
}

.comment__status {
  margin: 10px 10px 0px 10px;
  font-weight: 300;
  font-style: italic;
  font-size: 16px;
  color: #a1a1a1;
}

.new__comment {
  display:flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 30px;
}

.comment__submit {
  width: 70%;
}

#comment__create {
  width: 90%;
  border: 2px solid #d3d3d3;
  background-color: #f1f1f1fd;
  border-radius: 20px;
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    border: 2px solid #5c5c5cb9;
    box-shadow: #D2F1E4 0px 2px 4px 0px, #D2F1E4 0px 2px 16px 0px;
	}
}

.valid__comment {
  margin-top: 10px;
  border-style: none;
  text-decoration: none;
  font-weight: 600;
  color: #312F2F;
  background-color: #D2F1E4;
  border: 2px solid #d3d3d3 ;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 1px 1px #D3D3D3;
    opacity: 0.9;
  }
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
  border-radius: 25px;
  width: auto;
  background-color: #f2f2f2;
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
};

.comment__pseudo {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}

.comment__date {
  margin-top: 5px;
  font-weight: 400;
  font-style: italic;
  font-size: 13px;
}

.fa-trash {
  font-size: 14px;
  color: #312F2F;
  cursor: pointer;
  &:hover {
    color: #345BE2;
    transform: scale(1.5);
	}; 
}

.comment__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  height: 60px;
  width: 100%;
}

.comment__photo {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-top: 5px;
  object-fit: cover;
  &:hover{
    box-shadow: 1px 1px 1px 1px #D3D3D3;
    transform: scale(1.04);
	};
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
  margin-top: 6px;
  margin-left: 10px;
  margin-right: 10px;
  width: 95%;
  font-size: 15px;
}

// média queries

@media (min-width: 280px) and (max-width: 550px) {

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
  height: 300px;
}

#comment__create {
  width: 80%;
}

#text__create {
  width: 80%;
}

.comment__date {
  font-size: 11px;
}

.comment__moderate {
  width: 45px;
}

};

@media (min-width: 550px) and (max-width: 700px) {

.profil__post{
  width: 80%;
}

.new__post {
  width: 80%;
}

.home__control {
  width: 90%;
}

.display__image {
  height: 400px;
}

};

@media (min-width: 700px)and (max-width: 800px) {

.profil__post{
  width: 70%;
}

.new__post {
  width: 70%;
}

.home__control {
  width: 85%;
}

.display__image {
  height: 450px;
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

.display__image {
  height: 500px;
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