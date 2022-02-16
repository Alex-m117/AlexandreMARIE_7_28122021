<template>
  
    <div class="modify__post" v-if="visible">
        <div class="overlay">
            <form class="post" @submit.prevent="Modifier">
                <div class="modify_-header">
                    <h1> Modifier la publication </h1>
                    <div class="close">
                        <div class="button__close" @click="modify_view()"> X </div>
                    </div>
                </div>
                <div class="form__modify__post"> 
                    <input
                        v-model="modify"
                        type="text"
                        name="modify"
                        id="text__modify"
                        placeholder="Votre nouveau post"
                    />
                </div>
                <div class="modify__file"> 
                    <input class="file"
                        @change="onChange"
                        ref="file"
                        type="file"
                        name="image"
                        id="file__modify"
                        accept="image/png, image/jpeg, image/gif"
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

    data: function() {
        return {
            modify:'',
        }
    },
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
    border-radius: 20px;
    top:100px;
}

.modify_-header {
    display: flex;
    align-items: center;
    width: 100%;
}

h1 {
    display: flex;
    margin-left: 10%;
    width: 100%;
    justify-content: center;
}

.close {
    width: 15%;
}

.button__close {
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 25px;
    border: 1px solid #312F2F;
    justify-content: center;
    align-items: center;
    color: #312F2F;
    font-weight: 600;
    background-color: #D2F1E4;
    cursor: pointer;
    &:hover {
        border: 2px solid #5c5c5cb9;
        box-shadow: #D2F1E4 0px 2px 4px 0px, #D2F1E4 0px 2px 16px 0px;
        transform: scale(1.1);
	}
}

.form__modify__post {
    display: flex;
    justify-content: center;
    width: 100%;
}

#text__modify {
    width: 70%;
    border: 2px solid #d3d3d3;
    border-radius: 20px;
    padding: 10px;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover {
        border: 2px solid #5c5c5cb9;
        box-shadow: #D2F1E4 0px 2px 4px 0px, #D2F1E4 0px 2px 16px 0px;
	}
}

.modify__file {
    display: flex;
    justify-content: center;
    width: 70%;
    margin-bottom: 20px;
}

.valid__modify {
    padding: 8px;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 1px solid #312F2F;
    font-weight: 600;
    color: #312F2F;
    background-color: #D2F1E4;
    margin-bottom: 20px;
    cursor: pointer;
    &:hover {
        box-shadow: 2px 2px 2px 2px #D3D3D3;
        opacity: 0.9;
        transform: scale(1.1);
    }
}

button:disabled {
  background-color: #D3D3D3;
  color: black;
}

// média queries

@media (min-width: 280px) {

.post{
  width: 95%;
}

};

@media (max-width: 400px) {

h1 {
    margin-left: 0;
    font-size: 20px;
    width: 90%;
}

};

@media (min-width: 550px) {

.post {
  width: 80%;
}

};

@media (min-width: 700px) {

.post {
  width: 70%;
}

};

@media (min-width: 800px) {

.post {
  width: 60%;
}

};

@media (min-width: 900px) {

.post {
  width: 50%;
}

};

@media (min-width: 1600px) {

.post {
  width: 40%;
}

};

</style>