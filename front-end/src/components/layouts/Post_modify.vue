<template>
  
  <div class="modify__post" v-if="visible">
    <div class="overlay">
        <form class="post" @submit.prevent="Modifier">
            <div class="modify_-header">
                <h1> Modifier la publication </h1>
                <div class="close" @click="modify_view()"> X </div>
            </div>
            <div class="form__modify__post"> 
                <input
                    v-model="modify"
                    type="text"
                    name="modify"
                    id="text__modify"
                    placeholder="  Quoi de neuf ?"
                    />
            </div>
            <div class="modify__file"> 
                <input class="file"
                    @change="onChange"
                    ref="file"
                    type="file"
                    name="image"
                    id="file__modify"
                    accept="image/png, image/jpeg"
                    />
            </div> 
            <div class="form__valid__modify"> 
                <button :disabled="!valideModify" class="valid__modify" @click="modifyPost()"> Modifier </button>
            </div>
        </form> 
    </div>
  </div>

</template>

<script>
import axios from "axios";


export default {
    name: 'Post_modify',
    props: ['visible', 'modify_view'],

    computed: {      
        valideModify: function() {
            if (this.modify !="") {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        modifyPost: function() {
            const token = localStorage.getItem("token");
            this.message = document.getElementById('text__modify').value;
             const postId = this.$route.params.id;
            const data = new FormData();

            if (this.message !="") {
                data.append("message", this.message);
            }
            if (this.image !="") {
                data.append("image", this.image,);
            }
            if (this.message || this.image) {
                axios.put(`http://localhost:3000/api/post/${postId}`, data, {
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
        onChange(event) {
            this.image = event.target.files[0];
        },







    },
};







</script>

<style scoped lang="scss">

.modify__post {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.post {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f1f1f1;
    width: 42%;
    height: 200px;
    border-radius: 20px;
    top:100px;

}

.modify_-header {
    display: flex;
    width: 100%;
}

h1 {
    display: flex;
    width: 95%;
    justify-content: center;
}

.close {
    width: 20px;
    height: 20px;
}




</style>